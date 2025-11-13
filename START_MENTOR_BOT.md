# 🚀 Iniciar Mentor Bot - Guía Rápida

## ⚠️ Error: "The AI service is not available"

Si ves este error, el servicio Mentor Bot no está corriendo. Sigue estos pasos:

## 📋 Pasos Rápidos

### 1. Abrir Terminal

Abre PowerShell o CMD en el proyecto.

### 2. Navegar al Directorio

```powershell
cd ai-services\mentor_bot_ts
```

### 3. Iniciar el Servicio

**Opción A - Script Automático:**
```powershell
.\start-service.ps1
```

**Opción B - Manual:**
```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
npm run dev
```

### 4. Verificar

En otra terminal, prueba:
```powershell
curl http://localhost:8000/health
```

Si ves `{"status":"healthy"...}`, ¡está funcionando! ✅

## 🎯 Comandos Útiles

### Iniciar Servicio
```powershell
cd ai-services\mentor_bot_ts
.\start-service.ps1
```

### Verificar Estado
```powershell
curl http://localhost:8000/health
```

### Probar Gemini
```powershell
curl http://localhost:8000/test-gemini
```

### Detener Servicio
Presiona `Ctrl+C` en la terminal donde está corriendo.

## 🔧 Problemas Comunes

### Puerto 8000 ocupado
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :8000
# Detener proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Dependencias faltantes
```powershell
cd ai-services\mentor_bot_ts
npm install
```

### No compila
```powershell
cd ai-services\mentor_bot_ts
npm run build
```

## 📍 Ubicación del Servicio

El servicio está en: `ai-services/mentor_bot_ts/`

## ✅ Estado Actual

El servicio debería estar corriendo ahora. Si no, ejecuta los pasos de arriba.

---

**¿Necesitas ayuda?** Revisa `ai-services/mentor_bot_ts/INICIO_RAPIDO.md`

