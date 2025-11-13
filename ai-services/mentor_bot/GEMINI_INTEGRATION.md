# Integración Avanzada de Google Gemini AI

Esta documentación describe la implementación mejorada de la integración con Google Gemini AI siguiendo las mejores prácticas.

## Características Implementadas

### ✅ Sistema de Fallback Multi-Modelo
El sistema intenta automáticamente múltiples modelos en orden de preferencia:
1. `gemini-2.5-flash` (más reciente y rápido)
2. `gemini-2.0-flash` (estable y rápido)
3. `gemini-1.5-flash` (compatible y rápido)
4. `gemini-1.5-pro` (más potente, fallback final)

Si un modelo falla, automáticamente intenta el siguiente sin interrumpir el servicio.

### ✅ Configuración Optimizada de Generación
- **Temperature**: 0.7 (balance entre creatividad y consistencia)
- **Top P**: 0.9 (nucleus sampling)
- **Top K**: 40 (limita tokens candidatos)
- **Max Output Tokens**: 1024-1500 (según el caso de uso)

### ✅ Extracción de JSON
El helper puede extraer automáticamente JSON de respuestas que pueden estar envueltas en markdown, útil para respuestas estructuradas.

### ✅ Manejo Robusto de Errores
- Validación de API key al inicio
- Logging detallado para debugging
- Mensajes de error informativos
- Fallback automático entre modelos

### ✅ Endpoint de Prueba
Endpoint `/test-gemini` para validar conectividad y configuración sin afectar el servicio principal.

## Estructura del Código

```
ai-services/mentor_bot/
├── lib/
│   ├── __init__.py
│   └── gemini_advanced.py    # Helper reutilizable
├── main.py                   # API FastAPI principal
└── requirements.txt
```

## Uso del Helper

### Inicialización

```python
from lib.gemini_advanced import get_gemini_client, GeminiConfig

# Obtener instancia del cliente (singleton)
client = get_gemini_client()
```

### Generación Básica

```python
result = client.generate_content(
    prompt="Tu prompt aquí",
    config=GeminiConfig(temperature=0.7, max_output_tokens=1024)
)

if result["success"]:
    print(result["data"])  # Respuesta del modelo
    print(result["model_used"])  # Modelo que se usó
else:
    print(f"Error: {result['error']}")
```

### Generación con Extracción de JSON

```python
result = client.generate_content(
    prompt="Responde con JSON: {\"status\": \"ok\"}",
    config=GeminiConfig(),
    extract_json=True
)

if result["success"]:
    json_data = result["data"]  # Dict parseado
    print(json_data["status"])
```

### Prueba de Conexión

```python
result = client.test_connection()
if result["success"]:
    print(f"Conexión exitosa con modelo: {result['model_used']}")
```

## Configuración de Variables de Entorno

### Desarrollo Local

```bash
export GEMINI_API_KEY=tu_api_key_aqui
```

### Docker / Producción

Agregar en `docker-compose.yml` o variables de entorno del servicio:

```yaml
environment:
  GEMINI_API_KEY: ${GEMINI_API_KEY}
```

### Railway / Vercel

1. **Railway**: Agregar variable en el dashboard del servicio
2. **Vercel**: Usar `vercel env add GEMINI_API_KEY`

## Endpoints de la API

### POST `/ask`
Endpoint principal para hacer preguntas al mentor AI.

**Request:**
```json
{
  "question": "¿Cómo despliego un contrato inteligente?",
  "context": {
    "hackathonName": "EthSafari",
    "chains": ["Arbitrum", "Base"],
    "techStack": ["Solidity", "Hardhat"]
  },
  "conversationHistory": [],
  "language": "es"
}
```

**Response:**
```json
{
  "answer": "Para desplegar un contrato...",
  "suggestedResources": [...],
  "relatedQuestions": [...],
  "language": "es",
  "modelUsed": "gemini-2.5-flash"
}
```

### GET `/test-gemini`
Endpoint de prueba para validar conectividad.

**Response:**
```json
{
  "success": true,
  "message": "Conexión con Gemini AI exitosa",
  "modelUsed": "gemini-2.5-flash",
  "error": null
}
```

### GET `/health`
Health check del servicio.

**Response:**
```json
{
  "status": "healthy",
  "service": "mentor-bot",
  "gemini_configured": true
}
```

## Mejores Prácticas Implementadas

### ✅ Seguridad
- API key nunca se expone al cliente
- Validación de API key al inicio
- Manejo seguro de errores sin exponer información sensible

### ✅ Logging
- Logging estructurado con niveles apropiados
- Información del modelo usado en cada respuesta
- Errores detallados para debugging

### ✅ Resiliencia
- Fallback automático entre modelos
- Manejo de errores en cada capa
- Validación de respuestas antes de retornar

### ✅ Performance
- Instancia única del cliente (singleton)
- Configuración optimizada de generación
- Modelos flash para respuestas rápidas

## Troubleshooting

### Error: "GEMINI_API_KEY no está configurada"
**Solución**: Verificar que la variable de entorno esté configurada:
```bash
echo $GEMINI_API_KEY
```

### Error: "Todos los modelos fallaron"
**Posibles causas**:
1. API key inválida o expirada
2. Problemas de conectividad
3. Cuota de API excedida

**Solución**: 
- Verificar API key en [Google AI Studio](https://aistudio.google.com/)
- Revisar logs para más detalles
- Verificar cuota de API en Google Cloud Console

### Modelo siempre usa el mismo
**Comportamiento esperado**: El sistema usa el primer modelo disponible. Si `gemini-2.5-flash` funciona, no intentará los demás.

## Próximas Mejoras

- [ ] Caché de respuestas para preguntas frecuentes
- [ ] Rate limiting por usuario
- [ ] Métricas de uso por modelo
- [ ] Soporte para streaming de respuestas
- [ ] Historial de conversación mejorado con formato nativo de Gemini

## Referencias

- [Google Generative AI Python SDK](https://github.com/google/generative-ai-python)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)

