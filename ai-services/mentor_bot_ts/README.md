# SafariLink AI Mentor Bot - Node.js/TypeScript

Servicio de AI Mentor migrado desde Python FastAPI a Node.js/TypeScript. Misma funcionalidad, mejor integración con el stack Node.js.

## 🚀 Inicio Rápido

### Instalación

```bash
cd ai-services/mentor_bot_ts
npm install
```

### Configuración

```bash
# Crear archivo .env
cp .env.example .env

# Editar .env y agregar tu API key
GEMINI_API_KEY=tu_api_key_aqui
```

### Ejecutar

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

El servicio estará disponible en: `http://localhost:8000`

## 📡 API Endpoints

### POST `/ask`

Preguntar al AI Mentor una pregunta.

**Request:**
```json
{
  "question": "How do I deploy a smart contract?",
  "language": "en",
  "context": {
    "hackathonName": "ETH Safari 2025",
    "chains": ["Arbitrum", "Base"],
    "techStack": ["Solidity", "Hardhat"]
  },
  "conversationHistory": []
}
```

**Response:**
```json
{
  "answer": "Para desplegar un contrato inteligente...",
  "suggestedResources": [...],
  "relatedQuestions": [...],
  "language": "en",
  "modelUsed": "gemini-2.5-flash"
}
```

### GET `/health`

Health check del servicio.

### GET `/test-gemini`

Prueba la conectividad con Gemini AI.

## 🌍 Idiomas Soportados

- **en** - Inglés (English)
- **sw** - Swahili (Kiswahili)
- **fr** - Francés (Français)

## 🔧 Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | API Key de Google Gemini | ✅ Sí |
| `PORT` | Puerto del servicio | ❌ No (default: 8000) |

## 📦 Dependencias

- `@google/generative-ai` - Cliente de Google Gemini
- `express` - Framework web
- `cors` - Soporte CORS

## 🆚 Diferencias con la Versión Python

### Ventajas de Node.js/TypeScript

- ✅ Mejor integración con el stack Node.js del proyecto
- ✅ Mismo runtime que el backend principal
- ✅ TypeScript para type safety
- ✅ Misma funcionalidad, mejor rendimiento
- ✅ Fácil despliegue en Railway/Vercel

### Funcionalidad Idéntica

- ✅ Mismo sistema de fallback multi-modelo
- ✅ Mismos prompts y lógica de negocio
- ✅ Mismos endpoints y respuestas
- ✅ Mismo soporte multilingüe

## 🐳 Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
```

## 📝 Migración desde Python

Este servicio es una migración completa del servicio Python. Todas las funcionalidades han sido preservadas:

- ✅ Sistema de fallback multi-modelo
- ✅ Generación de recursos sugeridos
- ✅ Preguntas relacionadas
- ✅ Soporte multilingüe
- ✅ Manejo de contexto de hackathon
- ✅ Historial de conversación

## 🔍 Troubleshooting

### Error: "GEMINI_API_KEY is not set"

Configura la variable de entorno en `.env` o en tu plataforma de despliegue.

### Error: "All models failed"

Verifica que tu API key sea válida y tenga permisos para usar Gemini API.

## 📚 Documentación

Ver la documentación completa en:
- `GEMINI_INTEGRATION.md` - Guía de integración
- Código fuente con comentarios detallados

