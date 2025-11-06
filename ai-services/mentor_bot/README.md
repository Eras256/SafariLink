# 🤖 AI Mentor Bot - Servicio Multilingüe

Asistente AI 24/7 que responde en Swahili, Inglés y Francés, ayudando a participantes africanos con desarrollo Web3.

## 🚀 Inicio Rápido

### Instalación

```bash
cd ai-services/mentor_bot
pip install -r requirements.txt
```

### Configuración

```bash
# Configurar API Key de Google Gemini
export GEMINI_API_KEY=your_gemini_api_key_here
```

O crear un archivo `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Ejecutar Servicio

**Desarrollo Local:**
```bash
uvicorn main:app --reload --port 8000
```

**Producción:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Con Docker:**
```bash
# Desde la raíz del proyecto
docker-compose up mentor-bot
```

El servicio estará disponible en: `http://localhost:8000`

## 📡 API Endpoints

### POST /ask

Preguntar al AI Mentor una pregunta.

**Request:**
```json
{
  "question": "How do I deploy a smart contract?",
  "language": "sw",
  "context": {
    "hackathonId": "eth-safari-2025",
    "hackathonName": "ETH Safari 2025",
    "chains": ["arbitrum", "base"],
    "techStack": ["solidity", "foundry"]
  },
  "conversationHistory": []
}
```

**Response:**
```json
{
  "answer": "Para desplegar un contrato inteligente...",
  "suggestedResources": [
    {
      "title": "Solidity Documentation",
      "url": "https://docs.soliditylang.org/",
      "type": "documentation"
    }
  ],
  "relatedQuestions": [
    "How do I verify my contract on Etherscan?",
    "What are the gas costs for deployment?"
  ],
  "language": "sw"
}
```

### GET /health

Health check del servicio.

**Response:**
```json
{
  "status": "healthy",
  "service": "mentor-bot"
}
```

## 🌍 Idiomas Soportados

- **en** - Inglés (English)
- **sw** - Swahili (Kiswahili)
- **fr** - Francés (Français)

## 🔧 Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | API Key de Google Gemini | ✅ Sí |

## 📦 Dependencias

- `fastapi==0.109.0` - Framework web
- `uvicorn==0.27.0` - Servidor ASGI
- `pydantic==2.5.3` - Validación de datos
- `google-generativeai==0.8.3` - Cliente de Google Gemini
- `python-multipart==0.0.6` - Soporte para multipart forms

## 🐳 Docker

El servicio está configurado en `docker-compose.yml`:

```yaml
mentor-bot:
  build:
    context: ./ai-services/mentor_bot
    dockerfile: Dockerfile
  environment:
    GEMINI_API_KEY: ${GEMINI_API_KEY:-your_gemini_api_key_here}
  ports:
    - "8003:8000"
```

**Ejecutar con Docker Compose:**
```bash
# Desde la raíz del proyecto
docker-compose up mentor-bot
```

**Build manual:**
```bash
cd ai-services/mentor_bot
docker build -t mentor-bot .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_gemini_api_key_here mentor-bot
```

## 🔍 Verificar Instalación

```bash
# Health check
curl http://localhost:8000/health

# Probar pregunta
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do I deploy a smart contract?",
    "language": "en"
  }'
```

## 📝 Ejemplos de Uso

### Pregunta en Swahili

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Ninawezaje kuanza na Solidity?",
    "language": "sw",
    "context": {
      "hackathonName": "ETH Safari 2025",
      "chains": ["arbitrum"],
      "techStack": ["solidity"]
    }
  }'
```

### Pregunta en Francés

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Comment connecter MetaMask à mon dApp?",
    "language": "fr"
  }'
```

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY not found"
- Verificar que la variable de entorno esté configurada
- En desarrollo: `export GEMINI_API_KEY=tu_api_key`
- En Docker: agregar a `.env` o `docker-compose.yml`
- La API key por defecto está configurada en el código

### Error: "Module not found"
- Instalar dependencias: `pip install -r requirements.txt`
- Verificar que estés en el directorio correcto

### Error: "Port already in use"
- Cambiar puerto: `uvicorn main:app --port 8001`
- Matar proceso: `lsof -ti:8000 | xargs kill`

## 📚 Documentación

- [Documentación completa del AI Mentor](../docs/AI_MENTOR_MULTILINGUE.md)
- [API Documentation](./docs/API.md)
- [Anthropic API Documentation](https://docs.anthropic.com/)

## 🔗 Integración con Frontend

El frontend espera el servicio en:
- **Desarrollo local**: `http://localhost:8000`
- **Docker Compose**: `http://localhost:8003`

Configurar en `frontend/.env.local`:
```env
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

O si usas Docker Compose:
```env
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8003
```

---

**¡El AI Mentor está listo para ayudar a participantes africanos con desarrollo Web3!** 🚀

