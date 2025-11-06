import { PrismaClient } from '@prisma/client';
import { NFTService } from './nft.service';

const prisma = new PrismaClient();
const nftService = new NFTService();

export class GamificationService {
  /**
   * Calculate user's gamification score for a hackathon
   */
  async calculateUserScore(userId: string, hackathonId: string): Promise<number> {
    const [
      badgeCount,
      projectCount,
      challengeCount,
      feedbackGiven,
      feedbackReceived,
      networkingRoomsGroups,
    ] = await Promise.all([
      // Badges earned
      prisma.userBadge.count({
        where: { userId, hackathonId },
      }),

      // Projects submitted
      prisma.project.count({
        where: {
          creatorId: userId,
          hackathonId,
          status: { in: ['SUBMITTED', 'APPROVED', 'WINNER'] },
        },
      }),

      // Challenges completed
      prisma.userChallenge.count({
        where: { userId, hackathonId },
      }),

      // Feedback given
      prisma.comment.count({
        where: {
          userId,
          project: { hackathonId },
        },
      }),

      // Feedback received
      prisma.comment.count({
        where: {
          project: {
            creatorId: userId,
            hackathonId,
          },
        },
      }),

      // Networking rooms joined
      prisma.roomParticipant.groupBy({
        by: ['roomId'],
        where: {
          userId,
          room: { hackathonId },
        },
      }),
    ]);

    const networkingRooms = networkingRoomsGroups.length;

    // Calculate score based on activities
    let score = 0;

    // Badges: 100 points each
    score += badgeCount * 100;

    // Projects: 500 points each
    score += projectCount * 500;

    // Challenges: Points from challenge
    const challenges = await prisma.userChallenge.findMany({
      where: { userId, hackathonId },
      include: { challenge: true },
    });
    score += challenges.reduce((sum, uc) => sum + uc.pointsEarned, 0);

    // Feedback given: 10 points each
    score += feedbackGiven * 10;

    // Feedback received: 5 points each
    score += feedbackReceived * 5;

    // Networking: 25 points per room
    score += networkingRooms * 25;

    return score;
  }

  /**
   * Check and award badges based on user activity
   */
  async checkAndAwardBadges(userId: string, hackathonId: string): Promise<string[]> {
    const awardedBadgeIds: Array<string> = [];

    // Get all active badges for this hackathon
    const badges = await prisma.badge.findMany({
      where: {
        hackathonId,
        isActive: true,
      },
    });

    // Get user's current stats
    const userStats = await this.getUserStats(userId, hackathonId);

    for (const badge of badges) {
      // Check if user already has this badge
      const existingBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId_hackathonId: {
            userId,
            badgeId: badge.id,
            hackathonId,
          },
        },
      });

      if (existingBadge) continue;

      // Check if user meets badge requirements
      const requirement = badge.requirement as any;
      let meetsRequirement = false;

      switch (badge.badgeType) {
        case 'PROJECT_SUBMISSION':
          meetsRequirement = userStats.projectCount >= (requirement?.projects || 1);
          break;

        case 'FEEDBACK_GIVEN':
          meetsRequirement = userStats.feedbackGiven >= (requirement?.feedback || 10);
          break;

        case 'FEEDBACK_RECEIVED':
          meetsRequirement = userStats.feedbackReceived >= (requirement?.feedback || 5);
          break;

        case 'NETWORKING':
          meetsRequirement = userStats.networkingRooms >= (requirement?.rooms || 5);
          break;

        case 'TEAM_COLLABORATION':
          meetsRequirement = userStats.teamCount >= (requirement?.teams || 1);
          break;

        case 'DAILY_CHALLENGE':
          meetsRequirement = userStats.challengeCount >= (requirement?.challenges || 7);
          break;

        case 'WINNER':
          meetsRequirement = userStats.winnerCount > 0;
          break;

        case 'PARTICIPATION':
          meetsRequirement = true; // Always awarded for participation
          break;

        default:
          // Custom badge - check custom requirements
          meetsRequirement = this.checkCustomRequirement(requirement, userStats);
      }

      if (meetsRequirement) {
        // Award badge
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            hackathonId,
          },
        });

        // Mint NFT if badge has NFT reward
        if (badge.nftReward) {
          try {
            const nftResult = await nftService.mintBadgeReward(userId, badge.id, hackathonId);
            if (nftResult) {
              await prisma.userBadge.update({
                where: { id: userBadge.id },
                data: {
                  nftTokenId: nftResult.tokenId,
                  nftTxHash: nftResult.txHash,
                },
              });
            }
          } catch (error) {
            console.error('Error minting badge NFT:', error);
            // Continue even if NFT mint fails
          }
        }

        // Update user's gamification score
        await prisma.user.update({
          where: { id: userId },
          data: {
            gamificationScore: {
              increment: badge.points,
            },
          },
        });

        // Update leaderboard
        await this.updateLeaderboard(userId, hackathonId);

        awardedBadgeIds.push(badge.id);
      }
    }

    return awardedBadgeIds as string[];
  }

  /**
   * Get user stats for badge checking
   */
  private async getUserStats(userId: string, hackathonId: string) {
    const [
      projectCount,
      feedbackGiven,
      feedbackReceived,
      networkingRoomsGroups,
      teamGroups,
      challengeCount,
      winnerCount,
    ] = await Promise.all([
      prisma.project.count({
        where: {
          creatorId: userId,
          hackathonId,
          status: { in: ['SUBMITTED', 'APPROVED', 'WINNER'] },
        },
      }),

      prisma.comment.count({
        where: {
          userId,
          project: { hackathonId },
        },
      }),

      prisma.comment.count({
        where: {
          project: {
            creatorId: userId,
            hackathonId,
          },
        },
      }),

      prisma.roomParticipant.groupBy({
        by: ['roomId'],
        where: {
          userId,
          room: { hackathonId },
        },
      }),

      prisma.teamMember.groupBy({
        by: ['teamId'],
        where: {
          userId,
          team: {
            projects: {
              some: { hackathonId },
            },
          },
        },
      }),

      prisma.userChallenge.count({
        where: { userId, hackathonId },
      }),

      prisma.project.count({
        where: {
          creatorId: userId,
          hackathonId,
          status: 'WINNER',
        },
      }),
    ]);

    const networkingRooms = networkingRoomsGroups.length;
    const teamCount = teamGroups.length;

    return {
      projectCount,
      feedbackGiven,
      feedbackReceived,
      networkingRooms,
      teamCount,
      challengeCount,
      winnerCount,
    };
  }

  /**
   * Check custom badge requirements
   */
  private checkCustomRequirement(requirement: any, userStats: any): boolean {
    if (!requirement) return false;

    // Check each requirement
    for (const [key, value] of Object.entries(requirement)) {
      if (userStats[key] < (value as number)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update leaderboard for a user
   */
  async updateLeaderboard(userId: string, hackathonId: string): Promise<void> {
    const score = await this.calculateUserScore(userId, hackathonId);

    const [badgeCount, projectCount, challengeCount] = await Promise.all([
      prisma.userBadge.count({
        where: { userId, hackathonId },
      }),
      prisma.project.count({
        where: {
          creatorId: userId,
          hackathonId,
          status: { in: ['SUBMITTED', 'APPROVED', 'WINNER'] },
        },
      }),
      prisma.userChallenge.count({
        where: { userId, hackathonId },
      }),
    ]);

    // Get or create leaderboard entry
    const entry = await prisma.leaderboardEntry.upsert({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId,
        },
      },
      update: {
        totalScore: score,
        badgeCount,
        projectCount,
        challengeCount,
        lastUpdated: new Date(),
      },
      create: {
        userId,
        hackathonId,
        totalScore: score,
        badgeCount,
        projectCount,
        challengeCount,
      },
    });

    // Recalculate ranks for all users in this hackathon
    await this.recalculateRanks(hackathonId);
  }

  /**
   * Recalculate ranks for all users in a hackathon
   */
  async recalculateRanks(hackathonId: string): Promise<void> {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { hackathonId },
      orderBy: { totalScore: 'desc' },
    });

    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const newRank = i + 1;

      await prisma.leaderboardEntry.update({
        where: { id: entry.id },
        data: {
          previousRank: entry.rank,
          rank: newRank,
        },
      });
    }
  }

  /**
   * Get leaderboard for a hackathon
   */
  async getLeaderboard(
    hackathonId: string,
    limit: number = 100,
    offset: number = 0
  ) {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { hackathonId },
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
      orderBy: { rank: 'asc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.leaderboardEntry.count({
      where: { hackathonId },
    });

    return {
      entries,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get user's leaderboard position
   */
  async getUserRank(userId: string, hackathonId: string) {
    const entry = await prisma.leaderboardEntry.findUnique({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId,
        },
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

    return entry;
  }

  /**
   * Complete a daily challenge
   */
  async completeChallenge(
    userId: string,
    challengeId: string,
    hackathonId: string
  ) {
    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || !challenge.isActive) {
      throw new Error('Challenge not found or inactive');
    }

    // Check if challenge is still valid (within date range)
    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate) {
      throw new Error('Challenge is not currently active');
    }

    // Check if user already completed this challenge
    const existing = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId_hackathonId: {
          userId,
          challengeId,
          hackathonId,
        },
      },
    });

    if (existing) {
      throw new Error('Challenge already completed');
    }

    // Create user challenge completion
    const userChallenge = await prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        hackathonId,
        pointsEarned: challenge.points,
      },
      include: {
        challenge: true,
      },
    });

    // Update user's gamification score
    await prisma.user.update({
      where: { id: userId },
      data: {
        gamificationScore: {
          increment: challenge.points,
        },
      },
    });

    // Update leaderboard
    await this.updateLeaderboard(userId, hackathonId);

    // Mint NFT if challenge has NFT reward
    if (challenge.nftReward) {
      try {
        const nftResult = await nftService.mintChallengeReward(userId, challengeId, hackathonId);
        if (nftResult) {
          await prisma.userChallenge.update({
            where: { id: userChallenge.id },
            data: {
              nftTokenId: nftResult.tokenId,
              nftTxHash: nftResult.txHash,
            },
          });
        }
      } catch (error) {
        console.error('Error minting challenge NFT:', error);
        // Continue even if NFT mint fails
      }
    }

    // Check for badge awards
    await this.checkAndAwardBadges(userId, hackathonId);

    return userChallenge;
  }

  /**
   * Get daily challenges for a hackathon
   */
  async getDailyChallenges(hackathonId: string, userId?: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const challenges = await prisma.challenge.findMany({
      where: {
        hackathonId,
        isActive: true,
        isDaily: true,
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If userId provided, check which challenges are completed
    if (userId) {
      const completedChallenges = await prisma.userChallenge.findMany({
        where: {
          userId,
          hackathonId,
          challengeId: { in: challenges.map((c) => c.id) },
        },
        select: { challengeId: true },
      });

      const completedIds = new Set(completedChallenges.map((c) => c.challengeId));

      return challenges.map((challenge) => ({
        ...challenge,
        completed: completedIds.has(challenge.id),
      }));
    }

    return challenges;
  }
}

