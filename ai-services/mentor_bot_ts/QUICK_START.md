# 🚀 Quick Start - Mentor Bot TypeScript

## Instalación y Ejecución Rápida

### 1. Instalar Dependencias

```bash
cd ai-services/mentor_bot_ts
npm install
```

### 2. Configurar API Key

**Opción A: Archivo .env**
```bash
cp .env.example .env
# Editar .env y agregar tu GEMINI_API_KEY
```

**Opción B: Variable de Entorno**
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="tu_api_key_aqui"

# Linux/Mac
export GEMINI_API_KEY="tu_api_key_aqui"
```

### 3. Compilar

```bash
npm run build
```

### 4. Ejecutar

**Desarrollo (con hot reload):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

## ✅ Verificar que Funciona

### Health Check
```bash
curl http://localhost:8000/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "service": "mentor-bot",
  "gemini_configured": true
}
```

### Test Gemini Connection
```bash
curl http://localhost:8000/test-gemini
```

### Hacer una Pregunta
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is a smart contract?",
    "language": "en",
    "context": {},
    "conversationHistory": []
  }'
```

## 🐳 Docker

```bash
# Desde la raíz del proyecto
docker-compose up mentor-bot
```

## 📝 Endpoints

- `GET /health` - Health check
- `GET /test-gemini` - Probar conexión con Gemini
- `POST /ask` - Hacer una pregunta al mentor

## 🔧 Troubleshooting

### Error: "GEMINI_API_KEY is not set"
- Verifica que la variable de entorno esté configurada
- Reinicia el servidor después de configurarla

### Error: "Cannot find module"
- Ejecuta `npm install` nuevamente
- Verifica que `node_modules` existe

### Puerto 8000 en uso
- Cambia el puerto: `PORT=8001 npm run dev`
- O detén el proceso que usa el puerto 8000


