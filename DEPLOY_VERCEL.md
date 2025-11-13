# 🚀 Guía de Despliegue en Vercel

## 📋 Estado Actual

- **Deployment existente**: `frontend-le0mu6b6x-vai0sxs-projects.vercel.app`
- **Dominio**: `safari-link.vercel.app`
- **Status**: Ready
- **Vercel CLI**: Instalado (v48.8.0)

## 🔧 Paso 1: Configurar Variables de Entorno en Vercel

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `safari-link`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

#### Variables Requeridas:

```bash
# Google Gemini AI (CRÍTICO - Server-side)
GEMINI_API_KEY=your_gemini_api_key_here

# Backend API URL (ajusta según tu backend en producción)
NEXT_PUBLIC_API_URL=https://tu-backend-url.com
NEXT_PUBLIC_API_BASE_URL=https://tu-backend-url.com/api

# AI Service URL (si tienes el mentor bot desplegado)
NEXT_PUBLIC_AI_SERVICE_URL=https://tu-ai-service-url.com

# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here

# Unsplash (opcional)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Mixpanel (opcional)
NEXT_PUBLIC_MIXPANEL_TOKEN=tu_mixpanel_token
```

**⚠️ IMPORTANTE**: Selecciona **Production**, **Preview** y **Development** para cada variable.

### Opción B: Desde CLI

```bash
cd frontend

# Agregar GEMINI_API_KEY (la más importante)
vercel env add GEMINI_API_KEY production preview development
# Cuando te pida el valor, ingresa: your_gemini_api_key_here

# Agregar otras variables según necesites
vercel env add NEXT_PUBLIC_API_URL production preview development
vercel env add NEXT_PUBLIC_AI_SERVICE_URL production preview development
```

## 🚀 Paso 2: Desplegar

### Opción A: Desde CLI (Recomendado)

```bash
cd frontend

# Login (si no estás logueado)
vercel login

# Desplegar a producción
vercel --prod
```

### Opción B: Desde el Dashboard

1. Ve a tu proyecto en Vercel
2. Haz clic en **Deployments**
3. Haz clic en los tres puntos (⋯) del último deployment
4. Selecciona **Redeploy**

## ✅ Paso 3: Verificar Despliegue

### 1. Verificar que el build fue exitoso

En el dashboard de Vercel, verifica que el deployment tenga status **Ready**.

### 2. Probar endpoints de Gemini

```bash
# Probar endpoint de test
curl https://safari-link.vercel.app/api/test-gemini

# Deberías ver:
# {"success":true,"message":"Conexión con Gemini AI exitosa","modelUsed":"gemini-2.5-flash"}
```

### 3. Verificar en el navegador

Visita: `https://safari-link.vercel.app`

## 🔍 Verificación de Variables de Entorno

### Verificar que GEMINI_API_KEY esté configurada:

```bash
cd frontend
vercel env ls
```

Deberías ver `GEMINI_API_KEY` listada.

### Sincronizar variables localmente (opcional):

```bash
cd frontend
vercel env pull .env.local
```

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY is not set"

1. Verifica que la variable esté en Vercel Dashboard
2. Verifica que esté seleccionada para Production
3. **Redeploya** después de agregar la variable

### Error: "Runtime not supported"

Verifica que todos los endpoints API tengan:
```typescript
export const runtime = 'nodejs';
```

### Error: "All models failed"

1. Verifica que `GEMINI_API_KEY` sea válida
2. Revisa los logs en Vercel Dashboard
3. Prueba con `/api/test-gemini`

### Build falla

1. Revisa los logs del build en Vercel
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que TypeScript compile sin errores

## 📝 Checklist de Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] `GEMINI_API_KEY` agregada (sin `NEXT_PUBLIC_` prefix)
- [ ] Variables seleccionadas para Production, Preview y Development
- [ ] `vercel.json` configurado (opcional)
- [ ] Build local funciona: `npm run build`
- [ ] Desplegado con `vercel --prod`
- [ ] Verificado `/api/test-gemini` en producción
- [ ] Frontend funciona correctamente

## 🎯 Comandos Rápidos

```bash
# Desplegar a producción
cd frontend
vercel --prod

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls

# Agregar variable
vercel env add VARIABLE_NAME production preview development

# Sincronizar variables
vercel env pull .env.local
```

## 📚 Referencias

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**¿Listo para desplegar?** Ejecuta `cd frontend && vercel --prod`

