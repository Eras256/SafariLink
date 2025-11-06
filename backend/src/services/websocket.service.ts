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

      // Feedback subscription
      socket.on('feedback:subscribe', async (data: { projectId: string; userId?: string }) => {
        try {
          const { projectId, userId } = data;

          // Verify project exists
          const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, hackathonId: true },
          });

          if (!project) {
            socket.emit('error', { message: 'Project not found' });
            return;
          }

          // Join feedback room
          await socket.join(`feedback:${projectId}`);
          console.log(`User ${userId} subscribed to feedback for project ${projectId}`);

          // Send initial feedback
          const feedback = await prisma.comment.findMany({
            where: { projectId, isPublic: true },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  walletAddress: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
          });

          socket.emit('feedback:list', { feedback });
        } catch (error: any) {
          console.error('Error subscribing to feedback:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Feedback unsubscribe
      socket.on('feedback:unsubscribe', async (data: { projectId: string }) => {
        try {
          const { projectId } = data;
          await socket.leave(`feedback:${projectId}`);
          console.log(`Unsubscribed from feedback for project ${projectId}`);
        } catch (error: any) {
          console.error('Error unsubscribing from feedback:', error);
        }
      });

      // New feedback
      socket.on('feedback:create', async (data: {
        projectId: string;
        userId: string;
        content: string;
        rating?: number;
        feedbackType?: string;
        userRole?: string;
        isPublic?: boolean;
      }) => {
        try {
          const { projectId, userId, content, rating, feedbackType = 'COMMENT', userRole = 'PARTICIPANT', isPublic = true } = data;

          // Verify project exists
          const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, hackathonId: true, creatorId: true },
          });

          if (!project) {
            socket.emit('error', { message: 'Project not found' });
            return;
          }

          // Get user info
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              username: true,
              avatar: true,
              walletAddress: true,
            },
          });

          if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
          }

          // Determine user role
          let finalUserRole = userRole;
          if (userRole === 'PARTICIPANT') {
            const hackathon = await prisma.hackathon.findUnique({
              where: { id: project.hackathonId },
              select: {
                judges: true,
                organizerId: true,
              },
            });

            if (hackathon) {
              const judges = (hackathon.judges as any[]) || [];
              const isJudge = judges.some(
                (j: any) => j.walletAddress?.toLowerCase() === user.walletAddress.toLowerCase()
              );
              const isOrganizer = hackathon.organizerId === user.id;

              if (isJudge) finalUserRole = 'JUDGE';
              else if (isOrganizer) finalUserRole = 'ORGANIZER';
            }
          }

          // Create feedback
          const feedback = await prisma.comment.create({
            data: {
              userId,
              projectId,
              content: content.trim(),
              rating: rating || null,
              feedbackType: feedbackType as any,
              userRole: finalUserRole as any,
              isPublic,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  walletAddress: true,
                },
              },
              project: {
                select: {
                  id: true,
                  name: true,
                  hackathonId: true,
                },
              },
            },
          });

          // Broadcast to all subscribers
          this.io.to(`feedback:${projectId}`).emit('feedback:new', { feedback });

          // Notify project creator if different from feedback author
          if (project.creatorId !== userId) {
            const creatorSocketId = this.userSockets.get(project.creatorId);
            if (creatorSocketId) {
              this.io.to(creatorSocketId).emit('feedback:notification', {
                type: 'new_feedback',
                projectId,
                projectName: project.id,
                feedback,
                message: `${user.username || 'Someone'} left feedback on your project`,
              });
            }
          }

          console.log(`Feedback created for project ${projectId} by user ${userId}`);
        } catch (error: any) {
          console.error('Error creating feedback:', error);
          socket.emit('error', { message: error.message });
        }
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

      // Dashboard metrics subscription
      socket.on('dashboard:subscribe', async (data: { hackathonId: string; userId?: string; walletAddress?: string }) => {
        try {
          const { hackathonId, userId, walletAddress } = data;

          // Verify user is organizer
          const hackathon = await prisma.hackathon.findUnique({
            where: { id: hackathonId },
            select: {
              organizerId: true,
              organizerWallet: true,
            },
          });

          if (!hackathon) {
            socket.emit('error', { message: 'Hackathon not found' });
            return;
          }

          // Verify organizer: check by userId or walletAddress
          let isOrganizer = false;
          if (userId && hackathon.organizerId === userId) {
            isOrganizer = true;
          } else if (walletAddress && hackathon.organizerWallet?.toLowerCase() === walletAddress.toLowerCase()) {
            isOrganizer = true;
          }

          if (!isOrganizer) {
            socket.emit('error', { message: 'Unauthorized: Not the organizer' });
            return;
          }

          // Join dashboard room
          await socket.join(`dashboard:${hackathonId}`);
          console.log(`User ${userId} subscribed to dashboard for hackathon ${hackathonId}`);

          // Send initial metrics
          const metrics = await this.getDashboardMetrics(hackathonId);
          socket.emit('dashboard:metrics', metrics);
        } catch (error: any) {
          console.error('Error subscribing to dashboard:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Dashboard metrics unsubscribe
      socket.on('dashboard:unsubscribe', async (data: { hackathonId: string }) => {
        try {
          const { hackathonId } = data;
          await socket.leave(`dashboard:${hackathonId}`);
          console.log(`Unsubscribed from dashboard for hackathon ${hackathonId}`);
        } catch (error: any) {
          console.error('Error unsubscribing from dashboard:', error);
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

    // Start periodic metrics updates for all active dashboard subscriptions
    this.startDashboardMetricsBroadcast();
  }

  /**
   * Get dashboard metrics for a hackathon
   */
  private async getDashboardMetrics(hackathonId: string) {
    const [activeParticipants, recentMessages, recentProjects, totalParticipants] = await Promise.all([
      prisma.roomParticipant.count({
        where: {
          room: {
            hackathonId,
          },
          isActive: true,
        },
      }),
      prisma.roomMessage.count({
        where: {
          room: {
            hackathonId,
          },
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
          },
          isDeleted: false,
        },
      }),
      prisma.project.count({
        where: {
          hackathonId,
          submittedAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
          },
        },
      }),
      prisma.hackathonRegistration.count({
        where: { hackathonId },
      }),
    ]);

    return {
      timestamp: new Date().toISOString(),
      activeParticipants,
      recentMessages,
      recentProjects,
      totalParticipants,
    };
  }

  /**
   * Broadcast dashboard metrics updates to all subscribed organizers
   */
  private startDashboardMetricsBroadcast() {
    setInterval(async () => {
      try {
        // Get all active hackathons
        const hackathons = await prisma.hackathon.findMany({
          where: {
            status: {
              in: ['ONGOING', 'REGISTRATION_OPEN', 'JUDGING'],
            },
          },
          select: {
            id: true,
          },
        });

        // Broadcast metrics for each hackathon
        for (const hackathon of hackathons) {
          const metrics = await this.getDashboardMetrics(hackathon.id);
          this.io.to(`dashboard:${hackathon.id}`).emit('dashboard:metrics', metrics);
        }
      } catch (error) {
        console.error('Error broadcasting dashboard metrics:', error);
      }
    }, 30000); // Update every 30 seconds
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

  public emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

