# 🚀 Quick Start: Chatbot con Gemini en 5 minutos

## Paso 1: Crear el archivo Python

Crea `chatbot.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

# Configurar Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "TU_API_KEY_AQUI"))
model = genai.GenerativeModel("gemini-2.0-flash")

@app.post("/chat")
async def chat(msg: Message):
    response = model.generate_content(msg.message)
    return {"response": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Paso 2: Instalar dependencias

```bash
pip install fastapi uvicorn google-generativeai
```

## Paso 3: Ejecutar

```bash
export GEMINI_API_KEY="tu_api_key"
python chatbot.py
```

## Paso 4: Probar

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}'
```

¡Listo! Ya tienes un chatbot funcionando. 🎉

