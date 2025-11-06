# 📍 Dónde Ver Virtual Networking

## 🎯 Ubicaciones donde se muestra Virtual Networking

### 1. **Página de Detalle de Hackathon** (Principal)

**URL:** `/hackathons/[slug]`

**Ejemplo:** 
- `http://localhost:3000/hackathons/eth-safari-2025`
- `http://localhost:3000/hackathons/web3-africa-hackathon-2024`

**Cómo acceder:**
1. Ve a `/hackathons` (página de listado)
2. Haz clic en cualquier tarjeta de hackathon
3. Se abrirá la página de detalle
4. Haz clic en la pestaña **"Networking"**
5. Ahí verás el componente `VirtualNetworking` completo

**Características visibles:**
- ✅ Lista de salas por track
- ✅ Chat en tiempo real
- ✅ Video rooms con WebRTC
- ✅ Controles de audio/video
- ✅ Breakout sessions
- ✅ Participantes en línea

### 2. **Página ETH Safari Evolution Challenge** (Demo)

**URL:** `/eth-safari-evolution`

**Cómo acceder:**
1. Haz clic en **"🦁 ETH Safari"** en la barra de navegación
2. O ve directamente a `http://localhost:3000/eth-safari-evolution`
3. Desplázate hasta la sección **"Demo en Vivo"**
4. Ahí verás una demostración funcional de Virtual Networking

**Características visibles:**
- ✅ Demo interactivo
- ✅ Todas las funcionalidades disponibles
- ✅ Integrado con wallet (si está conectado)

## 🗺️ Estructura de Navegación

```
┌─────────────────────────────────────┐
│         Navbar (Top)                 │
│  Logo | Hackathons | 🦁 ETH Safari  │
└─────────────────────────────────────┘
              │
              ├─→ /hackathons
              │   └─→ [slug] → Tab "Networking"
              │
              └─→ /eth-safari-evolution
                  └─→ Sección "Demo en Vivo"
```

## 📱 Componente VirtualNetworking

### Ubicación del Código

**Frontend:**
- `frontend/components/hackathons/VirtualNetworking.tsx`

**Hooks:**
- `frontend/hooks/useWebSocket.ts` - Gestión de WebSocket
- `frontend/hooks/useWebRTC.ts` - Gestión de WebRTC

**Backend:**
- `backend/src/controllers/networking.controller.ts` - API REST
- `backend/src/services/websocket.service.ts` - Servidor WebSocket
- `backend/src/routes/networking.routes.ts` - Rutas API

### Integración en Páginas

#### Opción 1: Página de Detalle de Hackathon

```tsx
// frontend/app/hackathons/[slug]/page.tsx
import { VirtualNetworking } from '@/components/hackathons/VirtualNetworking';

export default function HackathonDetailPage() {
  return (
    <div>
      {/* Tabs */}
      {activeTab === 'networking' && (
        <VirtualNetworking 
          hackathonId={hackathon.id} 
          userId={address} 
        />
      )}
    </div>
  );
}
```

#### Opción 2: Página de Demo

```tsx
// frontend/app/eth-safari-evolution/page.tsx
import { VirtualNetworking } from '@/components/hackathons/VirtualNetworking';

export default function EthSafariEvolutionPage() {
  return (
    <section>
      <h2>Demo en Vivo</h2>
      <VirtualNetworking 
        hackathonId="eth-safari-2025" 
        userId={address} 
      />
    </section>
  );
}
```

## 🚀 Cómo Probar

### Paso a Paso

1. **Iniciar el servidor:**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

2. **Acceder a la aplicación:**
   - Abre `http://localhost:3000`

3. **Ver Virtual Networking:**

   **Opción A - Página de Hackathon:**
   - Ve a `http://localhost:3000/hackathons`
   - Haz clic en cualquier hackathon
   - Click en la pestaña "Networking"

   **Opción B - ETH Safari Evolution:**
   - Ve a `http://localhost:3000/eth-safari-evolution`
   - Desplázate hasta "Demo en Vivo"
   - Verás el componente funcionando

4. **Conectar Wallet (Recomendado):**
   - Haz clic en "Connect Wallet" en la barra superior
   - Conecta tu wallet (MetaMask, WalletConnect, etc.)
   - Esto permitirá identificar tu usuario en las salas

5. **Probar Funcionalidades:**
   - Ver lista de salas disponibles
   - Unirse a una sala
   - Enviar mensajes en el chat
   - Activar video/audio (requiere permisos del navegador)
   - Crear breakout sessions

## 📊 Características por Ubicación

### Página de Detalle de Hackathon (`/hackathons/[slug]`)

✅ **Completo y funcional**
- Integrado con datos del hackathon
- Tabs para navegación
- Contexto completo del evento
- Estadísticas del hackathon
- Organizer Dashboard (si eres organizador)

### Página ETH Safari Evolution (`/eth-safari-evolution`)

✅ **Demo interactivo**
- Demostración de funcionalidades
- Integrado con propuesta del challenge
- Contexto específico para ETH Safari

## 🔧 Configuración Requerida

### Variables de Entorno

**Backend (.env):**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id
```

### Base de Datos

```bash
cd backend
npm run migrate
```

## 🎨 Interfaz de Usuario

### Vista de Lista de Salas

Cuando NO estás en una sala:
- Grid de salas disponibles
- Información de cada sala (track, participantes, descripción)
- Botón "Join Room" en cada sala
- Indicador de conexión WebSocket

### Vista Dentro de Sala

Cuando estás EN una sala:
- **Header:** Nombre de sala, participantes, controles
- **Video Grid:** Videos de participantes (si están activos)
- **Chat Panel:** Mensajes en tiempo real, input de mensaje
- **Controles:** Video, Audio, Breakout, Leave

## 📝 Notas Importantes

1. **WebSocket:** Requiere que el servidor backend esté corriendo
2. **WebRTC:** Requiere HTTPS en producción (o localhost en desarrollo)
3. **Permisos:** El navegador pedirá permisos para cámara/micrófono
4. **Wallet:** No es estrictamente necesario, pero mejora la experiencia

## 🐛 Troubleshooting

### No veo las salas
- Verifica que el backend esté corriendo en el puerto 4000
- Verifica que la base de datos tenga datos de prueba
- Revisa la consola del navegador para errores

### WebSocket no conecta
- Verifica que `NEXT_PUBLIC_API_URL` esté configurado
- Verifica que el servidor WebSocket esté iniciado
- Revisa los logs del backend

### Video no funciona
- Verifica permisos de cámara/micrófono del navegador
- Verifica que estés usando HTTPS (o localhost)
- Revisa la consola para errores de WebRTC

---

**¡El Virtual Networking está listo para usar en estas ubicaciones!** 🚀

