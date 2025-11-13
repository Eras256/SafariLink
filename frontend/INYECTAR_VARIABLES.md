# 🚀 Inyectar Variables de Entorno en Vercel

## ⚡ Comandos Rápidos

Ejecuta estos comandos desde el directorio `frontend`:

```powershell
cd C:\Daaps\SafariLink\frontend

# 1. NEXT_PUBLIC_API_URL (CRÍTICA - URL de tu backend)
# Reemplaza https://tu-backend-url.com con la URL real de tu backend
vercel env add NEXT_PUBLIC_API_URL production
# Valor: https://tu-backend-url.com (o tu URL real)

vercel env add NEXT_PUBLIC_API_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_API_URL development
# Valor: http://localhost:4000

# 2. NEXT_PUBLIC_API_BASE_URL
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Valor: https://tu-backend-url.com/api

vercel env add NEXT_PUBLIC_API_BASE_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_API_BASE_URL development
# Valor: http://localhost:4000/api

# 3. NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_APP_URL production
# Valor: https://safari-link.vercel.app

vercel env add NEXT_PUBLIC_APP_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_APP_URL development
# Valor: http://localhost:3000

# 4. NEXT_PUBLIC_BASE_URL
vercel env add NEXT_PUBLIC_BASE_URL production
# Valor: https://safari-link.vercel.app

vercel env add NEXT_PUBLIC_BASE_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_BASE_URL development
# Valor: http://localhost:3000
```

## 📝 Nota sobre Talent Protocol

La API key de Talent Protocol (`your_talent_protocol_api_key_here`) debe estar en el **BACKEND**, no en el frontend.

El frontend solo necesita `NEXT_PUBLIC_API_URL` que apunte al backend.

## ✅ Después de Agregar Variables

```bash
# Verificar que se agregaron
vercel env ls

# Redeployar
vercel --prod
```

