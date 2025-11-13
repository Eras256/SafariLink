# 🚂 Guía de Despliegue en Railway - Mentor Bot

Esta guía te ayudará a desplegar el servicio de Mentor Bot (AI Mentor Multilingüe) en Railway.

## 📋 Requisitos Previos

1. Cuenta en [Railway](https://railway.app/)
2. Repositorio conectado a GitHub (Vaios0x/SafariLink)
3. API Key de Google Gemini

## 🚀 Pasos para Desplegar

### 1. Configurar el Servicio en Railway

1. **Conectar el Repositorio:**
   - En Railway, ve a tu proyecto
   - Haz clic en "New Service" → "GitHub Repo"
   - Selecciona el repositorio `Vaios0x/SafariLink`
   - Railway detectará automáticamente el servicio

2. **Configurar el Root Directory:**
   - En la sección **Source** → **Add Root Directory**
   - Ingresa: `ai-services/mentor_bot`
   - Esto le indica a Railway dónde está el código del servicio

3. **Configurar el Branch:**
   - Asegúrate de que el branch conectado sea `main` (o el branch que uses para producción)
   - Railway desplegará automáticamente cuando hagas push a este branch

### 2. Configurar Variables de Entorno

En la sección **Variables** del servicio, agrega:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | API Key de Google Gemini (o tu propia key) |
| `PORT` | (automático) | Railway asigna esto automáticamente, no necesitas configurarlo |

**Nota:** Railway inyecta automáticamente la variable `PORT`, no necesitas configurarla manualmente.

### 3. Configurar Build Settings

En la sección **Build**:

- **Builder:** Dejar en "Railpack" (default) o seleccionar "Dockerfile"
- **Build Command:** Dejar vacío (el Dockerfile maneja todo)
- **Watch Paths:** Agregar patrón `/ai-services/mentor_bot/**` para que Railway detecte cambios

### 4. Configurar Deploy Settings

En la sección **Deploy**:

- **Start Command:** Dejar vacío (el Dockerfile ya tiene el CMD configurado)
- **Healthcheck Path:** `/health`
- **Restart Policy:** 
  - **On Failure:** Habilitado
  - **Max restart retries:** 10

### 5. Configurar Networking

En la sección **Networking**:

- **Public Networking:** Habilitar
- **Generate Domain:** Hacer clic para generar un dominio público
- El dominio será algo como: `mentor-bot-production.up.railway.app`

### 6. Verificar el Despliegue

Una vez desplegado:

1. **Health Check:**
   ```bash
   curl https://tu-dominio.railway.app/health
   ```
   
   Deberías recibir:
   ```json
   {
     "status": "healthy",
     "service": "mentor-bot"
   }
   ```

2. **Probar el Endpoint:**
   ```bash
   curl -X POST https://tu-dominio.railway.app/ask \
     -H "Content-Type: application/json" \
     -d '{
       "question": "How do I deploy a smart contract?",
       "language": "en"
     }'
   ```

## 🔧 Configuración Avanzada

### Usar Config-as-Code (Opcional)

Si prefieres usar un archivo de configuración, ya existe `ai-services/mentor_bot/railway.json`:

1. En Railway, ve a **Config-as-code**
2. Agrega el path: `ai-services/mentor_bot/railway.json`
3. Railway usará esta configuración automáticamente

### Configurar CORS para el Frontend

Si tu frontend está en otro dominio, necesitas actualizar el CORS en `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tu-frontend.railway.app",  # Agregar tu dominio de Railway
        "https://tu-dominio-custom.com",     # O tu dominio custom
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Monitoreo y Logs

- **Logs:** Ve a la pestaña **Logs** en Railway para ver los logs en tiempo real
- **Metrics:** Ve a la pestaña **Metrics** para ver el uso de CPU y memoria
- **Deployments:** Ve a la pestaña **Deployments** para ver el historial de despliegues

## 🐛 Troubleshooting

### El servicio no inicia

1. **Verificar logs:** Revisa los logs en Railway para ver el error específico
2. **Verificar variables de entorno:** Asegúrate de que `GEMINI_API_KEY` esté configurada
3. **Verificar el puerto:** Railway asigna el puerto automáticamente, no uses un puerto fijo

### Error: "Port already in use"

- Railway maneja el puerto automáticamente a través de la variable `PORT`
- El Dockerfile ya está configurado para usar `${PORT:-8000}`
- No necesitas cambiar nada

### Error: "GEMINI_API_KEY not found"

1. Ve a **Variables** en Railway
2. Agrega la variable `GEMINI_API_KEY` con tu API key
3. Reinicia el servicio

### El health check falla

1. Verifica que el endpoint `/health` esté funcionando:
   ```bash
   curl https://tu-dominio.railway.app/health
   ```
2. Asegúrate de que el **Healthcheck Path** esté configurado como `/health`

## 📝 Notas Importantes

- Railway asigna el puerto dinámicamente, siempre usa la variable `PORT`
- El Dockerfile ya está configurado para usar `$PORT` con fallback a 8000
- Los cambios en el código se despliegan automáticamente cuando haces push a `main`
- El servicio se reinicia automáticamente si falla (hasta 10 intentos)

## 🔗 Enlaces Útiles

- [Documentación de Railway](https://docs.railway.app/)
- [Railway Docker Guide](https://docs.railway.app/deploy/dockerfiles)
- [Railway Environment Variables](https://docs.railway.app/deploy/environment-variables)

