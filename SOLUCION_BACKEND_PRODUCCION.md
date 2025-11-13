# 🔧 Solución: Backend en Producción - Talent Protocol

## 🎯 Problema

El frontend en Vercel está intentando conectarse a `http://localhost:4000`, lo cual no funciona en producción porque:
- `localhost` solo funciona en tu máquina local
- En producción, el frontend necesita la URL pública del backend

## ✅ Solución

Tienes dos opciones:

### Opción 1: Si YA tienes el backend desplegado

Si ya tienes el backend desplegado en Railway, Render, o cualquier otra plataforma:

1. **Obtén la URL de tu backend** (ejemplo: `https://backend-production.up.railway.app`)

2. **Configura la variable en Vercel:**

```bash
cd frontend

# Agregar la URL del backend
vercel env add NEXT_PUBLIC_API_URL production preview development
# Cuando te pida el valor, ingresa la URL de tu backend (ejemplo: https://backend-production.up.railway.app)

# También agregar la base URL
vercel env add NEXT_PUBLIC_API_BASE_URL production preview development
# Valor: https://tu-backend-url.com/api

# Redeployar
vercel --prod
```

### Opción 2: Si NO tienes el backend desplegado

Sigue la guía en `BACKEND_DEPLOYMENT_RAILWAY.md` para desplegar el backend en Railway, luego sigue los pasos de la Opción 1.

## 🚀 Pasos Rápidos (Si ya tienes backend desplegado)

### 1. Obtener la URL de tu backend

Si está en Railway:
- Ve a tu proyecto en Railway
- Selecciona el servicio del backend
- Ve a la pestaña **Networking**
- Copia la URL pública (ejemplo: `https://backend-production.up.railway.app`)

### 2. Configurar en Vercel desde CLI

```bash
cd C:\Daaps\SafariLink\frontend

# Agregar NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_API_URL production preview development
# Pega la URL de tu backend cuando te la pida

# Agregar NEXT_PUBLIC_API_BASE_URL
vercel env add NEXT_PUBLIC_API_BASE_URL production preview development
# Valor: {tu-backend-url}/api (ejemplo: https://backend-production.up.railway.app/api)

# Verificar que se agregaron
vercel env ls

# Redeployar
vercel --prod
```

### 3. Verificar que funciona

1. Visita tu sitio en Vercel
2. Intenta sincronizar tu perfil de Talent Protocol
3. Debería funcionar sin el error de "localhost:4000"

## 📝 Notas Importantes

- **La variable debe tener el prefijo `NEXT_PUBLIC_`** para que esté disponible en el cliente
- **Debes redeployar** después de agregar variables de entorno
- **Asegúrate de que el backend tenga CORS configurado** para permitir requests desde tu dominio de Vercel

## 🔍 Verificar Variables Configuradas

```bash
cd frontend
vercel env ls
```

Deberías ver:
- `NEXT_PUBLIC_API_URL` ✅
- `NEXT_PUBLIC_API_BASE_URL` ✅

## 🐛 Si aún no funciona

1. Verifica que el backend esté corriendo:
   ```bash
   curl https://tu-backend-url.com/health
   ```

2. Verifica que CORS esté configurado en el backend para permitir tu dominio de Vercel

3. Revisa los logs del frontend en Vercel Dashboard para ver errores específicos

