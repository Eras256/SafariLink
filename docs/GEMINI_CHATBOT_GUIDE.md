# 🤖 Guía: Crear un Chatbot con IA usando Google Gemini API

Esta guía te mostrará cómo crear un chatbot con IA desde cero usando la API de Google Gemini.

## 📋 Requisitos Previos

- Python 3.11 o superior
- Una API key de Google Gemini (obtener en [Google AI Studio](https://aistudio.google.com/))
- Node.js 20+ (si quieres crear un frontend con Next.js)

## 🚀 Paso 1: Crear el Backend con FastAPI

### 1.1 Estructura del proyecto

```
chatbot-gemini/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/ (opcional)
└── README.md
```

### 1.2 Instalar dependencias

Crea un archivo `requirements.txt`:

```txt
fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.3
google-generativeai==0.8.3
python-multipart==0.0.6
python-dotenv==1.0.0
```

Instala las dependencias:

```bash
pip install -r requirements.txt
```

### 1.3 Crear el servidor FastAPI

Crea `backend/main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class ChatMessage(BaseModel):
    role: str  # "user" o "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    language: Optional[str] = "es"  # "es", "en", etc.

class ChatResponse(BaseModel):
    response: str
    conversation_history: List[ChatMessage]

# Inicializar Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY no está configurada")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    # Usar gemini-2.0-flash o fallback a gemini-flash-latest
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
    except Exception:
        model = genai.GenerativeModel("gemini-flash-latest")
    print("✅ Gemini model initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Gemini: {e}")
    model = None

# Prompt del sistema
SYSTEM_PROMPT = """Eres un asistente de IA amigable y útil. 
Responde de manera clara y concisa.
Si el usuario pregunta en español, responde en español.
Si pregunta en inglés, responde en inglés."""

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint para chatear con el bot
    """
    if not model:
        raise HTTPException(
            status_code=500, 
            detail="Modelo de Gemini no está inicializado. Verifica tu API key."
        )
    
    try:
        # Construir el historial de conversación
        conversation_text = ""
        for msg in request.conversation_history[-5:]:  # Últimos 5 mensajes
            role = "Usuario" if msg.role == "user" else "Asistente"
            conversation_text += f"{role}: {msg.content}\n"
        
        # Construir el prompt completo
        if conversation_text:
            full_prompt = f"{SYSTEM_PROMPT}\n\nHistorial de conversación:\n{conversation_text}\n\nUsuario: {request.message}\nAsistente:"
        else:
            full_prompt = f"{SYSTEM_PROMPT}\n\nUsuario: {request.message}\nAsistente:"
        
        # Generar respuesta
        response = model.generate_content(
            full_prompt,
            generation_config={
                "max_output_tokens": 1500,
                "temperature": 0.7,
            }
        )
        
        # Extraer la respuesta
        if hasattr(response, 'text') and response.text:
            bot_response = response.text
        elif hasattr(response, 'parts') and response.parts:
            bot_response = response.parts[0].text
        else:
            bot_response = "Lo siento, no pude generar una respuesta."
        
        # Actualizar historial de conversación
        updated_history = request.conversation_history.copy()
        updated_history.append(ChatMessage(role="user", content=request.message))
        updated_history.append(ChatMessage(role="assistant", content=bot_response))
        
        return ChatResponse(
            response=bot_response,
            conversation_history=updated_history[-10:]  # Mantener últimos 10 mensajes
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar respuesta: {str(e)}"
        )

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": "gemini-2.0-flash" if model else "not initialized"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 1.4 Configurar variables de entorno

Crea `backend/.env`:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

### 1.5 Ejecutar el servidor

```bash
cd backend
uvicorn main:app --reload --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 🎨 Paso 2: Crear el Frontend (React/Next.js)

### 2.1 Estructura del componente

Crea `frontend/components/Chatbot.tsx`:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages,
          language: 'es',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.conversation_history);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu mensaje.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Chatbot con Gemini</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Usar el componente

En tu página o componente:

```typescript
import { Chatbot } from '@/components/Chatbot';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Chatbot />
    </div>
  );
}
```

## 🐳 Paso 3: Dockerizar (Opcional)

### 3.1 Crear Dockerfile

`backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.2 Crear docker-compose.yml

```yaml
version: '3.8'

services:
  chatbot-backend:
    build: ./backend
    environment:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "8000:8000"
    restart: unless-stopped
```

Ejecutar:

```bash
docker-compose up -d
```

## 🔑 Paso 4: Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key"
4. Crea un nuevo proyecto o selecciona uno existente
5. Copia tu API key
6. Agrega la key a tu archivo `.env`

## 📝 Paso 5: Probar el Chatbot

### Con curl:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cómo estás?",
    "language": "es"
  }'
```

### Con el frontend:

1. Abre tu aplicación frontend
2. Escribe un mensaje en el chat
3. Presiona Enter o haz clic en "Enviar"
4. El bot debería responder

## 🎯 Características Avanzadas (Opcional)

### Multilingüe

Actualiza el prompt del sistema para soportar múltiples idiomas:

```python
SYSTEM_PROMPTS = {
    "es": "Eres un asistente de IA amigable. Responde en español.",
    "en": "You are a friendly AI assistant. Respond in English.",
    "sw": "Wewe ni msaidizi wa AI mwenye urafiki. Jibu kwa Kiswahili.",
}
```

### Historial de conversación persistente

Guarda el historial en una base de datos o en localStorage en el frontend.

### Stream de respuestas

Para respuestas en tiempo real, usa streaming de Gemini API.

## 📚 Recursos

- [Documentación de Google Gemini API](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🐛 Troubleshooting

### Error: "API key not found"
- Verifica que `GEMINI_API_KEY` esté en tu archivo `.env`
- Asegúrate de cargar las variables de entorno con `load_dotenv()`

### Error: "Model not found"
- Verifica que estés usando un modelo disponible
- Usa `gemini-2.0-flash` o `gemini-flash-latest`

### Error de CORS
- Asegúrate de configurar CORS correctamente en FastAPI
- Agrega tu dominio frontend a `allow_origins`

## ✅ Checklist de Implementación

- [ ] Crear estructura de proyecto
- [ ] Instalar dependencias
- [ ] Configurar API key de Gemini
- [ ] Crear servidor FastAPI
- [ ] Crear componente frontend
- [ ] Probar el chatbot
- [ ] Dockerizar (opcional)
- [ ] Agregar manejo de errores
- [ ] Agregar estilos personalizados
- [ ] Desplegar

