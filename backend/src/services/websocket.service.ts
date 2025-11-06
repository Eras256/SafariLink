import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface SocketUser {
  userId: string;
  username?: string;
  avatar?: string;
  socketId: string;
}

interface RoomSocket {
  roomId: string;
  participants: Map<string, SocketUser>;
}

export class WebSocketService {
  private io: SocketIOServer;
  private roomSockets: Map<string, RoomSocket> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Authentication middleware
      socket.use(async (packet, next) => {
        try {
          const token = socket.handshake.auth.token;
          if (!token) {
            return next(new Error('Authentication required'));
          }
          // In production, verify JWT token here
          // For now, we'll use the userId from auth
          next();
        } catch (error) {
          next(new Error('Authentication failed'));
        }
      });

      // Join room
      socket.on('room:join', async (data: { roomId: string; userId: string }) => {
        try {
          const { roomId, userId } = data;

          // Verify room exists and user can join
          const room = await prisma.networkingRoom.findUnique({
            where: { id: roomId },
          });

          if (!room || !room.isActive) {
            socket.emit('error', { message: 'Room not found or inactive' });
            return;
          }

          // Get user info
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });

          if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
          }

          // Join socket room
          await socket.join(roomId);

          // Track user in room
          if (!this.roomSockets.has(roomId)) {
            this.roomSockets.set(roomId, {
              roomId,
              participants: new Map(),
            });
          }

          const roomSocket = this.roomSockets.get(roomId)!;
          const socketUser: SocketUser = {
            userId,
            username: user.username || undefined,
            avatar: user.avatar || undefined,
            socketId: socket.id,
          };

          roomSocket.participants.set(userId, socketUser);
          this.userSockets.set(userId, socket.id);

          // Notify others in room
          socket.to(roomId).emit('room:user-joined', {
            userId,
            username: user.username,
            avatar: user.avatar,
            timestamp: new Date(),
          });

          // Send current participants to new user
          const participants = Array.from(roomSocket.participants.values());
          socket.emit('room:participants', { participants });

          // Load recent messages
          const messages = await prisma.roomMessage.findMany({
            where: { roomId, isDeleted: false },
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          });

          socket.emit('room:messages', { messages: messages.reverse() });

          console.log(`User ${userId} joined room ${roomId}`);
        } catch (error: any) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Leave room
      socket.on('room:leave', async (data: { roomId: string; userId: string }) => {
        try {
          const { roomId, userId } = data;

          await socket.leave(roomId);

          const roomSocket = this.roomSockets.get(roomId);
          if (roomSocket) {
            roomSocket.participants.delete(userId);
            if (roomSocket.participants.size === 0) {
              this.roomSockets.delete(roomId);
            }
          }

          this.userSockets.delete(userId);

          // Notify others
          socket.to(roomId).emit('room:user-left', {
            userId,
            timestamp: new Date(),
          });

          console.log(`User ${userId} left room ${roomId}`);
        } catch (error: any) {
          console.error('Error leaving room:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Send message
      socket.on('message:send', async (data: { roomId: string; userId: string; content: string; messageType?: string }) => {
        try {
          const { roomId, userId, content, messageType = 'TEXT' } = data;

          // Verify user is in room
          const roomSocket = this.roomSockets.get(roomId);
          if (!roomSocket || !roomSocket.participants.has(userId)) {
            socket.emit('error', { message: 'Not in room' });
            return;
          }

          // Save message to database
          const message = await prisma.roomMessage.create({
            data: {
              roomId,
              userId,
              content,
              messageType: messageType as any,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          });

          // Broadcast to room
          this.io.to(roomId).emit('message:new', { message });

          console.log(`Message sent in room ${roomId} by user ${userId}`);
        } catch (error: any) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Typing indicator
      socket.on('message:typing', (data: { roomId: string; userId: string; isTyping: boolean }) => {
        const { roomId, userId, isTyping } = data;
        socket.to(roomId).emit('message:typing', { userId, isTyping });
      });

      // WebRTC signaling
      socket.on('webrtc:offer', (data: { roomId: string; targetUserId: string; offer: any }) => {
        const { roomId, targetUserId, offer } = data;
        const targetSocketId = this.userSockets.get(targetUserId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('webrtc:offer', {
            fromUserId: socket.handshake.auth.userId,
            offer,
          });
        }
      });

      socket.on('webrtc:answer', (data: { roomId: string; targetUserId: string; answer: any }) => {
        const { roomId, targetUserId, answer } = data;
        const targetSocketId = this.userSockets.get(targetUserId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('webrtc:answer', {
            fromUserId: socket.handshake.auth.userId,
            answer,
          });
        }
      });

      socket.on('webrtc:ice-candidate', (data: { roomId: string; targetUserId: string; candidate: any }) => {
        const { roomId, targetUserId, candidate } = data;
        const targetSocketId = this.userSockets.get(targetUserId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('webrtc:ice-candidate', {
            fromUserId: socket.handshake.auth.userId,
            candidate,
          });
        }
      });

      // Update participant state (video/audio)
      socket.on('participant:update-state', async (data: { roomId: string; userId: string; videoEnabled?: boolean; audioEnabled?: boolean }) => {
        try {
          const { roomId, userId, videoEnabled, audioEnabled } = data;

          await prisma.roomParticipant.updateMany({
            where: {
              roomId,
              userId,
              isActive: true,
            },
            data: {
              ...(videoEnabled !== undefined && { videoEnabled }),
              ...(audioEnabled !== undefined && { audioEnabled }),
            },
          });

          // Broadcast state change
          socket.to(roomId).emit('participant:state-changed', {
            userId,
            videoEnabled,
            audioEnabled,
          });
        } catch (error: any) {
          console.error('Error updating participant state:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);

        // Remove from all rooms
        for (const [roomId, roomSocket] of this.roomSockets.entries()) {
          for (const [userId, user] of roomSocket.participants.entries()) {
            if (user.socketId === socket.id) {
              roomSocket.participants.delete(userId);
              this.userSockets.delete(userId);

              // Notify others
              socket.to(roomId).emit('room:user-left', {
                userId,
                timestamp: new Date(),
              });

              // Update database
              await prisma.roomParticipant.updateMany({
                where: {
                  roomId,
                  userId,
                  isActive: true,
                },
                data: {
                  isActive: false,
                  leftAt: new Date(),
                },
              });

              if (roomSocket.participants.size === 0) {
                this.roomSockets.delete(roomId);
              }
              break;
            }
          }
        }
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public getRoomParticipants(roomId: string): SocketUser[] {
    const roomSocket = this.roomSockets.get(roomId);
    return roomSocket ? Array.from(roomSocket.participants.values()) : [];
  }

  public emitToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }
}

