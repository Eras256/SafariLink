# 🚀 Inicio Rápido - Mentor Bot

## El servicio no está disponible en el puerto 8000

Si ves el error: **"The AI service is not available. Please ensure the service is running on port 8000"**

Sigue estos pasos para iniciar el servicio:

## ⚡ Inicio Rápido (3 opciones)

### Opción 1: Script PowerShell (Recomendado)

```powershell
cd ai-services\mentor_bot_ts
.\start-service.ps1
```

### Opción 2: Script Batch (Windows)

```cmd
cd ai-services\mentor_bot_ts
start-service.bat
```

### Opción 3: Manual

```powershell
cd ai-services\mentor_bot_ts
$env:GEMINI_API_KEY="your_gemini_api_key_here"
npm run dev
```

## ✅ Verificar que Funciona

Una vez iniciado, verifica en otra terminal:

```powershell
curl http://localhost:8000/health
```

Deberías ver:
```json
{"status":"healthy","service":"mentor-bot","gemini_configured":true}
```

## 🔧 Solución de Problemas

### Puerto 8000 en uso

Si el puerto está ocupado:

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :8000

# Detener el proceso (reemplaza PID con el número que aparezca)
taskkill /PID <PID> /F
```

### Error: "Cannot find module"

```powershell
cd ai-services\mentor_bot_ts
npm install
```

### Error: "GEMINI_API_KEY is not set"

```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

## 🐳 Usar Docker (Alternativa)

Si prefieres usar Docker:

```bash
docker-compose up mentor-bot
```

## 📝 Notas

- El servicio debe estar corriendo **antes** de usar el frontend
- Mantén la terminal abierta mientras uses el servicio
- Para detener: Presiona `Ctrl+C` en la terminal donde está corriendo

## 🎯 Estado del Servicio

Una vez iniciado, el servicio estará disponible en:
- **Health Check**: http://localhost:8000/health
- **Test Gemini**: http://localhost:8000/test-gemini
- **Ask Question**: http://localhost:8000/ask

---

**¿Problemas?** Revisa los logs en la terminal donde ejecutaste el servicio.

