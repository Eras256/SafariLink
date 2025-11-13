# Integración de Gemini AI en Next.js - Resumen

## ✅ Implementación Completada

### Archivos Creados

1. **`lib/ai/gemini-advanced.ts`** - Helper server-side con:
   - ✅ Fallback multi-modelo automático
   - ✅ Extracción de JSON de respuestas
   - ✅ Configuración optimizada de generación
   - ✅ Manejo robusto de errores
   - ✅ Logging para debugging

2. **`app/api/test-gemini/route.ts`** - Endpoint de prueba
   - ✅ Runtime Node.js configurado
   - ✅ Validación de conectividad

3. **`app/api/ai/route.ts`** - Endpoint principal
   - ✅ Runtime Node.js configurado
   - ✅ Validación de entrada
   - ✅ Soporte para extracción de JSON
   - ✅ Configuración personalizable

4. **`hooks/useGemini.ts`** - Hook React para cliente
   - ✅ Manejo de estados (loading, error, data)
   - ✅ Timeouts con AbortController
   - ✅ Hook simplificado para testing

5. **`lib/ai/README.md`** - Documentación completa

### Archivos Actualizados

1. **`package.json`** - Dependencia `@google/generative-ai` agregada
2. **`env.example`** - Variable `GEMINI_API_KEY` agregada

## 🚀 Uso Rápido

### 1. Configurar Variable de Entorno

```bash
# Crear .env.local desde env.example
cp env.example .env.local

# Editar .env.local y agregar tu API key
GEMINI_API_KEY=tu_api_key_aqui
```

### 2. Probar la Conexión

```bash
# Iniciar servidor de desarrollo
pnpm dev

# En otra terminal, probar endpoint
curl http://localhost:3000/api/test-gemini
```

### 3. Usar en un Componente

```tsx
'use client';

import { useGemini } from '@/hooks/useGemini';

export function MyComponent() {
  const { callGemini, isLoading, error, data } = useGemini();

  const handleAsk = async () => {
    await callGemini('¿Cómo funciona Web3?');
  };

  return (
    <div>
      <button onClick={handleAsk} disabled={isLoading}>
        Preguntar
      </button>
      {data && <p>{data}</p>}
    </div>
  );
}
```

## 📋 Checklist de Implementación

- [x] Instalar `@google/generative-ai`
- [x] Configurar `GEMINI_API_KEY` en `.env.example`
- [x] Crear helper con instancia única de `GoogleGenerativeAI`
- [x] Implementar fallback multi-modelo con manejo de errores
- [x] Crear API routes que usen el helper
- [x] **Agregar `export const runtime = 'nodejs'` en cada API route**
- [x] Construir prompts estructurados que soliciten JSON
- [x] Extraer y parsear JSON de respuestas (manejando markdown)
- [x] Validar datos antes de retornar
- [x] Implementar timeouts en cliente con `AbortController`
- [x] Manejar estados de carga/error en UI
- [x] Crear endpoint de prueba `/api/test-gemini`
- [x] Retornar formato uniforme `{ success, data, error }`
- [x] Loggear modelo usado para debugging
- [x] Asegurar que API key nunca se exponga al cliente

## 🔒 Seguridad

- ✅ API key solo en variables de entorno (sin `NEXT_PUBLIC_`)
- ✅ Todo ejecuta server-side (nunca se expone al cliente)
- ✅ Validación de entrada en endpoints
- ✅ Manejo seguro de errores sin exponer información sensible

## 🎯 Características Implementadas

### Fallback Multi-Modelo
Orden de intento:
1. `gemini-2.5-flash` (más reciente)
2. `gemini-2.0-flash` (estable)
3. `gemini-1.5-flash` (compatible)
4. `gemini-1.5-pro` (fallback final)

### Configuración Optimizada
- Temperature: 0.7 (balance creatividad/consistencia)
- Top P: 0.9 (nucleus sampling)
- Top K: 40 (limita candidatos)
- Max Output Tokens: 1024 (configurable)

### Extracción de JSON
Puede extraer JSON incluso si está envuelto en markdown:
```typescript
const result = await callGemini(
  'Responde con JSON: {"status": "ok"}',
  {},
  true // extractJson
);
```

## 📚 Documentación

- Ver `lib/ai/README.md` para documentación completa
- Ver `hooks/useGemini.ts` para ejemplos de uso en componentes

## 🚢 Despliegue en Vercel

1. **Configurar variable de entorno en Vercel**:
   - Dashboard → Settings → Environment Variables
   - Agregar `GEMINI_API_KEY`
   - Seleccionar Production, Preview, Development

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

3. **Verificar**:
   ```bash
   curl https://tu-proyecto.vercel.app/api/test-gemini
   ```

## ⚠️ Notas Importantes

- **Runtime Node.js**: Todos los endpoints tienen `export const runtime = 'nodejs'` (crítico para Vercel)
- **Variables de entorno**: `GEMINI_API_KEY` NO tiene prefijo `NEXT_PUBLIC_` (solo server-side)
- **Redeploy necesario**: Después de agregar variables en Vercel, siempre redeploya

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY is not set"
- Verifica `.env.local` en desarrollo
- Verifica variables en Vercel Dashboard en producción
- Reinicia el servidor después de agregar variables

### Error: "Runtime not supported"
- Verifica que todos los endpoints tengan `export const runtime = 'nodejs'`

### Error: "All models failed"
- Verifica que tu API key sea válida
- Revisa logs del servidor
- Prueba con `/api/test-gemini`

## ✨ Próximos Pasos

1. Configurar `GEMINI_API_KEY` en `.env.local`
2. Probar endpoint `/api/test-gemini`
3. Integrar en componentes existentes usando `useGemini`
4. Configurar en Vercel para producción

