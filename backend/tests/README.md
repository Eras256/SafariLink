# Tests de Integración - Gemini AI

## Prerequisitos

Antes de ejecutar los tests, necesitas tener el servicio `mentor_bot` corriendo.

### Iniciar el Servicio Python

En una terminal separada, ejecuta:

```bash
# Navegar al directorio del servicio
cd ai-services/mentor_bot

# Configurar la API key
export GEMINI_API_KEY=your_gemini_api_key_here

# En Windows PowerShell:
$env:GEMINI_API_KEY="your_gemini_api_key_here"

# Iniciar el servicio
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servicio debería estar disponible en `http://localhost:8000`

## Ejecutar los Tests

### Todos los Tests

```bash
cd backend
npm test
```

### Solo Tests de Gemini AI

```bash
cd backend
npm test -- tests/gemini-ai.test.ts
```

### Modo Watch (desarrollo)

```bash
cd backend
npm run test:watch
```

## Tests Incluidos

1. **Health Check** - Verifica que el servicio esté corriendo
2. **Test Gemini Connection** - Prueba la conexión con Gemini AI
3. **Ask Mentor - Pregunta Simple** - Prueba una pregunta básica en inglés
4. **Ask Mentor - Pregunta con Contexto** - Prueba con contexto de hackathon
5. **Ask Mentor - Multilingüe** - Prueba respuesta en Swahili
6. **Error Handling** - Verifica el manejo de errores

## Variables de Entorno

Los tests usan estas variables (con valores por defecto):

- `AI_SERVICE_URL` - URL del servicio mentor_bot (default: `http://localhost:8000`)
- `GEMINI_API_KEY` - API key de Gemini (default: valor hardcodeado para desarrollo)

## Troubleshooting

### Error: "Servicio no disponible"

El servicio Python no está corriendo. Inícialo con los comandos de arriba.

### Error: "GEMINI_API_KEY is not set"

Configura la variable de entorno antes de iniciar el servicio.

### Error: "Connection refused"

Verifica que el servicio esté corriendo en el puerto 8000:
```bash
curl http://localhost:8000/health
```

### Timeout en Tests

Los tests tienen un timeout de 30 segundos. Si fallan por timeout, puede ser que:
- El servicio esté lento
- La API de Gemini esté respondiendo lentamente
- Hay problemas de red

Aumenta el timeout en `jest.config.js` si es necesario.

