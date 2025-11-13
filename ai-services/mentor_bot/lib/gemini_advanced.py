"""
Helper avanzado para integración con Google Gemini AI
Implementa fallback multi-modelo, extracción de JSON, y manejo robusto de errores
"""
import google.generativeai as genai
import os
import re
import json
import logging
from typing import Optional, Dict, Any, List
from enum import Enum

# Configurar logging
logger = logging.getLogger(__name__)

class GeminiModel(str, Enum):
    """Modelos de Gemini disponibles en orden de preferencia"""
    FLASH_2_5 = "gemini-2.5-flash"
    FLASH_2_0 = "gemini-2.0-flash"
    FLASH_1_5 = "gemini-1.5-flash"
    PRO_1_5 = "gemini-1.5-pro"

# Orden de fallback de modelos
MODELS_TO_TRY = [
    GeminiModel.FLASH_2_5,
    GeminiModel.FLASH_2_0,
    GeminiModel.FLASH_1_5,
    GeminiModel.PRO_1_5,
]

class GeminiConfig:
    """Configuración para generación de contenido con Gemini"""
    def __init__(
        self,
        temperature: float = 0.7,
        top_p: float = 0.9,
        top_k: int = 40,
        max_output_tokens: int = 1024
    ):
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k
        self.max_output_tokens = max_output_tokens
    
    def to_dict(self) -> Dict[str, Any]:
        """Convierte la configuración a diccionario para la API"""
        return {
            "temperature": self.temperature,
            "top_p": self.top_p,
            "top_k": self.top_k,
            "max_output_tokens": self.max_output_tokens,
        }

class GeminiClient:
    """Cliente avanzado para Google Gemini AI con fallback multi-modelo"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa el cliente de Gemini
        
        Args:
            api_key: API key de Google Gemini. Si no se proporciona, se lee de GEMINI_API_KEY
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            logger.error("GEMINI_API_KEY no está configurada")
            raise ValueError("GEMINI_API_KEY no está configurada. Configúrala como variable de entorno.")
        
        # Configurar Gemini
        try:
            genai.configure(api_key=self.api_key)
            logger.info("Gemini API configurada correctamente")
        except Exception as e:
            logger.error(f"Error configurando Gemini API: {e}")
            raise
    
    def _get_model(self, model_name: str):
        """Obtiene una instancia del modelo especificado"""
        try:
            return genai.GenerativeModel(model_name)
        except Exception as e:
            logger.warning(f"Error obteniendo modelo {model_name}: {e}")
            raise
    
    def generate_content(
        self,
        prompt: str,
        config: Optional[GeminiConfig] = None,
        extract_json: bool = False,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Genera contenido usando Gemini con fallback multi-modelo
        
        Args:
            prompt: El prompt a enviar al modelo
            config: Configuración de generación (opcional)
            extract_json: Si True, intenta extraer JSON de la respuesta
            conversation_history: Historial de conversación (opcional)
        
        Returns:
            Dict con:
                - success: bool
                - data: contenido generado o JSON parseado
                - model_used: modelo que se usó exitosamente
                - error: mensaje de error si falló
        """
        if config is None:
            config = GeminiConfig()
        
        last_error = None
        model_used = None
        
        # Intentar cada modelo en orden
        for model_name in MODELS_TO_TRY:
            try:
                logger.info(f"Intentando modelo: {model_name}")
                model = self._get_model(model_name.value)
                
                # Construir mensajes si hay historial
                if conversation_history and len(conversation_history) > 0:
                    try:
                        # Intentar usar chat con historial
                        chat = model.start_chat(history=conversation_history)
                        response = chat.send_message(
                            prompt,
                            generation_config=config.to_dict()
                        )
                    except Exception as e:
                        # Si falla el chat, usar generate_content con prompt completo
                        logger.warning(f"Error usando chat con historial, usando prompt completo: {e}")
                        # Construir prompt con historial incluido
                        history_text = "\n".join([
                            f"{msg.get('role', 'user')}: {msg.get('parts', [msg.get('content', '')])[0]}"
                            for msg in conversation_history
                        ])
                        full_prompt_with_history = f"{history_text}\n\nuser: {prompt}"
                        response = model.generate_content(
                            full_prompt_with_history,
                            generation_config=config.to_dict()
                        )
                else:
                    response = model.generate_content(
                        prompt,
                        generation_config=config.to_dict()
                    )
                
                # Extraer texto de la respuesta
                response_text = self._extract_text(response)
                
                if not response_text:
                    raise ValueError("Respuesta vacía del modelo")
                
                model_used = model_name.value
                logger.info(f"Modelo {model_name.value} usado exitosamente")
                
                # Extraer JSON si se solicita
                if extract_json:
                    json_data = self._extract_json_from_response(response_text)
                    return {
                        "success": True,
                        "data": json_data,
                        "model_used": model_used,
                        "raw_response": response_text
                    }
                
                return {
                    "success": True,
                    "data": response_text,
                    "model_used": model_used
                }
                
            except Exception as e:
                last_error = e
                logger.warning(f"Modelo {model_name.value} falló: {str(e)}")
                continue
        
        # Si todos los modelos fallaron
        error_msg = f"Todos los modelos fallaron. Último error: {str(last_error)}"
        logger.error(error_msg)
        return {
            "success": False,
            "error": error_msg,
            "model_used": None
        }
    
    def _extract_text(self, response) -> str:
        """Extrae texto de la respuesta de Gemini"""
        try:
            if hasattr(response, 'text') and response.text:
                return response.text
            elif hasattr(response, 'parts') and response.parts and len(response.parts) > 0:
                return response.parts[0].text
            elif hasattr(response, 'candidates') and response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    if candidate.content.parts and len(candidate.content.parts) > 0:
                        return candidate.content.parts[0].text
                    else:
                        return str(candidate.content)
                else:
                    return str(candidate)
            else:
                return str(response) if response else ""
        except Exception as e:
            logger.error(f"Error extrayendo texto de respuesta: {e}")
            return str(response) if response else ""
    
    def _extract_json_from_response(self, response_text: str) -> Dict[str, Any]:
        """
        Extrae JSON de la respuesta, manejando casos donde está envuelto en markdown
        
        Args:
            response_text: Texto de la respuesta que puede contener JSON
        
        Returns:
            Dict parseado del JSON extraído
        
        Raises:
            ValueError: Si no se encuentra JSON válido
        """
        # Buscar JSON en el texto (puede estar en bloques de código markdown)
        json_pattern = r'\{[\s\S]*\}'
        match = re.search(json_pattern, response_text)
        
        if not match:
            raise ValueError("No se encontró JSON válido en la respuesta")
        
        json_str = match.group(0)
        
        try:
            # Intentar parsear el JSON
            json_data = json.loads(json_str)
            return json_data
        except json.JSONDecodeError as e:
            logger.error(f"Error parseando JSON: {e}")
            raise ValueError(f"JSON inválido: {str(e)}")
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Prueba la conexión con Gemini usando un prompt simple
        
        Returns:
            Dict con success, model_used, y error si aplica
        """
        test_prompt = "Responde con un JSON simple: {\"status\": \"ok\", \"message\": \"Conexión exitosa\"}"
        
        try:
            result = self.generate_content(
                test_prompt,
                config=GeminiConfig(temperature=0.4, max_output_tokens=256),
                extract_json=True
            )
            return result
        except Exception as e:
            logger.error(f"Error en test de conexión: {e}")
            return {
                "success": False,
                "error": str(e),
                "model_used": None
            }

# Instancia global del cliente (singleton)
_client_instance: Optional[GeminiClient] = None

def get_gemini_client() -> GeminiClient:
    """Obtiene o crea la instancia global del cliente Gemini"""
    global _client_instance
    if _client_instance is None:
        _client_instance = GeminiClient()
    return _client_instance

