# 📋 Resumen: Variables de Entorno en Vercel

## ✅ Variables Ya Configuradas

- ✅ `GEMINI_API_KEY` - Production, Preview, Development
- ✅ `NEXT_PUBLIC_REOWN_PROJECT_ID` - Production, Preview, Development  
- ✅ `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` - Production, Preview, Development

## ❌ Variables Faltantes (CRÍTICAS)

Estas variables **DEBEN** agregarse para que Talent Protocol funcione:

### 1. NEXT_PUBLIC_API_URL ⚠️ CRÍTICA

**Valor para Production/Preview:** URL de tu backend en producción
- Ejemplo: `https://backend-production.up.railway.app`
- **DEBES tener el backend desplegado primero**

**Valor para Development:** `http://localhost:4000`

### 2. NEXT_PUBLIC_API_BASE_URL

**Valor para Production/Preview:** `{tu-backend-url}/api`
- Ejemplo: `https://backend-production.up.railway.app/api`

**Valor para Development:** `http://localhost:4000/api`

### 3. NEXT_PUBLIC_APP_URL (Opcional)

**Valor:** `https://safari-link.vercel.app`

### 4. NEXT_PUBLIC_BASE_URL (Opcional)

**Valor:** `https://safari-link.vercel.app`

## 🚀 Cómo Agregar las Variables

### Opción A: Desde CLI (Interactivo)

```bash
cd frontend

# Para cada variable, ejecuta:
vercel env add NEXT_PUBLIC_API_URL production
# Ingresa el valor cuando te lo pida

vercel env add NEXT_PUBLIC_API_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_API_URL development
# Valor: http://localhost:4000
```

### Opción B: Desde Dashboard (Más Fácil)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `frontend`
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Agrega cada variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://tu-backend-url.com` (tu URL real)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Repite para las demás variables

## 📝 Nota sobre Talent Protocol API Key

La API key de Talent Protocol (`your_talent_protocol_api_key_here`) debe estar en el **BACKEND**, no en el frontend.

El frontend solo necesita `NEXT_PUBLIC_API_URL` que apunte al backend donde está configurada la API key.

## ✅ Después de Agregar Variables

```bash
# Verificar
vercel env ls

# Redeployar
vercel --prod
```

## 🔗 Próximos Pasos

1. **Si NO tienes backend desplegado:**
   - Sigue `BACKEND_DEPLOYMENT_RAILWAY.md` para desplegarlo
   - Obtén la URL del backend
   - Agrega `NEXT_PUBLIC_API_URL` con esa URL

2. **Si YA tienes backend desplegado:**
   - Agrega `NEXT_PUBLIC_API_URL` con la URL de tu backend
   - Redeploya el frontend

