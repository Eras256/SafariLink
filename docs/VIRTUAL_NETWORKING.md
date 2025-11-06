# Salas Virtuales de Networking - Documentación Técnica

## 📋 Resumen

Sistema completo de Salas Virtuales de Networking implementado para hackathons virtuales, con funcionalidad en tiempo real para chat, video y audio usando WebSockets y WebRTC.

## 🏗️ Arquitectura

### Backend

- **Base de Datos**: PostgreSQL con Prisma ORM
- **WebSocket Server**: Socket.io para comunicación en tiempo real
- **API REST**: Express.js para gestión de salas y mensajes
- **WebRTC Signaling**: Servidor de signaling para conexiones peer-to-peer

### Frontend

- **WebSocket Client**: Socket.io-client para conexión en tiempo real
- **WebRTC**: simple-peer para conexiones peer-to-peer
- **React Hooks**: `useWebSocket` y `useWebRTC` para gestión de estado

## 📊 Modelos de Base de Datos

### NetworkingRoom

Salas virtuales de networking con las siguientes características:

- `id`: Identificador único
- `hackathonId`: Hackathon al que pertenece
- `trackId`: Track opcional (DeFi, NFT, AI, etc.)
- `name`: Nombre de la sala
- `description`: Descripción
- `track`: Track (DeFi, NFT, AI, General)
- `roomType`: Tipo de sala (GENERAL, TRACK_BASED, MENTOR_OFFICE_HOURS, JUDGE_QA, BREAKOUT)
- `maxParticipants`: Máximo de participantes
- `isPrivate`: Si requiere contraseña
- `password`: Contraseña opcional
- `videoEnabled`: Si el video está habilitado
- `audioEnabled`: Si el audio está habilitado
- `isActive`: Si la sala está activa

### RoomParticipant

Participantes en salas:

- `id`: Identificador único
- `roomId`: Sala a la que pertenece
- `userId`: Usuario
- `isActive`: Si está activo en la sala
- `joinedAt`: Fecha de ingreso
- `leftAt`: Fecha de salida
- `videoEnabled`: Si tiene video activo
- `audioEnabled`: Si tiene audio activo
- `peerId`: ID de peer WebRTC
- `streamId`: ID de stream de media

### RoomMessage

Mensajes en las salas:

- `id`: Identificador único
- `roomId`: Sala
- `userId`: Usuario que envió
- `content`: Contenido del mensaje
- `messageType`: Tipo (TEXT, SYSTEM, FILE, LINK, EMOJI)
- `attachments`: Archivos adjuntos (JSON)
- `isEdited`: Si fue editado
- `isDeleted`: Si fue eliminado
- `createdAt`: Fecha de creación

### BreakoutSession

Sesiones de breakout (sub-salas):

- `id`: Identificador único
- `roomId`: Sala principal
- `parentRoomId`: Sala padre opcional
- `name`: Nombre de la sesión
- `description`: Descripción
- `maxParticipants`: Máximo de participantes
- `isActive`: Si está activa
- `startedAt`: Fecha de inicio
- `endedAt`: Fecha de fin

## 🔌 API REST

### Endpoints

#### GET `/api/networking/rooms`
Obtener todas las salas de un hackathon.

**Query Parameters:**
- `hackathonId` (required): ID del hackathon
- `track` (optional): Filtrar por track

**Response:**
```json
{
  "rooms": [
    {
      "id": "room123",
      "name": "DeFi Innovators",
      "track": "DeFi",
      "participants": 24,
      "messages": 156,
      "roomType": "TRACK_BASED",
      "isPrivate": false,
      "videoEnabled": true,
      "audioEnabled": true
    }
  ]
}
```

#### GET `/api/networking/rooms/:roomId`
Obtener detalles de una sala específica.

#### POST `/api/networking/rooms`
Crear una nueva sala.

**Body:**
```json
{
  "hackathonId": "hack123",
  "name": "DeFi Innovators",
  "description": "Discuss DeFi protocols",
  "track": "DeFi",
  "roomType": "TRACK_BASED",
  "maxParticipants": 50,
  "isPrivate": false
}
```

#### POST `/api/networking/rooms/:roomId/join`
Unirse a una sala.

**Body:**
```json
{
  "password": "optional-password"
}
```

#### POST `/api/networking/rooms/:roomId/leave`
Salir de una sala.

#### GET `/api/networking/rooms/:roomId/messages`
Obtener mensajes de una sala.

**Query Parameters:**
- `limit` (optional): Número de mensajes (default: 50)
- `cursor` (optional): Cursor para paginación

#### POST `/api/networking/rooms/:roomId/breakout`
Crear una sesión de breakout.

**Body:**
```json
{
  "name": "Small Group Discussion",
  "description": "Breakout session",
  "maxParticipants": 10
}
```

#### PATCH `/api/networking/rooms/:roomId/participant`
Actualizar estado del participante (video/audio).

**Body:**
```json
{
  "videoEnabled": true,
  "audioEnabled": false,
  "peerId": "peer123",
  "streamId": "stream123"
}
```

## 🔌 WebSocket Events

### Cliente → Servidor

#### `room:join`
Unirse a una sala.

```typescript
socket.emit('room:join', {
  roomId: 'room123',
  userId: 'user123'
});
```

#### `room:leave`
Salir de una sala.

```typescript
socket.emit('room:leave', {
  roomId: 'room123',
  userId: 'user123'
});
```

#### `message:send`
Enviar un mensaje.

```typescript
socket.emit('message:send', {
  roomId: 'room123',
  userId: 'user123',
  content: 'Hello!',
  messageType: 'TEXT'
});
```

#### `message:typing`
Indicador de escritura.

```typescript
socket.emit('message:typing', {
  roomId: 'room123',
  userId: 'user123',
  isTyping: true
});
```

#### `participant:update-state`
Actualizar estado de video/audio.

```typescript
socket.emit('participant:update-state', {
  roomId: 'room123',
  userId: 'user123',
  videoEnabled: true,
  audioEnabled: false
});
```

#### `webrtc:offer`
Enviar oferta WebRTC.

```typescript
socket.emit('webrtc:offer', {
  roomId: 'room123',
  targetUserId: 'user456',
  offer: signalData
});
```

#### `webrtc:answer`
Enviar respuesta WebRTC.

```typescript
socket.emit('webrtc:answer', {
  roomId: 'room123',
  targetUserId: 'user456',
  answer: signalData
});
```

#### `webrtc:ice-candidate`
Enviar candidato ICE.

```typescript
socket.emit('webrtc:ice-candidate', {
  roomId: 'room123',
  targetUserId: 'user456',
  candidate: candidateData
});
```

### Servidor → Cliente

#### `room:participants`
Lista de participantes actualizada.

```typescript
socket.on('room:participants', (data: { participants: Participant[] }) => {
  // Actualizar lista de participantes
});
```

#### `room:user-joined`
Usuario se unió a la sala.

```typescript
socket.on('room:user-joined', (data: { userId: string; username?: string; avatar?: string }) => {
  // Agregar usuario a la lista
});
```

#### `room:user-left`
Usuario salió de la sala.

```typescript
socket.on('room:user-left', (data: { userId: string }) => {
  // Remover usuario de la lista
});
```

#### `room:messages`
Mensajes históricos de la sala.

```typescript
socket.on('room:messages', (data: { messages: Message[] }) => {
  // Cargar mensajes
});
```

#### `message:new`
Nuevo mensaje recibido.

```typescript
socket.on('message:new', (data: { message: Message }) => {
  // Agregar mensaje a la lista
});
```

#### `message:typing`
Indicador de escritura.

```typescript
socket.on('message:typing', (data: { userId: string; isTyping: boolean }) => {
  // Mostrar/ocultar indicador de escritura
});
```

#### `participant:state-changed`
Estado de participante cambió.

```typescript
socket.on('participant:state-changed', (data: { userId: string; videoEnabled?: boolean; audioEnabled?: boolean }) => {
  // Actualizar estado del participante
});
```

#### `webrtc:offer`
Oferta WebRTC recibida.

```typescript
socket.on('webrtc:offer', (data: { fromUserId: string; offer: any }) => {
  // Crear peer y responder
});
```

#### `webrtc:answer`
Respuesta WebRTC recibida.

```typescript
socket.on('webrtc:answer', (data: { fromUserId: string; answer: any }) => {
  // Procesar respuesta
});
```

#### `webrtc:ice-candidate`
Candidato ICE recibido.

```typescript
socket.on('webrtc:ice-candidate', (data: { fromUserId: string; candidate: any }) => {
  // Agregar candidato ICE
});
```

## 🎮 Uso del Componente

### Ejemplo Básico

```tsx
import { VirtualNetworking } from '@/components/hackathons/VirtualNetworking';

function HackathonPage() {
  return (
    <VirtualNetworking
      hackathonId="eth-safari-2025"
      userId="user123"
    />
  );
}
```

### Características

1. **Lista de Salas**: Muestra todas las salas disponibles del hackathon
2. **Unirse a Sala**: Click en una sala para unirse
3. **Chat en Tiempo Real**: Mensajes instantáneos con WebSocket
4. **Video Rooms**: Video en tiempo real con WebRTC
5. **Controles de Audio/Video**: Toggle para activar/desactivar
6. **Breakout Sessions**: Crear sub-salas para discusiones pequeñas
7. **Indicador de Escritura**: Muestra cuando alguien está escribiendo
8. **Participantes en Línea**: Lista de participantes activos

## 🔧 Configuración

### Variables de Entorno

**Backend:**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Instalación de Dependencias

**Backend:**
```bash
cd backend
npm install socket.io uuid
npm install -D @types/uuid
```

**Frontend:**
```bash
cd frontend
npm install socket.io-client simple-peer
npm install -D @types/simple-peer
```

### Migración de Base de Datos

```bash
cd backend
npm run migrate
```

## 🚀 Despliegue

### Docker Compose

El servicio WebSocket se integra automáticamente con el servidor HTTP en el backend. No se requiere configuración adicional en docker-compose.yml.

### Producción

1. Configurar STUN/TURN servers para WebRTC
2. Habilitar HTTPS (requerido para WebRTC)
3. Configurar CORS adecuadamente
4. Configurar rate limiting para WebSocket
5. Monitorear conexiones WebSocket

## 🔒 Seguridad

- **Autenticación**: JWT tokens para WebSocket
- **Rate Limiting**: Limitar conexiones por usuario
- **Validación**: Validar todos los inputs
- **Sanitización**: Sanitizar mensajes antes de guardar
- **CORS**: Configurar CORS correctamente
- **HTTPS**: Requerido para WebRTC en producción

## 📈 Optimizaciones

### Para Baja Conectividad (África)

1. **Comprimir Mensajes**: Comprimir payloads grandes
2. **Lazy Loading**: Cargar videos solo cuando sea necesario
3. **Adaptive Bitrate**: Ajustar calidad de video según conexión
4. **Offline Support**: Cachear mensajes localmente
5. **Bandwidth Detection**: Detectar ancho de banda y ajustar

## 🐛 Troubleshooting

### WebSocket no conecta
- Verificar que el servidor esté corriendo
- Verificar CORS configuration
- Verificar que el token de autenticación sea válido

### WebRTC no funciona
- Verificar que HTTPS esté habilitado (en producción)
- Verificar STUN/TURN servers
- Verificar permisos de cámara/micrófono del navegador

### Mensajes no aparecen
- Verificar conexión WebSocket
- Verificar que el usuario esté en la sala
- Verificar logs del servidor

## 📚 Referencias

- [Socket.io Documentation](https://socket.io/docs/)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [simple-peer Documentation](https://github.com/feross/simple-peer)
- [Prisma Documentation](https://www.prisma.io/docs/)

