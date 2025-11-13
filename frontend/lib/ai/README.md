# Integración de Gemini AI en Next.js

Esta documentación describe cómo usar la integración de Google Gemini AI en el frontend Next.js.

## Estructura

```
frontend/
├── lib/
│   └── ai/
│       ├── gemini-advanced.ts    # Helper server-side
│       └── README.md              # Esta documentación
├── app/
│   └── api/
│       ├── ai/
│       │   └── route.ts           # Endpoint principal
│       └── test-gemini/
│           └── route.ts           # Endpoint de prueba
└── hooks/
    └── useGemini.ts               # Hook React para cliente
```

## Configuración

### 1. Variable de Entorno

Agrega `GEMINI_API_KEY` a tu archivo `.env.local`:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

**⚠️ Importante**: Esta variable NO tiene el prefijo `NEXT_PUBLIC_` porque es solo para el servidor. Nunca se expone al cliente.

### 2. Instalación

La dependencia `@google/generative-ai` ya está instalada. Si necesitas reinstalarla:

```bash
pnpm add @google/generative-ai
```

## Uso desde el Servidor (API Routes)

### Helper Básico

```typescript
import { callGemini } from '@/lib/ai/gemini-advanced';

// Llamada simple
const result = await callGemini('Tu prompt aquí');

if (result.success) {
  console.log(result.data); // Respuesta del modelo
  console.log(result.modelUsed); // Modelo usado
} else {
  console.error(result.error);
}
```

### Con Extracción de JSON

```typescript
const result = await callGemini(
  'Responde con JSON: {"status": "ok"}',
  { temperature: 0.7 },
  true // extractJson
);

if (result.success) {
  const jsonData = result.data; // Ya parseado como objeto
}
```

### Con Configuración Personalizada

```typescript
const result = await callGemini(
  'Tu prompt',
  {
    temperature: 0.5,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
);
```

## Uso desde el Cliente (Componentes React)

### Hook `useGemini`

```tsx
'use client';

import { useGemini } from '@/hooks/useGemini';

export function MyComponent() {
  const { callGemini, isLoading, error, data, modelUsed } = useGemini({
    timeout: 30000, // 30 segundos
    extractJson: false,
    config: {
      temperature: 0.7,
    },
  });

  const handleAsk = async () => {
    try {
      const response = await callGemini('¿Cómo funciona Web3?');
      console.log('Respuesta:', response);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <button onClick={handleAsk} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Preguntar'}
      </button>
      {error && <p className="error">{error}</p>}
      {data && <p>{data}</p>}
      {modelUsed && <p>Modelo: {modelUsed}</p>}
    </div>
  );
}
```

### Hook `useTestGemini`

Para probar la conexión:

```tsx
'use client';

import { useTestGemini } from '@/hooks/useGemini';

export function TestComponent() {
  const { testConnection, isLoading, error, result } = useTestGemini();

  return (
    <div>
      <button onClick={testConnection} disabled={isLoading}>
        Probar Conexión
      </button>
      {isLoading && <p>Probando...</p>}
      {error && <p className="error">{error}</p>}
      {result && (
        <div>
          <p>{result.message}</p>
          {result.modelUsed && <p>Modelo: {result.modelUsed}</p>}
        </div>
      )}
    </div>
  );
}
```

## Endpoints de API

### GET `/api/test-gemini`

Prueba la conectividad con Gemini AI.

**Response:**
```json
{
  "success": true,
  "message": "Conexión con Gemini AI exitosa",
  "modelUsed": "gemini-2.5-flash",
  "data": {
    "status": "ok",
    "message": "Conexión exitosa"
  }
}
```

### POST `/api/ai`

Endpoint principal para llamadas a Gemini.

**Request:**
```json
{
  "prompt": "Tu prompt aquí",
  "extractJson": false,
  "config": {
    "temperature": 0.7,
    "topP": 0.9,
    "topK": 40,
    "maxOutputTokens": 1024
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "Respuesta del modelo...",
  "modelUsed": "gemini-2.5-flash"
}
```

## Características

### ✅ Fallback Multi-Modelo

El sistema intenta automáticamente múltiples modelos en orden:
1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-1.5-flash`
4. `gemini-1.5-pro`

### ✅ Extracción de JSON

Puede extraer JSON de respuestas incluso si están envueltas en markdown.

### ✅ Timeouts Automáticos

El hook `useGemini` maneja timeouts de 30 segundos por defecto (configurable).

### ✅ Manejo de Errores

Todos los endpoints retornan formato uniforme:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  modelUsed?: string;
}
```

### ✅ Runtime Node.js

Todos los endpoints tienen `export const runtime = 'nodejs'` para funcionar correctamente en Vercel.

## Ejemplo Completo

```tsx
'use client';

import { useState } from 'react';
import { useGemini } from '@/hooks/useGemini';

export function AIMentorChat() {
  const [prompt, setPrompt] = useState('');
  const { callGemini, isLoading, error, data, modelUsed } = useGemini({
    timeout: 30000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await callGemini(prompt);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Pregunta algo..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {data && (
        <div className="response">
          <p>{data}</p>
          {modelUsed && (
            <small>Modelo usado: {modelUsed}</small>
          )}
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Error: "GEMINI_API_KEY is not set"

- Verifica que la variable esté en `.env.local`
- Reinicia el servidor de desarrollo (`pnpm dev`)
- En producción, verifica que esté configurada en Vercel

### Error: "Runtime not supported"

- Asegúrate de que todos los endpoints tengan `export const runtime = 'nodejs'`

### Error: "All models failed"

- Verifica que tu API key sea válida
- Revisa los logs del servidor para más detalles
- Prueba con el endpoint `/api/test-gemini`

## Producción en Vercel

1. **Configurar variable de entorno**:
   - Ve a Vercel Dashboard → Settings → Environment Variables
   - Agrega `GEMINI_API_KEY` con tu API key
   - Selecciona Production, Preview y Development

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

3. **Verificar**:
   ```bash
   curl https://tu-proyecto.vercel.app/api/test-gemini
   ```

## Referencias

- [Google Generative AI SDK](https://github.com/google/generative-ai-node)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

