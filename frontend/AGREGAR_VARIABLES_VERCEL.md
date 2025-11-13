# 🔧 Agregar Variables de Entorno en Vercel

## ⚠️ IMPORTANTE: Variables Faltantes

Para que Talent Protocol funcione en producción, necesitas agregar estas variables:

## 📋 Variables a Agregar

### 1. NEXT_PUBLIC_API_URL (CRÍTICA)

Esta es la URL de tu backend en producción. **DEBES tener el backend desplegado primero.**

```bash
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# Cuando te pida el valor, ingresa: https://tu-backend-url.com
# (reemplaza con la URL real de tu backend en Railway o donde lo tengas)

vercel env add NEXT_PUBLIC_API_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_API_URL development
# Puedes usar: http://localhost:4000
```

### 2. NEXT_PUBLIC_API_BASE_URL

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Valor: https://tu-backend-url.com/api

vercel env add NEXT_PUBLIC_API_BASE_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_API_BASE_URL development
# Valor: http://localhost:4000/api
```

### 3. NEXT_PUBLIC_APP_URL (Opcional pero recomendado)

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Valor: https://safari-link.vercel.app

vercel env add NEXT_PUBLIC_APP_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_APP_URL development
# Valor: http://localhost:3000
```

### 4. NEXT_PUBLIC_BASE_URL (Opcional)

```bash
vercel env add NEXT_PUBLIC_BASE_URL production
# Valor: https://safari-link.vercel.app

vercel env add NEXT_PUBLIC_BASE_URL preview
# Mismo valor

vercel env add NEXT_PUBLIC_BASE_URL development
# Valor: http://localhost:3000
```

## 🚀 Después de Agregar Variables

```bash
# Redeployar para aplicar los cambios
vercel --prod
```

## 📝 Nota sobre Talent Protocol API Key

La API key de Talent Protocol (`your_talent_protocol_api_key_here`) debe estar en el **BACKEND**, no en el frontend. El frontend solo necesita la URL del backend.

