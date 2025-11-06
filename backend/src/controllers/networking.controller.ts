import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createRoomSchema = z.object({
  hackathonId: z.string(),
  trackId: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  track: z.string().optional(),
  roomType: z.enum(['GENERAL', 'TRACK_BASED', 'MENTOR_OFFICE_HOURS', 'JUDGE_QA', 'BREAKOUT']).default('GENERAL'),
  maxParticipants: z.number().int().min(2).max(100).optional(),
  isPrivate: z.boolean().default(false),
  password: z.string().optional(),
  videoEnabled: z.boolean().default(true),
  audioEnabled: z.boolean().default(true),
});

const joinRoomSchema = z.object({
  roomId: z.string(),
  password: z.string().optional(),
});

const createBreakoutSchema = z.object({
  roomId: z.string(),
  parentRoomId: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  maxParticipants: z.number().int().min(2).max(20).optional(),
});

/**
 * Get all rooms for a hackathon
 */
export const getRooms = async (req: Request, res: Response) => {
  try {
    const { hackathonId, track } = req.query;
    
    if (!hackathonId) {
      return res.status(400).json({ error: 'hackathonId is required' });
    }

    const where: any = {
      hackathonId: hackathonId as string,
      isActive: true,
    };

    if (track) {
      where.track = track as string;
    }

    const rooms = await prisma.networkingRoom.findMany({
      where,
      include: {
        participants: {
          where: { isActive: true },
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
        },
        _count: {
          select: {
            participants: { where: { isActive: true } },
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        description: room.description,
        track: room.track,
        roomType: room.roomType,
        participants: room._count.participants,
        messages: room._count.messages,
        maxParticipants: room.maxParticipants,
        isPrivate: room.isPrivate,
        videoEnabled: room.videoEnabled,
        audioEnabled: room.audioEnabled,
        createdAt: room.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ error: error.message || 'Failed to get rooms' });
  }
};

/**
 * Get a single room with details
 */
export const getRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.networkingRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          where: { isActive: true },
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
        },
        messages: {
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
        },
        breakoutSessions: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                room: {
                  select: {
                    participants: { where: { isActive: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({
      room: {
        ...room,
        participantCount: room.participants.length,
        messageCount: room.messages.length,
      },
    });
  } catch (error: any) {
    console.error('Error getting room:', error);
    res.status(500).json({ error: error.message || 'Failed to get room' });
  }
};

/**
 * Create a new networking room
 */
export const createRoom = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createRoomSchema.parse(req.body);

    // Check if hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: data.hackathonId },
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    const room = await prisma.networkingRoom.create({
      data: {
        ...data,
        metadata: {},
      },
      include: {
        _count: {
          select: {
            participants: true,
            messages: true,
          },
        },
      },
    });

    res.status(201).json({ room });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating room:', error);
    res.status(500).json({ error: error.message || 'Failed to create room' });
  }
};

/**
 * Join a room
 */
export const joinRoom = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { roomId } = req.params;
    const data = joinRoomSchema.parse({ roomId, ...req.body });

    const room = await prisma.networkingRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isActive) {
      return res.status(400).json({ error: 'Room is not active' });
    }

    // Check password if room is private
    if (room.isPrivate && room.password !== data.password) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    // Check max participants
    const participantCount = await prisma.roomParticipant.count({
      where: {
        roomId,
        isActive: true,
      },
    });

    if (room.maxParticipants && participantCount >= room.maxParticipants) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Join or update existing participation
    const participant = await prisma.roomParticipant.upsert({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      update: {
        isActive: true,
        joinedAt: new Date(),
        leftAt: null,
        videoEnabled: true,
        audioEnabled: true,
      },
      create: {
        roomId,
        userId,
        isActive: true,
        videoEnabled: true,
        audioEnabled: true,
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
      },
    });

    res.json({ participant });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error joining room:', error);
    res.status(500).json({ error: error.message || 'Failed to join room' });
  }
};

/**
 * Leave a room
 */
export const leaveRoom = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { roomId } = req.params;

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

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: error.message || 'Failed to leave room' });
  }
};

/**
 * Get room messages
 */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, cursor } = req.query;

    const where: any = {
      roomId,
      isDeleted: false,
    };

    if (cursor) {
      where.id = { lt: cursor as string };
    }

    const messages = await prisma.roomMessage.findMany({
      where,
      take: Number(limit),
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

    res.json({ messages: messages.reverse() });
  } catch (error: any) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: error.message || 'Failed to get messages' });
  }
};

/**
 * Create a breakout session
 */
export const createBreakout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createBreakoutSchema.parse(req.body);

    // Verify parent room exists
    const parentRoom = await prisma.networkingRoom.findUnique({
      where: { id: data.parentRoomId || data.roomId },
    });

    if (!parentRoom) {
      return res.status(404).json({ error: 'Parent room not found' });
    }

    // Create breakout room
    const breakoutRoom = await prisma.networkingRoom.create({
      data: {
        hackathonId: parentRoom.hackathonId,
        trackId: parentRoom.trackId,
        name: data.name,
        description: data.description,
        track: parentRoom.track,
        roomType: 'BREAKOUT',
        maxParticipants: data.maxParticipants || 10,
        videoEnabled: true,
        audioEnabled: true,
        metadata: {
          parentRoomId: data.parentRoomId || data.roomId,
        },
      },
    });

    // Create breakout session
    const breakoutSession = await prisma.breakoutSession.create({
      data: {
        roomId: breakoutRoom.id,
        parentRoomId: data.parentRoomId || data.roomId,
        name: data.name,
        description: data.description,
        maxParticipants: data.maxParticipants || 10,
      },
      include: {
        room: true,
      },
    });

    res.status(201).json({ breakoutSession });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating breakout:', error);
    res.status(500).json({ error: error.message || 'Failed to create breakout' });
  }
};

/**
 * Update participant video/audio state
 */
export const updateParticipantState = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { roomId } = req.params;
    const { videoEnabled, audioEnabled, peerId, streamId } = req.body;

    const participant = await prisma.roomParticipant.updateMany({
      where: {
        roomId,
        userId,
        isActive: true,
      },
      data: {
        ...(videoEnabled !== undefined && { videoEnabled }),
        ...(audioEnabled !== undefined && { audioEnabled }),
        ...(peerId && { peerId }),
        ...(streamId && { streamId }),
      },
    });

    res.json({ success: true, participant });
  } catch (error: any) {
    console.error('Error updating participant state:', error);
    res.status(500).json({ error: error.message || 'Failed to update participant state' });
  }
};

