import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { GitHubService } from './github.service';

const prisma = new PrismaClient();
const githubService = new GitHubService();

interface MatchCandidate {
  userId: string;
  profile: any;
  skillScore: number;
  timezoneScore: number;
  githubScore: number;
  totalScore: number;
}

interface GeminiMatchAnalysis {
  reasoning: string;
  strengths: string[];
  considerations: string[];
  compatibilityScore: number;
}

export class TeamMatchingService {
  private readonly geminiApiKey = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';
  private readonly geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  /**
   * Calculate timezone compatibility score
   */
  private calculateTimezoneScore(
    timezone1: string | null | undefined,
    timezone2: string | null | undefined,
    availableHours1: any,
    availableHours2: any
  ): number {
    if (!timezone1 || !timezone2) {
      return 0.5; // Neutral score if timezone not specified
    }

    // Extract UTC offset from timezone strings (e.g., "UTC+3", "America/New_York")
    const getUTCOffset = (tz: string): number => {
      // Handle UTC+X format
      const utcMatch = tz.match(/UTC([+-]\d+)/);
      if (utcMatch) {
        return parseInt(utcMatch[1]);
      }

      // Handle common timezones (simplified)
      const timezoneMap: { [key: string]: number } = {
        'America/New_York': -5,
        'America/Los_Angeles': -8,
        'Europe/London': 0,
        'Europe/Paris': 1,
        'Asia/Tokyo': 9,
        'Asia/Shanghai': 8,
        'Africa/Lagos': 1,
        'Africa/Nairobi': 3,
        'Africa/Johannesburg': 2,
      };

      return timezoneMap[tz] || 0;
    };

    const offset1 = getUTCOffset(timezone1);
    const offset2 = getUTCOffset(timezone2);
    const timeDiff = Math.abs(offset1 - offset2);

    // Score based on time difference
    if (timeDiff === 0) return 1.0; // Same timezone
    if (timeDiff <= 2) return 0.9; // Very close (within 2 hours)
    if (timeDiff <= 4) return 0.7; // Close (within 4 hours)
    if (timeDiff <= 6) return 0.5; // Moderate (within 6 hours)
    if (timeDiff <= 8) return 0.3; // Far (within 8 hours)
    return 0.1; // Very far (more than 8 hours)

    // TODO: Consider availableHours overlap for more accurate scoring
  }

  /**
   * Calculate skill complementarity score
   */
  private calculateSkillScore(
    skills1: string[],
    skills2: string[],
    lookingFor1: string[],
    lookingFor2: string[]
  ): number {
    if (skills1.length === 0 && skills2.length === 0) {
      return 0.5; // Neutral if no skills specified
    }

    // Check if skills complement each other
    let complementScore = 0;
    let overlapScore = 0;

    // Calculate complementarity (skills one has that the other is looking for)
    const complement1 = skills1.filter(skill =>
      lookingFor2.some(looking => 
        skill.toLowerCase().includes(looking.toLowerCase()) ||
        looking.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;

    const complement2 = skills2.filter(skill =>
      lookingFor1.some(looking =>
        skill.toLowerCase().includes(looking.toLowerCase()) ||
        looking.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;

    const maxComplement = Math.max(lookingFor1.length, lookingFor2.length);
    complementScore = maxComplement > 0
      ? (complement1 + complement2) / (maxComplement * 2)
      : 0;

    // Calculate overlap (shared skills - good for collaboration)
    const overlap = skills1.filter(skill =>
      skills2.some(s => 
        skill.toLowerCase() === s.toLowerCase() ||
        skill.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;

    const maxSkills = Math.max(skills1.length, skills2.length);
    overlapScore = maxSkills > 0 ? overlap / maxSkills : 0;

    // Weighted combination: 70% complementarity, 30% overlap
    return complementScore * 0.7 + overlapScore * 0.3;
  }

  /**
   * Get GitHub score from profile
   */
  private getGitHubScore(profile: any): number {
    if (!profile.githubData) return 0.5; // Neutral if no GitHub data

    const githubData = profile.githubData as any;
    return githubData.qualityScore || 0.5;
  }

  /**
   * Use Gemini AI to analyze match compatibility
   */
  private async analyzeMatchWithAI(
    profile1: any,
    profile2: any,
    skillScore: number,
    timezoneScore: number,
    githubScore: number
  ): Promise<GeminiMatchAnalysis> {
    try {
      const prompt = `Eres un experto en análisis de compatibilidad de equipos para hackathons de Web3.

Analiza la compatibilidad entre estos dos participantes:

**Participante 1:**
- Skills: ${profile1.skills?.join(', ') || 'No especificados'}
- Niveles de skills: ${JSON.stringify(profile1.skillLevels || {})}
- Busca: ${profile1.lookingFor?.join(', ') || 'No especificado'}
- Timezone: ${profile1.user?.timezone || 'No especificado'}
- Disponibilidad: ${profile1.availability || 'No especificada'}
- Experiencia: ${profile1.experience || 'No especificada'}
- Bio: ${profile1.bio || 'No especificada'}
- GitHub: ${profile1.githubUsername ? `https://github.com/${profile1.githubUsername}` : 'No conectado'}

**Participante 2:**
- Skills: ${profile2.skills?.join(', ') || 'No especificados'}
- Niveles de skills: ${JSON.stringify(profile2.skillLevels || {})}
- Busca: ${profile2.lookingFor?.join(', ') || 'No especificado'}
- Timezone: ${profile2.user?.timezone || 'No especificado'}
- Disponibilidad: ${profile2.availability || 'No especificada'}
- Experiencia: ${profile2.experience || 'No especificada'}
- Bio: ${profile2.bio || 'No especificada'}
- GitHub: ${profile2.githubUsername ? `https://github.com/${profile2.githubUsername}` : 'No conectado'}

**Scores calculados:**
- Skill Complementarity: ${(skillScore * 100).toFixed(1)}%
- Timezone Compatibility: ${(timezoneScore * 100).toFixed(1)}%
- GitHub Quality: ${(githubScore * 100).toFixed(1)}%

Proporciona un análisis detallado en formato JSON con:
{
  "reasoning": "Explicación detallada de por qué son compatibles o no (2-3 párrafos)",
  "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
  "considerations": ["Consideración 1", "Consideración 2"],
  "compatibilityScore": 0.85
}

Responde SOLO con el JSON, sin texto adicional.`;

      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = responseText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const analysis = JSON.parse(jsonText) as GeminiMatchAnalysis;

      return {
        reasoning: analysis.reasoning || 'Análisis de compatibilidad generado por AI.',
        strengths: analysis.strengths || [],
        considerations: analysis.considerations || [],
        compatibilityScore: analysis.compatibilityScore || 0.5,
      };
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      // Fallback analysis
      return {
        reasoning: 'Análisis de compatibilidad basado en skills, timezone y GitHub activity.',
        strengths: [
          skillScore > 0.6 ? 'Skills complementarios' : '',
          timezoneScore > 0.6 ? 'Timezone compatible' : '',
          githubScore > 0.6 ? 'Actividad GitHub activa' : '',
        ].filter(Boolean),
        considerations: [
          'Revisa los perfiles detallados antes de decidir',
          'Considera la disponibilidad y preferencias de rol',
        ],
        compatibilityScore: (skillScore * 0.4 + timezoneScore * 0.3 + githubScore * 0.3),
      };
    }
  }

  /**
   * Find matching candidates for a user
   */
  async findMatches(
    userId: string,
    hackathonId: string,
    limit: number = 10
  ): Promise<any[]> {
    // Get user's matching profile
    const userProfile = await prisma.teamMatchingProfile.findUnique({
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
      },
    });

    if (!userProfile || !userProfile.isLookingForTeam) {
      throw new Error('User profile not found or not looking for team');
    }

    // Get all other active profiles looking for team
    const candidates = await prisma.teamMatchingProfile.findMany({
      where: {
        hackathonId,
        userId: { not: userId },
        isActive: true,
        isLookingForTeam: true,
      },
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
      },
    });

    // Calculate scores for each candidate
    const scoredCandidates: MatchCandidate[] = candidates.map((candidate) => {
      const skillScore = this.calculateSkillScore(
        userProfile.skills || [],
        candidate.skills || [],
        userProfile.lookingFor || [],
        candidate.lookingFor || []
      );

      const timezoneScore = this.calculateTimezoneScore(
        userProfile.user?.timezone,
        candidate.user?.timezone,
        userProfile.availableHours,
        candidate.availableHours
      );

      const githubScore = this.getGitHubScore(candidate);

      // Weighted total score
      const totalScore = skillScore * 0.4 + timezoneScore * 0.3 + githubScore * 0.3;

      return {
        userId: candidate.userId,
        profile: candidate,
        skillScore,
        timezoneScore,
        githubScore,
        totalScore,
      };
    });

    // Sort by total score
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    // Get top candidates and analyze with AI
    const topCandidates = scoredCandidates.slice(0, limit);
    const matches = await Promise.all(
      topCandidates.map(async (candidate) => {
        const aiAnalysis = await this.analyzeMatchWithAI(
          userProfile,
          candidate.profile,
          candidate.skillScore,
          candidate.timezoneScore,
          candidate.githubScore
        );

        // Create or update match record
        const match = await prisma.teamMatch.upsert({
          where: {
            senderId_receiverId_hackathonId: {
              senderId: userId,
              receiverId: candidate.userId,
              hackathonId,
            },
          },
          update: {
            matchScore: aiAnalysis.compatibilityScore,
            skillScore: candidate.skillScore,
            timezoneScore: candidate.timezoneScore,
            githubScore: candidate.githubScore,
            aiReasoning: aiAnalysis.reasoning,
            strengths: aiAnalysis.strengths,
            considerations: aiAnalysis.considerations,
            status: 'PENDING',
          },
          create: {
            senderId: userId,
            receiverId: candidate.userId,
            hackathonId,
            matchScore: aiAnalysis.compatibilityScore,
            skillScore: candidate.skillScore,
            timezoneScore: candidate.timezoneScore,
            githubScore: candidate.githubScore,
            aiReasoning: aiAnalysis.reasoning,
            strengths: aiAnalysis.strengths,
            considerations: aiAnalysis.considerations,
            status: 'PENDING',
          },
        });

        return {
          match,
          candidate: {
            ...candidate.profile,
            user: candidate.profile.user,
          },
          scores: {
            total: candidate.totalScore,
            skill: candidate.skillScore,
            timezone: candidate.timezoneScore,
            github: candidate.githubScore,
          },
          aiAnalysis,
        };
      })
    );

    return matches;
  }

  /**
   * Create or update matching profile
   */
  async createOrUpdateProfile(
    userId: string,
    hackathonId: string,
    data: {
      skills?: string[];
      skillLevels?: any;
      lookingFor?: string[];
      preferredRole?: string;
      teamSize?: any;
      availability?: string;
      availableHours?: any;
      bio?: string;
      experience?: string;
      previousProjects?: any;
      interests?: string[];
      githubUrl?: string;
    }
  ) {
    // If GitHub URL provided, analyze it
    if (data.githubUrl) {
      try {
        await githubService.updateUserGitHubData(userId, hackathonId, data.githubUrl);
      } catch (error) {
        console.error('Error analyzing GitHub profile:', error);
        // Continue even if GitHub analysis fails
      }
    }

    // Create or update profile
    const profile = await prisma.teamMatchingProfile.upsert({
      where: { userId },
      update: {
        ...(data.skills && { skills: { set: data.skills } }),
        ...(data.skillLevels && { skillLevels: data.skillLevels }),
        ...(data.lookingFor && { lookingFor: { set: data.lookingFor } }),
        ...(data.preferredRole && { preferredRole: data.preferredRole }),
        ...(data.teamSize && { teamSize: data.teamSize }),
        ...(data.availability && { availability: data.availability }),
        ...(data.availableHours && { availableHours: data.availableHours }),
        ...(data.bio && { bio: data.bio }),
        ...(data.experience && { experience: data.experience }),
        ...(data.previousProjects && { previousProjects: data.previousProjects }),
        ...(data.interests && { interests: { set: data.interests } }),
        isActive: true,
        isLookingForTeam: true,
      },
      create: {
        userId,
        hackathonId,
        skills: data.skills || [],
        skillLevels: data.skillLevels || {},
        lookingFor: data.lookingFor || [],
        preferredRole: data.preferredRole || 'flexible',
        teamSize: data.teamSize || { min: 2, max: 5, preferred: 4 },
        availability: data.availability || 'full-time',
        availableHours: data.availableHours,
        bio: data.bio,
        experience: data.experience || 'intermediate',
        previousProjects: data.previousProjects,
        interests: data.interests || [],
        isActive: true,
        isLookingForTeam: true,
      },
    });

    return profile;
  }

  /**
   * Respond to a match
   */
  async respondToMatch(
    matchId: string,
    userId: string,
    action: 'INTERESTED' | 'NOT_INTERESTED'
  ) {
    const match = await prisma.teamMatch.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Determine if user is sender or receiver
    const isSender = match.senderId === userId;
    const isReceiver = match.receiverId === userId;

    if (!isSender && !isReceiver) {
      throw new Error('Unauthorized: User is not part of this match');
    }

    // Update match
    const updateData: any = {
      respondedAt: new Date(),
    };

    if (isSender) {
      updateData.senderAction = action;
    } else {
      updateData.receiverAction = action;
    }

    // Check if both parties are interested
    if (
      (isSender && action === 'INTERESTED' && match.receiverAction === 'INTERESTED') ||
      (isReceiver && action === 'INTERESTED' && match.senderAction === 'INTERESTED')
    ) {
      updateData.status = 'MUTUAL_INTEREST';
    } else if (action === 'NOT_INTERESTED') {
      updateData.status = 'NOT_INTERESTED';
    }

    const updatedMatch = await prisma.teamMatch.update({
      where: { id: matchId },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return updatedMatch;
  }

  /**
   * Get user's matches
   */
  async getUserMatches(userId: string, hackathonId: string) {
    const matches = await prisma.teamMatch.findMany({
      where: {
        hackathonId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
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
      },
      orderBy: {
        matchScore: 'desc',
      },
    });

    return matches;
  }
}

