# 🚀 Guía Completa: Cómo Replicar el Uso de Gemini AI en Otro Proyecto

Esta guía te muestra **exactamente** cómo SafariLink integra Google Gemini AI y cómo puedes replicarlo en tu propio proyecto.

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de la Integración](#arquitectura-de-la-integración)
3. [Instalación de Dependencias](#instalación-de-dependencias)
4. [Configuración de API Key](#configuración-de-api-key)
5. [Implementación del Helper Avanzado](#implementación-del-helper-avanzado)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
8. [Manejo de Errores](#manejo-de-errores)
9. [Sistema de Fallback](#sistema-de-fallback)
10. [Casos de Uso Completos](#casos-de-uso-completos)

---

## 🎯 Resumen Ejecutivo

### Modelos de Gemini Utilizados (en orden de fallback)

1. **`gemini-2.5-flash`** - Modelo principal (más reciente y rápido)
2. **`gemini-2.0-flash`** - Fallback 1
3. **`gemini-1.5-flash`** - Fallback 2
4. **`gemini-1.5-pro`** - Fallback 3 (más potente pero más lento)

### Características Clave

- ✅ **Sistema de fallback automático** - Si un modelo falla, prueba el siguiente
- ✅ **Manejo robusto de errores** - Captura y maneja todos los errores posibles
- ✅ **Extracción de JSON** - Opción para extraer JSON de respuestas
- ✅ **Configuración flexible** - Temperature, topP, topK, maxOutputTokens
- ✅ **Soporte multi-idioma** - Inglés, Swahili, Francés
- ✅ **Historial de conversación** - Soporte para conversaciones contextuales

---

## 🏗️ Arquitectura de la Integración

```
┌─────────────────────────────────────────────────────────┐
│                    TU APLICACIÓN                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────────────────┐   │
│  │   Frontend   │─────▶│   API Route/Endpoint     │   │
│  │  (React/UI)  │      │   (/api/chat, /api/ask)  │   │
│  └──────────────┘      └──────────────────────────┘   │
│                              │                          │
│                              ▼                          │
│  ┌──────────────┐      ┌──────────────────────────┐   │
│  │   Backend    │─────▶│   Gemini Helper          │   │
│  │ (FastAPI/    │      │   (gemini-advanced.ts)    │   │
│  │  Express)    │      └──────────────────────────┘   │
│  └──────────────┘              │                        │
│                                ▼                        │
│                      ┌──────────────────────────┐      │
│                      │   Google Gemini API      │      │
│                      │   (gemini-2.5-flash)     │      │
│                      └──────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Instalación de Dependencias

### Para Proyectos TypeScript/Node.js

```bash
npm install @google/generative-ai
# o
yarn add @google/generative-ai
# o
pnpm add @google/generative-ai
```

### Para Proyectos Python

```bash
pip install google-generativeai
```

O en `requirements.txt`:

```txt
google-generativeai==0.8.3
```

---

## 🔑 Configuración de API Key

### 1. Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la key (formato: `AIzaSy...`)

### 2. Configurar Variable de Entorno

**IMPORTANTE**: Nunca hardcodees la API key en el código. Siempre usa variables de entorno.

#### En Desarrollo Local

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="tu_api_key_aqui"
```

**Windows (CMD):**
```cmd
set GEMINI_API_KEY=tu_api_key_aqui
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="tu_api_key_aqui"
```

#### En Archivo `.env` (Next.js, Node.js)

Crea un archivo `.env.local` o `.env`:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

**⚠️ IMPORTANTE para Next.js:**
- Si usas la API key en el **servidor** (API routes, Server Components): NO uses prefijo `NEXT_PUBLIC_`
- Si necesitas la API key en el **cliente**: Usa `NEXT_PUBLIC_GEMINI_API_KEY` (pero NO es recomendado por seguridad)

#### En Producción (Vercel, Railway, etc.)

**Vercel:**
```bash
vercel env add GEMINI_API_KEY production preview development
```

**Railway:**
- Agrega la variable en el dashboard de Railway

**Docker:**
```yaml
# docker-compose.yml
services:
  app:
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

---

## 💻 Implementación del Helper Avanzado

### Versión TypeScript/Node.js

Crea el archivo `lib/gemini-advanced.ts` (o `src/lib/gemini-advanced.ts`):

```typescript
/**
 * Advanced helper for Google Gemini AI integration
 * Implements multi-model fallback, JSON extraction, and robust error handling
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate that API key is configured
if (!process.env.GEMINI_API_KEY) {
  console.error('[AI] GEMINI_API_KEY is not set');
}

// Single instance of GoogleGenerativeAI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Model fallback order (try newest first, fallback to older if needed)
const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

export type GeminiModel = typeof modelsToTry[number];

export interface GeminiConfig {
  temperature?: number;      // 0.0 - 2.0 (default: 0.7)
  topP?: number;            // 0.0 - 1.0 (default: 0.9)
  topK?: number;            // 1 - 100 (default: 40)
  maxOutputTokens?: number;  // 1 - 8192 (default: 1024)
}

export interface GeminiResponse<T = any> {
  success: boolean;
  data?: T;
  modelUsed?: string;
  error?: string;
}

/**
 * Default configuration optimized for generation
 */
const defaultConfig: Required<GeminiConfig> = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
};

/**
 * Calls Gemini AI with multi-model fallback
 * 
 * @param prompt - The prompt to send to the model
 * @param config - Generation configuration (optional)
 * @param extractJson - If true, attempts to extract JSON from response
 * @returns Response with success, data, modelUsed and error if applicable
 */
export async function callGemini(
  prompt: string,
  config: GeminiConfig = {},
  extractJson: boolean = false
): Promise<GeminiResponse> {
  if (!genAI) {
    const error = 'Gemini API key not configured. Set GEMINI_API_KEY environment variable.';
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
    };
  }

  // Combine configuration with default values
  const generationConfig = {
    ...defaultConfig,
    ...config,
  };

  let result: any = null;
  let modelUsed: string | undefined;
  let lastError: Error | null = null;

  // Try each model in order
  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Trying model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      result = await model.generateContent(prompt);
      modelUsed = modelName;
      
      console.log(`[AI] Model ${modelName} used successfully`);
      break;
    } catch (error: any) {
      lastError = error;
      console.warn(`[AI] Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  // If all models failed
  if (!result) {
    const error = `All models failed: ${lastError?.message || 'Unknown error'}`;
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
      modelUsed: undefined,
    };
  }

  // Extract text from response
  let responseText: string;
  try {
    responseText = result.response.text();
  } catch (error: any) {
    const errorMsg = `Error extracting text from response: ${error.message}`;
    console.error(`[AI] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      modelUsed,
    };
  }

  // If JSON extraction is requested
  if (extractJson) {
    try {
      const jsonData = extractJsonFromResponse(responseText);
      return {
        success: true,
        data: jsonData,
        modelUsed,
      };
    } catch (error: any) {
      console.error(`[AI] Error extracting JSON:`, error.message);
      return {
        success: false,
        error: `Failed to extract JSON: ${error.message}`,
        modelUsed,
      };
    }
  }

  // Return plain text
  return {
    success: true,
    data: responseText,
    modelUsed,
  };
}

/**
 * Extracts JSON from a response that may be wrapped in markdown
 * 
 * @param responseText - Response text
 * @returns Parsed JSON object
 */
function extractJsonFromResponse(responseText: string): any {
  // Search for JSON in text (may be in markdown code blocks)
  const jsonPattern = /\{[\s\S]*\}/;
  const match = responseText.match(jsonPattern);

  if (!match) {
    throw new Error('No valid JSON found in response');
  }

  const jsonStr = match[0];

  try {
    return JSON.parse(jsonStr);
  } catch (error: any) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

/**
 * Tests connection with Gemini AI
 * 
 * @returns Response with connection status
 */
export async function testGeminiConnection(): Promise<GeminiResponse> {
  const testPrompt = 'Respond with a simple JSON: {"status": "ok", "message": "Connection successful"}';
  
  return callGemini(
    testPrompt,
    {
      temperature: 0.4,
      maxOutputTokens: 256,
    },
    true // Extract JSON
  );
}
```

### Versión Python

Crea el archivo `lib/gemini_advanced.py`:

```python
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
```

---

## 📝 Ejemplos de Uso

### 1. Uso Básico (TypeScript)

```typescript
import { callGemini } from './lib/gemini-advanced';

// Llamada simple
const result = await callGemini("¿Qué es blockchain?");

if (result.success) {
  console.log("Respuesta:", result.data);
  console.log("Modelo usado:", result.modelUsed);
} else {
  console.error("Error:", result.error);
}
```

### 2. Uso con Configuración Personalizada

```typescript
import { callGemini, GeminiConfig } from './lib/gemini-advanced';

const config: GeminiConfig = {
  temperature: 0.8,        // Más creativo
  topP: 0.95,              // Mayor diversidad
  maxOutputTokens: 2048,   // Respuestas más largas
};

const result = await callGemini(
  "Explica cómo funciona un smart contract en Solidity",
  config
);
```

### 3. Extracción de JSON

```typescript
import { callGemini } from './lib/gemini-advanced';

const result = await callGemini(
  'Responde con un JSON: {"nombre": "Juan", "edad": 30}',
  {},
  true // extractJson = true
);

if (result.success) {
  const data = result.data; // Ya es un objeto JSON parseado
  console.log(data.nombre); // "Juan"
}
```

### 4. Uso en API Route (Next.js)

Crea `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiConfig } from '@/lib/gemini-advanced';

export const runtime = 'nodejs'; // IMPORTANTE: No usar Edge Runtime

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const config: GeminiConfig = {
      temperature: 0.7,
      maxOutputTokens: 1500,
    };

    const result = await callGemini(message, config);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: result.data,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 5. Uso en FastAPI (Python)

```python
from fastapi import FastAPI, HTTPException
from lib.gemini_advanced import get_gemini_client, GeminiConfig

app = FastAPI()

@app.post("/chat")
async def chat(message: str):
    try:
        client = get_gemini_client()
        
        config = GeminiConfig(
            temperature=0.7,
            max_output_tokens=1500
        )
        
        result = client.generate_content(message, config)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Error desconocido")
            )
        
        return {
            "message": result.get("data"),
            "model_used": result.get("model_used")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 6. Uso en Express (Node.js)

```typescript
import express from 'express';
import { callGemini, GeminiConfig } from './lib/gemini-advanced';

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const config: GeminiConfig = {
      temperature: 0.7,
      maxOutputTokens: 1500,
    };

    const result = await callGemini(message, config);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      message: result.data,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### 7. Hook React (Frontend)

Crea `hooks/useGemini.ts`:

```typescript
import { useState, useCallback } from 'react';

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const callGemini = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error('Error calling API');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { callGemini, isLoading, error, data };
}
```

Uso en componente:

```typescript
import { useGemini } from '@/hooks/useGemini';

function ChatComponent() {
  const { callGemini, isLoading, error, data } = useGemini();

  const handleSend = async () => {
    try {
      await callGemini("Hola, ¿cómo estás?");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleSend} disabled={isLoading}>
        Enviar
      </button>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>{data.message}</p>}
    </div>
  );
}
```

---

## 🔧 Configuración de Variables de Entorno

### Archivo `.env.example`

```env
# Google Gemini API Key
GEMINI_API_KEY=tu_api_key_aqui
```

### Archivo `.env.local` (Next.js)

```env
GEMINI_API_KEY=tu_api_key_aqui
```

**⚠️ IMPORTANTE**: Agrega `.env.local` a `.gitignore` para no subir la API key al repositorio.

### Verificación de Configuración

```typescript
// test-gemini.ts
import { testGeminiConnection } from './lib/gemini-advanced';

async function test() {
  const result = await testGeminiConnection();
  
  if (result.success) {
    console.log('✅ Gemini configurado correctamente');
    console.log('Modelo usado:', result.modelUsed);
  } else {
    console.error('❌ Error:', result.error);
  }
}

test();
```

---

## ⚠️ Manejo de Errores

### Errores Comunes y Soluciones

#### 1. "GEMINI_API_KEY is not set"

**Causa**: La variable de entorno no está configurada.

**Solución**:
```bash
# Verificar que esté configurada
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows CMD
$env:GEMINI_API_KEY    # Windows PowerShell
```

#### 2. "All models failed"

**Causa**: Todos los modelos fallaron (puede ser API key inválida, límite de cuota, etc.).

**Solución**:
- Verifica que la API key sea válida
- Revisa los límites de cuota en Google AI Studio
- Verifica tu conexión a internet

#### 3. "Error extracting text from response"

**Causa**: La respuesta de Gemini no tiene el formato esperado.

**Solución**: El helper ya maneja esto automáticamente con el sistema de fallback.

### Implementación de Retry Logic

```typescript
async function callGeminiWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<GeminiResponse> {
  let lastError: GeminiResponse | null = null;

  for (let i = 0; i < maxRetries; i++) {
    const result = await callGemini(prompt);
    
    if (result.success) {
      return result;
    }
    
    lastError = result;
    
    // Esperar antes de reintentar (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
  }

  return lastError || {
    success: false,
    error: 'Max retries exceeded',
  };
}
```

---

## 🔄 Sistema de Fallback

El sistema de fallback funciona automáticamente:

1. **Intenta `gemini-2.5-flash`** (más reciente y rápido)
2. Si falla, intenta **`gemini-2.0-flash`**
3. Si falla, intenta **`gemini-1.5-flash`**
4. Si falla, intenta **`gemini-1.5-pro`** (más potente pero más lento)
5. Si todos fallan, retorna error

### Personalizar Orden de Fallback

```typescript
// En gemini-advanced.ts, modifica modelsToTry:
const modelsToTry = [
  'gemini-1.5-pro',  // Priorizar modelo más potente
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
] as const;
```

---

## 🎯 Casos de Uso Completos

### Caso 1: Chatbot Simple

```typescript
// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini-advanced';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { message, history = [] } = await request.json();

  // Construir prompt con historial
  let fullPrompt = message;
  if (history.length > 0) {
    const historyText = history
      .slice(-5) // Últimos 5 mensajes
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    fullPrompt = `${historyText}\n\nUser: ${message}`;
  }

  const result = await callGemini(fullPrompt, {
    temperature: 0.7,
    maxOutputTokens: 1500,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    response: result.data,
    modelUsed: result.modelUsed,
  });
}
```

### Caso 2: Generación de Código

```typescript
// app/api/generate-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini-advanced';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { description, language } = await request.json();

  const prompt = `Genera código ${language} para: ${description}
  
Requisitos:
- Código completo y funcional
- Incluir comentarios explicativos
- Seguir mejores prácticas
- Formatear con markdown code blocks`;

  const result = await callGemini(prompt, {
    temperature: 0.3, // Más determinístico para código
    maxOutputTokens: 2048,
  });

  return NextResponse.json({
    code: result.data,
    modelUsed: result.modelUsed,
  });
}
```

### Caso 3: Análisis de Texto

```typescript
// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini-advanced';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  const prompt = `Analiza el siguiente texto y responde en formato JSON:
{
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2"],
  "summary": "resumen del texto",
  "keyPoints": ["punto1", "punto2"]
}

Texto: ${text}`;

  const result = await callGemini(prompt, {}, true); // extractJson = true

  return NextResponse.json({
    analysis: result.data,
    modelUsed: result.modelUsed,
  });
}
```

---

## 📊 Resumen de Configuración

### Checklist de Implementación

- [ ] Instalar dependencia (`@google/generative-ai` o `google-generativeai`)
- [ ] Obtener API key de Google AI Studio
- [ ] Configurar variable de entorno `GEMINI_API_KEY`
- [ ] Crear helper `gemini-advanced.ts` o `gemini_advanced.py`
- [ ] Implementar endpoint/route para llamadas a Gemini
- [ ] Agregar manejo de errores
- [ ] Probar conexión con `testGeminiConnection()`
- [ ] Agregar `.env.local` a `.gitignore`
- [ ] Configurar variables en producción (Vercel, Railway, etc.)

### Parámetros de Configuración Recomendados

| Caso de Uso | Temperature | Top P | Max Tokens |
|------------|-------------|-------|------------|
| Chat general | 0.7 | 0.9 | 1500 |
| Generación de código | 0.3 | 0.8 | 2048 |
| Análisis/Resumen | 0.4 | 0.9 | 1024 |
| Creativo/Narrativa | 0.9 | 0.95 | 2048 |
| Respuestas técnicas | 0.5 | 0.9 | 1500 |

---

## ⚠️ Solución de Problemas Comunes

### Error: "models/gemini-pro is not found"

**Causa**: Estás intentando usar `gemini-pro`, un modelo obsoleto que ya no está disponible.

**Solución**: Asegúrate de usar solo los modelos actuales:
- ✅ `gemini-2.5-flash`
- ✅ `gemini-2.0-flash`
- ✅ `gemini-1.5-flash`
- ✅ `gemini-1.5-pro`
- ❌ `gemini-pro` (OBSOLETO - NO USAR)
- ❌ `gemini-pro-vision` (OBSOLETO - NO USAR)

**Verificación**: Revisa que tu lista de modelos en `modelsToTry` no incluya modelos obsoletos:

```typescript
// ✅ CORRECTO
const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

// ❌ INCORRECTO (incluye modelo obsoleto)
const modelsToTry = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',  // ❌ Este modelo ya no existe
] as const;
```

### Error: "404 Not Found - models/gemini-X is not found"

**Causa**: El modelo que intentas usar no existe o no está disponible para tu API key.

**Soluciones**:
1. Verifica que el nombre del modelo sea correcto (sin espacios, con guiones)
2. Asegúrate de que tu API key tenga acceso al modelo
3. Revisa la [documentación oficial de Gemini](https://ai.google.dev/models/gemini) para ver modelos disponibles
4. Usa el sistema de fallback automático que intenta múltiples modelos

### Error: "API key not configured"

**Causa**: La variable de entorno `GEMINI_API_KEY` no está configurada.

**Solución**:
```bash
# Verificar que esté configurada
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows CMD
$env:GEMINI_API_KEY    # Windows PowerShell

# Si no está, configurarla
export GEMINI_API_KEY="tu_api_key"  # Linux/Mac
set GEMINI_API_KEY=tu_api_key        # Windows CMD
$env:GEMINI_API_KEY="tu_api_key"     # Windows PowerShell
```

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca hardcodees la API key** en el código
2. **No expongas la API key al cliente** (solo en server-side)
3. **Usa variables de entorno** siempre
4. **Agrega `.env.local` a `.gitignore`**
5. **Rota la API key** si se compromete
6. **Configura límites de rate limiting** en producción
7. **Monitorea el uso** de la API key

### Rate Limiting (Ejemplo con Express)

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Too many requests from this IP',
});

app.use('/api/chat', limiter);
```

---

## 🎓 Conclusión

Esta guía te muestra **exactamente** cómo SafariLink integra Gemini AI. Los componentes clave son:

1. **Helper avanzado** con fallback automático
2. **Manejo robusto de errores**
3. **Configuración flexible**
4. **Soporte para JSON extraction**
5. **Sistema de fallback multi-modelo**

Con esta implementación, tendrás una integración robusta y confiable de Gemini AI en tu proyecto.

---

## 📚 Recursos Adicionales

- [Documentación oficial de Gemini](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Ejemplos de código Gemini](https://github.com/google/generative-ai-node)

---

**¿Preguntas?** Revisa el código fuente de SafariLink en:
- `frontend/lib/ai/gemini-advanced.ts` (TypeScript)
- `ai-services/mentor_bot/lib/gemini_advanced.py` (Python)
- `ai-services/mentor_bot_ts/src/lib/gemini-advanced.ts` (TypeScript)

