# 🤖 AI Mentor Multilingüe

## 📋 Resumen

El AI Mentor Multilingüe es un asistente AI 24/7 que ayuda a participantes de hackathons, especialmente en África, proporcionando respuestas instantáneas en Swahili, Inglés y Francés. El sistema incluye ejemplos de código, guías contextuales y recursos relevantes.

## ✨ Características

### 1. **Soporte Multilingüe Completo**
- 🇬🇧 **Inglés (en)** - Respuestas completas en inglés
- 🇹🇿 **Swahili (sw)** - Respuestas en Kiswahili con explicaciones claras
- 🇫🇷 **Francés (fr)** - Respuestas en francés

### 2. **Respuestas Instantáneas**
- Chat en tiempo real con indicador de typing
- Respuestas rápidas usando Claude Sonnet 4
- Historial de conversación (últimos 5 mensajes)
- Contexto del hackathon incluido en cada pregunta

### 3. **Ejemplos de Código**
- Extracción automática de bloques de código de las respuestas
- Resaltado de sintaxis para múltiples lenguajes
  - Solidity
  - JavaScript/TypeScript
  - Python
  - Otros lenguajes soportados
- Botón de copiar para cada ejemplo de código
- Descripciones contextuales para cada ejemplo

### 4. **Guías Contextuales**
- Guías basadas en el stack tecnológico del usuario
- Recursos relevantes según la pregunta
- Preguntas relacionadas sugeridas
- Enlaces a documentación oficial

## 🏗️ Arquitectura

### Frontend

**Componente:** `frontend/components/hackathons/AIMentor.tsx`

**Características:**
- Interfaz de chat moderna con glassmorphism
- Selector de idioma en tiempo real
- Extracción automática de ejemplos de código
- Renderizado de recursos y preguntas relacionadas
- Manejo de errores robusto con fallback

**Estado:**
- `messages`: Array de mensajes del chat
- `selectedLanguage`: Idioma actual (en/sw/fr)
- `isLoading`: Estado de carga
- `copiedCodeId`: ID del código copiado

### Backend

**Servicio:** `ai-services/mentor_bot/main.py`

**Endpoint:** `POST /ask`

**Request:**
```json
{
  "question": "How do I deploy a smart contract?",
  "language": "sw",
  "context": {
    "hackathonId": "eth-safari-2025",
    "hackathonName": "ETH Safari 2025",
    "chains": ["arbitrum", "base"],
    "techStack": ["solidity", "foundry"]
  },
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous question..."
    },
    {
      "role": "assistant",
      "content": "Previous answer..."
    }
  ]
}
```

**Response:**
```json
{
  "answer": "Para desplegar un contrato inteligente...",
  "suggestedResources": [
    {
      "title": "Solidity Documentation",
      "url": "https://docs.soliditylang.org/",
      "type": "documentation"
    }
  ],
  "relatedQuestions": [
    "How do I verify my contract on Etherscan?",
    "What are the gas costs for deployment?"
  ],
  "language": "sw"
}
```

## 🎯 Funcionalidades Detalladas

### 1. Soporte Swahili

El sistema está optimizado para Swahili con:
- Respuestas en Kiswahili natural
- Explicaciones simples y claras
- Términos técnicos traducidos apropiadamente
- Preguntas relacionadas en Swahili

**Ejemplo de pregunta en Swahili:**
```
"Ninawezaje kutuma kandarasi ya akili?"
```

**Respuesta incluye:**
- Explicación paso a paso en Swahili
- Ejemplos de código comentados
- Recursos relevantes
- Preguntas relacionadas en Swahili

### 2. Respuestas Instantáneas

- **Indicador de typing**: Muestra "AI Mentor is thinking..." mientras procesa
- **Timeout**: 30 segundos máximo por petición
- **Manejo de errores**: Fallback graceful si el servicio no está disponible
- **Historial**: Mantiene contexto de los últimos 5 mensajes

### 3. Ejemplos de Código

**Formato requerido:**
El backend debe incluir código en bloques markdown:
```solidity
contract MyContract {
    // Tu código aquí
}
```

**Renderizado:**
- Extracción automática de bloques de código
- Identificación del lenguaje
- Resaltado de sintaxis básico (con estilos CSS)
- Botón de copiar funcional
- Descripción opcional del código

### 4. Guías Contextuales

**Basadas en:**
- Stack tecnológico del usuario (Solidity, Foundry, React, etc.)
- Cadenas blockchain utilizadas (Arbitrum, Base, Optimism)
- Contexto del hackathon
- Tipo de pregunta (deploy, test, security, frontend)

**Incluye:**
- Recursos relevantes (documentación, tutoriales, librerías)
- Preguntas relacionadas en el idioma del usuario
- Enlaces a documentación oficial
- Tips y mejores prácticas

## 📍 Ubicación

### Componente Frontend

**Archivo:** `frontend/components/hackathons/AIMentor.tsx`

**Uso:**
```tsx
import { AIMentor } from '@/components/hackathons/AIMentor';

<AIMentor
  hackathonId="eth-safari-2025"
  userId={address}
  context={{
    hackathonName: "ETH Safari 2025",
    chains: ["arbitrum", "base"],
    techStack: ["solidity", "foundry"]
  }}
/>
```

### Integración en Páginas

**Página de Hackathon:** `frontend/app/hackathons/[slug]/page.tsx`

**Tab "AI Mentor":**
- Accesible desde la página de detalle del hackathon
- Tab dedicado "AI Mentor"
- Altura: 700px para mejor experiencia

### Servicio Backend

**Archivo:** `ai-services/mentor_bot/main.py`

**Puerto:** `8000` (por defecto)

**Variables de entorno:**
```env
ANTHROPIC_API_KEY=tu_api_key_aqui
```

## 🚀 Cómo Usar

### Para Participantes

1. **Acceder al AI Mentor:**
   - Ve a la página de detalle del hackathon
   - Haz clic en la tab "AI Mentor"

2. **Seleccionar Idioma:**
   - Haz clic en el selector de idioma (EN/SW/FR)
   - El mentor responderá en el idioma seleccionado

3. **Hacer Preguntas:**
   - Escribe tu pregunta en el campo de texto
   - Presiona Enter para enviar
   - El mentor responderá con:
     - Respuesta completa
     - Ejemplos de código (si aplica)
     - Recursos relevantes
     - Preguntas relacionadas

4. **Usar Ejemplos de Código:**
   - Haz clic en el botón de copiar (📋) junto al código
   - El código se copiará al portapapeles
   - Úsalo directamente en tu proyecto

5. **Explorar Recursos:**
   - Haz clic en los enlaces de recursos
   - Se abrirán en una nueva pestaña
   - Documentación oficial y tutoriales

6. **Preguntas Relacionadas:**
   - Haz clic en cualquier pregunta relacionada
   - Se autocompletará en el campo de texto
   - Presiona Enter para enviar

## 🔧 Configuración

### Frontend

**Variables de entorno:**
```env
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

Si no se define, usa `http://localhost:8000` por defecto.

**Nota:** Si usas Docker Compose, el servicio corre en el puerto 8003:
```env
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8003
```

### Backend (AI Mentor Service)

**Instalación:**
```bash
cd ai-services/mentor_bot
pip install -r requirements.txt
```

**Configurar API Key:**
```bash
export GEMINI_API_KEY=your_gemini_api_key_here
```

O crear archivo `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Nota:** La API key ya está configurada por defecto en el código. Solo necesitas configurarla si quieres usar una diferente.

**Ejecutar en Desarrollo:**
```bash
cd ai-services/mentor_bot
export GEMINI_API_KEY=your_gemini_api_key_here
uvicorn main:app --reload --port 8000
```

**Ejecutar con Docker Compose:**
```bash
# Desde la raíz del proyecto
docker-compose up mentor-bot
```

El servicio estará disponible en:
- **Desarrollo local**: `http://localhost:8000`
- **Docker Compose**: `http://localhost:8003`

**Ver documentación completa:** [ai-services/mentor_bot/README.md](../../ai-services/mentor_bot/README.md)

## 💡 Ejemplos de Uso

### Ejemplo 1: Pregunta en Swahili

**Usuario:**
```
Ninawezaje kuanza na Solidity?
```

**Respuesta del AI Mentor:**
- Explicación paso a paso en Swahili
- Ejemplo de código básico:
```solidity
// Kandarasi ya kwanza
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Habari ya dunia!";
    
    function setMessage(string memory _message) public {
        message = _message;
    }
}
```
- Recursos: Documentación de Solidity, Tutoriales
- Preguntas relacionadas en Swahili

### Ejemplo 2: Pregunta Técnica en Inglés

**Usuario:**
```
How do I prevent reentrancy attacks?
```

**Respuesta del AI Mentor:**
- Explicación detallada de reentrancy
- Ejemplo de código con ReentrancyGuard:
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyContract is ReentrancyGuard {
    function withdraw() public nonReentrant {
        // Safe withdrawal logic
    }
}
```
- Recursos: OpenZeppelin Contracts, Security Best Practices
- Preguntas relacionadas sobre seguridad

### Ejemplo 3: Pregunta Frontend en Francés

**Usuario:**
```
Comment connecter MetaMask à mon dApp?
```

**Respuesta del AI Mentor:**
- Explicación en francés
- Ejemplo de código con Wagmi:
```typescript
import { useAccount, useConnect } from 'wagmi';

function MyComponent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect MetaMask
    </button>
  );
}
```
- Recursos: Wagmi Documentation, Web3.js Guide
- Preguntas relacionadas en francés

## 📊 Métricas y Monitoreo

### Métricas del Componente

- **Tiempo de respuesta**: Promedio de tiempo de respuesta del AI
- **Tasa de éxito**: Porcentaje de respuestas exitosas
- **Uso por idioma**: Distribución de preguntas por idioma
- **Ejemplos de código**: Cantidad de ejemplos proporcionados
- **Recursos utilizados**: Recursos más clicados

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "mentor-bot"
}
```

## 🎨 Personalización

### Estilos CSS

Los estilos de resaltado de sintaxis están en `frontend/app/globals.css`:

```css
pre code .keyword { color: #c084fc; }
pre code .string { color: #34d399; }
pre code .number { color: #fbbf24; }
pre code .comment { color: #6b7280; }
```

### Mensajes de Bienvenida

Los mensajes de bienvenida están en el componente:
- Inglés: "Hello! I'm your AI Mentor..."
- Swahili: "Hujambo! Mimi ni Mentor wako wa AI..."
- Francés: "Bonjour! Je suis votre Mentor IA..."

## 🔒 Seguridad

- **Rate Limiting**: Implementado en el backend
- **Validación de entrada**: Validación de preguntas y contexto
- **Sanitización**: Sanitización de respuestas del AI
- **Timeout**: Timeout de 30 segundos para evitar esperas largas

## 🐛 Troubleshooting

### El AI Mentor no responde

1. Verifica que el servicio backend esté corriendo
2. Verifica la variable `NEXT_PUBLIC_AI_SERVICE_URL`
3. Revisa la consola del navegador para errores
4. Verifica que `ANTHROPIC_API_KEY` esté configurada

### Los ejemplos de código no se muestran

1. Verifica que el backend esté enviando código en formato markdown
2. Revisa que el código esté en bloques ```language
3. Verifica la consola para errores de parsing

### El selector de idioma no funciona

1. Verifica que `getCurrentLocale()` esté funcionando
2. Revisa que `setLocale()` esté guardando correctamente
3. Verifica que el componente esté dentro del contexto de i18n

## 📝 Notas de Implementación

### Mejoras Futuras

1. **Resaltado de sintaxis avanzado**: Integrar Prism.js o Highlight.js
2. **Búsqueda de conversaciones**: Historial de conversaciones guardado
3. **Favoritos**: Guardar respuestas favoritas
4. **Exportar conversación**: Exportar chat completo
5. **Modo oscuro/claro**: Tema personalizable
6. **Voz**: Soporte para preguntas de voz (opcional)

---

**¡El AI Mentor Multilingüe está listo para ayudar a participantes africanos con desarrollo Web3!** 🚀

