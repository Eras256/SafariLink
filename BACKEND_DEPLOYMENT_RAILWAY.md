# 🚂 Desplegar Backend en Railway

## 📋 Pasos para Desplegar el Backend

### 1. Crear Servicio en Railway

1. Ve a [Railway Dashboard](https://railway.app/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Haz clic en **"New Service"** → **"GitHub Repo"**
4. Selecciona el repositorio `Vaios0x/SafariLink`
5. Railway detectará automáticamente el servicio

### 2. Configurar Root Directory

1. En la sección **Source** → **Add Root Directory**
2. Ingresa: `backend`
3. Esto le indica a Railway dónde está el código del backend

### 3. Configurar Variables de Entorno

En la sección **Variables** del servicio, agrega:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Para SQLite (recomendado para empezar) |
| `JWT_SECRET` | `temporary-secret-key-min-32-characters-long-for-development-only` | Secret key para JWT tokens (cambiar en producción) |
| `TALENT_PROTOCOL_API_KEY` | `your_talent_protocol_api_key_here` | API Key de Talent Protocol |
| `NODE_ENV` | `production` | Entorno de producción |
| `PORT` | (automático) | Railway asigna esto automáticamente |

**Nota:** Railway inyecta automáticamente la variable `PORT`, no necesitas configurarla manualmente. El backend ya está configurado para usar `process.env.PORT || 4000`.

### 4. Configurar Build Settings

En la sección **Build**:
- **Builder:** Seleccionar "Dockerfile"
- **Dockerfile Path:** `backend/Dockerfile`
- **Build Command:** Dejar vacío (el Dockerfile maneja todo)

### 5. Configurar Deploy Settings

En la sección **Deploy**:
- **Start Command:** `npm start`
- **Healthcheck Path:** `/health`
- **Restart Policy:** 
  - **On Failure:** Habilitado
  - **Max restart retries:** 10

### 6. Configurar Networking

1. En la sección **Networking**
2. **Public Networking:** Habilitar
3. **Generate Domain:** Hacer clic para generar un dominio público
4. El dominio será algo como: `backend-production.up.railway.app`
5. **⚠️ IMPORTANTE:** Copia esta URL, la necesitarás para configurar Vercel

### 7. Verificar el Despliegue

Una vez desplegado:

```bash
# Health Check
curl https://tu-backend.railway.app/health

# Deberías recibir:
# {"status":"healthy","timestamp":"..."}
```

## 🔧 Configurar Frontend en Vercel

Una vez que tengas la URL del backend en Railway (ejemplo: `https://backend-production.up.railway.app`):

### Opción A: Desde CLI (Recomendado)

```bash
cd frontend

# Agregar la URL del backend
vercel env add NEXT_PUBLIC_API_URL production preview development
# Cuando te pida el valor, ingresa: https://tu-backend.railway.app
# (reemplaza con tu URL real de Railway)

# También agregar la base URL
vercel env add NEXT_PUBLIC_API_BASE_URL production preview development
# Valor: https://tu-backend.railway.app/api

# Redeployar para aplicar los cambios
vercel --prod
```

### Opción B: Desde Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `frontend`
3. Ve a **Settings** → **Environment Variables**
4. Agrega:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://tu-backend.railway.app` (tu URL de Railway)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
5. Agrega también:
   - **Name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://tu-backend.railway.app/api`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Haz clic en **Save**
7. Ve a **Deployments** y haz **Redeploy** del último deployment

## 📝 Notas Importantes

- Railway asigna el puerto dinámicamente, siempre usa la variable `PORT`
- El backend debe estar configurado para usar `process.env.PORT || 4000`
- Los cambios en el código se despliegan automáticamente cuando haces push a `main`
- El servicio se reinicia automáticamente si falla (hasta 10 intentos)

## 🔗 Enlaces Útiles

- [Documentación de Railway](https://docs.railway.app/)
- [Railway Docker Guide](https://docs.railway.app/deploy/dockerfiles)
- [Railway Environment Variables](https://docs.railway.app/deploy/environment-variables)

