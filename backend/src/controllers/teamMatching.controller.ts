import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { TeamMatchingService } from '../services/teamMatching.service';
import { WebSocketService } from '../services/websocket.service';

// Get wsService instance - will be injected at runtime
let wsService: WebSocketService | null = null;

export function setWebSocketService(service: WebSocketService) {
  wsService = service;
}

const prisma = new PrismaClient();
const teamMatchingService = new TeamMatchingService();

// Validation schemas
const createProfileSchema = z.object({
  skills: z.array(z.string()).optional(),
  skillLevels: z.record(z.string()).optional(),
  lookingFor: z.array(z.string()).optional(),
  preferredRole: z.enum(['leader', 'member', 'flexible']).optional(),
  teamSize: z.object({
    min: z.number().int().min(1).max(10),
    max: z.number().int().min(1).max(10),
    preferred: z.number().int().min(1).max(10),
  }).optional(),
  availability: z.enum(['full-time', 'part-time', 'weekend']).optional(),
  availableHours: z.object({
    start: z.string(),
    end: z.string(),
    timezone: z.string(),
  }).optional(),
  bio: z.string().max(1000).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  previousProjects: z.array(z.any()).optional(),
  interests: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional(),
});

const updateProfileSchema = createProfileSchema.partial();

const findMatchesSchema = z.object({
  limit: z.number().int().min(1).max(50).optional().default(10),
});

const respondToMatchSchema = z.object({
  action: z.enum(['INTERESTED', 'NOT_INTERESTED']),
});

/**
 * Get user's matching profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { hackathonId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.teamMatchingProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            timezone: true,
            bio: true,
            location: true,
          },
        },
        hackathon: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create or update matching profile
 */
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { hackathonId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = createProfileSchema.parse(req.body);

    const profile = await teamMatchingService.createOrUpdateProfile(
      userId,
      hackathonId,
      validatedData
    );

    res.json({ profile });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Find matches for user
 */
export const findMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { hackathonId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { limit } = findMatchesSchema.parse(req.query);

    const matches = await teamMatchingService.findMatches(
      userId,
      hackathonId,
      limit
    );

    res.json({ matches });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error finding matches:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's matches (sent and received)
 */
export const getUserMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { hackathonId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const matches = await teamMatchingService.getUserMatches(userId, hackathonId);

    res.json({ matches });
  } catch (error: any) {
    console.error('Error getting user matches:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Respond to a match
 */
export const respondToMatch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { matchId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { action } = respondToMatchSchema.parse(req.body);

    const match = await teamMatchingService.respondToMatch(matchId, userId, action);

    // Notify the other user via WebSocket if mutual interest
    if (match.status === 'MUTUAL_INTEREST') {
      const otherUserId = match.senderId === userId ? match.receiverId : match.senderId;
      
      // Emit notification to the other user
      if (wsService) {
        wsService.emitToUser(otherUserId, 'team-match:mutual-interest', {
          matchId: match.id,
          match,
          message: '¡Hay interés mutuo! Pueden formar un equipo.',
        });
      }
    }

    res.json({ match });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error responding to match:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get match details
 */
export const getMatch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { matchId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const match = await prisma.teamMatch.findUnique({
      where: { id: matchId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            timezone: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
            timezone: true,
          },
        },
        hackathon: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Verify user is part of the match
    if (match.senderId !== userId && match.receiverId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Not part of this match' });
    }

    res.json({ match });
  } catch (error: any) {
    console.error('Error getting match:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete matching profile
 */
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.teamMatchingProfile.delete({
      where: { userId },
    });

    res.json({ message: 'Profile deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: error.message });
  }
};

