# 🤖 SuperChatBot - Superinteligencia powered by Gemini

## 🎯 Descripción

SuperChatBot es un chatbot avanzado con superinteligencia powered by Google Gemini, diseñado para proporcionar respuestas profundas, análisis contextual y asistencia excepcional en múltiples dominios.

## ✨ Características

### 🧠 Superinteligencia
- **Razonamiento profundo**: Análisis multi-paso de problemas complejos
- **Contexto avanzado**: Memoria de conversación mejorada
- **Múltiples perspectivas**: Ofrece diferentes puntos de vista cuando es relevante
- **Insights automáticos**: Extrae puntos clave, acciones sugeridas y temas relacionados

### 💡 Capacidades
- **Análisis técnico**: Web3, blockchain, smart contracts, DeFi, NFTs, DAOs
- **Inteligencia artificial**: LLMs, redes neuronales, deep learning
- **Desarrollo de software**: Mejores prácticas, arquitectura, seguridad
- **Estrategia de negocio**: Desarrollo de productos, análisis de mercado
- **Conocimiento general**: Ciencia, tecnología, cultura, eventos actuales

### 🎨 Interfaz
- **Diseño moderno**: UI glassmorphic con gradientes
- **Minimizable**: Botón flotante que se expande a ventana completa
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones con Framer Motion

## 📁 Estructura de Archivos

```
frontend/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # Endpoint API para el chatbot
├── components/
│   └── chat/
│       ├── SuperChatBot.tsx      # Componente principal del chatbot
│       └── ChatBotProvider.tsx    # Provider para incluir en layout
└── SUPER_CHATBOT_README.md        # Esta documentación
```

## 🚀 Uso

### Integración Automática

El SuperChatBot ya está integrado en el layout principal (`app/layout.tsx`), por lo que está disponible en toda la aplicación como un botón flotante en la esquina inferior derecha.

### Uso Manual en Componentes

Si quieres usar el chatbot en un componente específico:

```tsx
import { SuperChatBot } from '@/components/chat/SuperChatBot';

export function MyComponent() {
  return (
    <div>
      {/* Tu contenido */}
      <SuperChatBot 
        position="bottom-right"  // o 'bottom-left', 'top-right', 'top-left'
        defaultOpen={false}      // si quieres que esté abierto por defecto
      />
    </div>
  );
}
```

## 🔌 API Endpoint

### POST `/api/chat`

Endpoint para enviar mensajes al chatbot.

**Request:**
```json
{
  "message": "¿Cómo funciona un smart contract?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hola",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "role": "assistant",
      "content": "¡Hola! ¿En qué puedo ayudarte?",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ],
  "context": {
    "userId": "0x123...",
    "sessionId": "chat-123456",
    "platform": "SafariLink",
    "userPreferences": {
      "language": "en",
      "expertise": "intermediate",
      "interests": ["Web3", "AI"]
    }
  },
  "options": {
    "temperature": 0.8,
    "maxTokens": 2048
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Un smart contract es un programa que se ejecuta en la blockchain...",
    "modelUsed": "gemini-2.5-flash",
    "insights": {
      "keyPoints": [
        "Los smart contracts son inmutables una vez desplegados",
        "Se ejecutan automáticamente cuando se cumplen condiciones"
      ],
      "suggestedActions": [
        "Considera usar OpenZeppelin para contratos seguros",
        "Prueba tu contrato en testnet antes de producción"
      ],
      "relatedTopics": ["solidity", "ethereum", "blockchain"]
    },
    "timestamp": "2024-01-01T00:00:02Z",
    "conversationId": "chat-123456"
  }
}
```

## 🎛️ Configuración

### Variables de Entorno

El chatbot usa `GEMINI_API_KEY` que ya está configurada en Vercel.

### Opciones del Chatbot

```tsx
<SuperChatBot
  position="bottom-right"    // Posición del botón flotante
  defaultOpen={false}         // Si debe estar abierto por defecto
  className="custom-class"    // Clases CSS adicionales
/>
```

### Configuración de la API

En `app/api/chat/route.ts`, puedes ajustar:

- **Temperature**: Controla la creatividad (0.0 - 1.0)
- **Max Tokens**: Longitud máxima de la respuesta
- **Top P**: Diversidad en las respuestas

## 🧪 Testing

### Probar Localmente

```bash
cd frontend
npm run dev
```

Visita `http://localhost:3000` y busca el botón flotante del chatbot en la esquina inferior derecha.

### Probar el Endpoint

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is blockchain?",
    "context": {
      "platform": "SafariLink"
    }
  }'
```

## 🎨 Personalización

### Cambiar el Tema

Edita `SuperChatBot.tsx` y modifica las clases CSS:

```tsx
// Cambiar colores del gradiente
className="bg-gradient-to-br from-purple-600 to-blue-600"

// Cambiar tamaño de la ventana
className="w-96 h-[600px]"
```

### Agregar Funcionalidades

1. **Persistencia de conversación**: Guardar mensajes en localStorage
2. **Exportar conversación**: Botón para descargar el chat
3. **Temas**: Modo claro/oscuro
4. **Voz**: Integración con Web Speech API

## 🐛 Troubleshooting

### El chatbot no aparece

- Verifica que `ChatBotProvider` esté en `app/layout.tsx`
- Revisa la consola del navegador por errores

### Error: "GEMINI_API_KEY is not set"

- Verifica que la variable esté configurada en Vercel
- En desarrollo, verifica `.env.local`

### Respuestas lentas

- Aumenta el timeout en `SuperChatBot.tsx` (línea 45 segundos)
- Reduce `maxTokens` en la configuración

## 📊 Diferencias con AI Mentor

| Característica | AI Mentor | SuperChatBot |
|:--------------|:----------|:-------------|
| **Propósito** | Asistencia técnica en hackathons | Asistencia general superinteligente |
| **Contexto** | Específico de hackathons | General y multi-dominio |
| **Insights** | Recursos y preguntas relacionadas | Puntos clave, acciones, temas |
| **UI** | Integrado en página | Botón flotante global |
| **Memoria** | Últimas 5 mensajes | Últimos 10 mensajes |
| **Temperatura** | 0.7 (más conservador) | 0.8 (más creativo) |

## 🚀 Próximas Mejoras

- [ ] Persistencia de conversaciones en base de datos
- [ ] Soporte multi-idioma automático
- [ ] Integración con búsqueda web en tiempo real
- [ ] Generación de imágenes con Gemini Vision
- [ ] Análisis de sentimientos
- [ ] Sugerencias de preguntas inteligentes
- [ ] Exportar conversaciones como PDF/Markdown

## 📝 Notas

- El chatbot usa el modelo Gemini más avanzado disponible (fallback automático)
- Las respuestas se generan server-side (nunca se expone la API key)
- El timeout es de 45 segundos para permitir respuestas complejas
- Los insights se extraen automáticamente de las respuestas

---

**Desarrollado con ❤️ usando Google Gemini AI**



