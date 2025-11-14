/**
 * Shared storage for Team Matching
 * In production, replace with a database (e.g., Vercel Postgres, MongoDB, etc.)
 */

export interface TeamMatchingProfile {
  id: string;
  userId: string;
  hackathonId: string;
  skills: string[];
  lookingFor: string[];
  preferredRole?: string;
  availability?: string;
  bio?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMatch {
  id: string;
  senderId: string;
  receiverId: string;
  hackathonId: string;
  matchScore: number;
  skillScore: number;
  timezoneScore: number;
  strengths: string[];
  considerations: string[];
  status: 'PENDING' | 'MUTUAL_INTEREST' | 'NOT_INTERESTED' | 'EXPIRED';
  senderAction?: 'INTERESTED' | 'NOT_INTERESTED';
  receiverAction?: 'INTERESTED' | 'NOT_INTERESTED';
  candidate?: TeamMatchingProfile;
  createdAt: string;
  updatedAt?: string;
}

// In-memory storage (replace with database in production)
export const profilesStorage = new Map<string, TeamMatchingProfile>();
export const matchesStorage = new Map<string, TeamMatch>();

