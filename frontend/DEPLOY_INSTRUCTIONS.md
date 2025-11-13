# 🚀 Instrucciones de Despliegue en Vercel

## ⚡ Inicio Rápido

### Paso 1: Configurar Variables de Entorno (CRÍTICO)

**Opción A: Dashboard de Vercel (Más Fácil)**

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto `safari-link`
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Agrega estas variables **UNA POR UNA**:

#### Variable 1: GEMINI_API_KEY (MÁS IMPORTANTE)
- **Name**: `GEMINI_API_KEY`
- **Value**: `your_gemini_api_key_here`
- **Environment**: ✅ Production ✅ Preview ✅ Development
- **Save**

#### Variable 2: NEXT_PUBLIC_REOWN_PROJECT_ID
- **Name**: `NEXT_PUBLIC_REOWN_PROJECT_ID`
- **Value**: `your_reown_project_id_here`
- **Environment**: ✅ Production ✅ Preview ✅ Development
- **Save**

#### Variable 3: NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
- **Name**: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- **Value**: `your_unsplash_access_key_here`
- **Environment**: ✅ Production ✅ Preview ✅ Development
- **Save**

**Opción B: CLI de Vercel**

```bash
cd frontend

# GEMINI_API_KEY (la más importante)
vercel env add GEMINI_API_KEY
# Valor: your_gemini_api_key_here
# Selecciona: Production, Preview, Development

# NEXT_PUBLIC_REOWN_PROJECT_ID
vercel env add NEXT_PUBLIC_REOWN_PROJECT_ID
# Valor: your_reown_project_id_here
# Selecciona: Production, Preview, Development

# NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
vercel env add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
# Valor: your_unsplash_access_key_here
# Selecciona: Production, Preview, Development
```

### Paso 2: Desplegar

```bash
cd frontend
vercel --prod
```

O usa el script automático:
```powershell
cd frontend
.\deploy-vercel.ps1
```

## ✅ Verificación Post-Despliegue

### 1. Verificar Build Exitoso
- Ve a Vercel Dashboard → Deployments
- Verifica que el último deployment tenga status **Ready** ✅

### 2. Probar Endpoint de Gemini
```bash
curl https://safari-link.vercel.app/api/test-gemini
```

Deberías ver:
```json
{
  "success": true,
  "message": "Conexión con Gemini AI exitosa",
  "modelUsed": "gemini-2.5-flash"
}
```

### 3. Verificar en el Navegador
Visita: https://safari-link.vercel.app

## 🔍 Verificar Variables Configuradas

```bash
cd frontend
vercel env ls
```

Deberías ver todas las variables listadas.

## ⚠️ IMPORTANTE: Después de Agregar Variables

**SIEMPRE debes redeployar** después de agregar o cambiar variables de entorno:

```bash
cd frontend
vercel --prod
```

O desde el Dashboard:
1. Ve a Deployments
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY is not set"
- ✅ Verifica que la variable esté en Vercel Dashboard
- ✅ Verifica que esté seleccionada para **Production**
- ✅ **Redeploya** después de agregar la variable

### Error: "Runtime not supported"
- ✅ Ya está configurado: todos los endpoints tienen `export const runtime = 'nodejs'`

### Build falla
- ✅ Revisa los logs en Vercel Dashboard
- ✅ Verifica que TypeScript compile: `npm run build`

## 📝 Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] `GEMINI_API_KEY` agregada (sin `NEXT_PUBLIC_` prefix)
- [ ] Variables seleccionadas para Production, Preview y Development
- [ ] Build local funciona: `npm run build`
- [ ] Desplegado con `vercel --prod`
- [ ] Verificado `/api/test-gemini` en producción
- [ ] Frontend funciona correctamente

---

**¿Listo?** Ejecuta: `cd frontend && vercel --prod`

