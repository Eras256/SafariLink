import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { OptionalAuthRequest } from '../middleware/optionalAuth.middleware';

export const organizerController = {
  /**
   * Get comprehensive dashboard metrics for a hackathon organizer
   */
  async getDashboardMetrics(req: OptionalAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const walletAddress = req.walletAddress || (req.query.walletAddress as string) || (req.headers['x-wallet-address'] as string);

      // Verify user is organizer of this hackathon
      const hackathon = await prisma.hackathon.findUnique({
        where: { id },
        select: {
          id: true,
          organizerId: true,
          organizerWallet: true,
        },
      });

      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }

      // Verify organizer: check by userId or walletAddress
      let isOrganizer = false;
      if (userId && hackathon.organizerId === userId) {
        isOrganizer = true;
      } else if (walletAddress && hackathon.organizerWallet?.toLowerCase() === walletAddress.toLowerCase()) {
        isOrganizer = true;
      }

      if (!isOrganizer) {
        return res.status(403).json({ error: 'Unauthorized: Not the organizer' });
      }

      // Get all metrics in parallel for performance
      const [
        registrations,
        projects,
        messages,
        rooms,
        votes,
        comments,
        participantsByCountry,
        projectsByTrack,
        engagementByHour,
        participantsOverTime,
        feedbackData,
        sponsorData,
      ] = await Promise.all([
        // Total registrations
        prisma.hackathonRegistration.count({
          where: { hackathonId: id },
        }),

        // Projects data
        prisma.project.findMany({
          where: { hackathonId: id },
          select: {
            id: true,
            status: true,
            trackId: true,
            submittedAt: true,
            createdAt: true,
            votes: {
              select: { id: true },
            },
            comments: {
              select: { id: true },
            },
          },
        }),

        // Messages count
        prisma.roomMessage.count({
          where: {
            room: {
              hackathonId: id,
            },
            isDeleted: false,
          },
        }),

        // Active rooms
        prisma.networkingRoom.findMany({
          where: {
            hackathonId: id,
            isActive: true,
          },
          include: {
            participants: {
              where: { isActive: true },
              select: { id: true },
            },
          },
        }),

        // Votes
        prisma.vote.findMany({
          where: {
            project: {
              hackathonId: id,
            },
          },
          select: {
            id: true,
            weight: true,
            createdAt: true,
          },
        }),

        // Comments
        prisma.comment.findMany({
          where: {
            project: {
              hackathonId: id,
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        }),

        // Participants by country
        prisma.user.findMany({
          where: {
            hackathonRegs: {
              some: {
                hackathonId: id,
                status: 'APPROVED',
              },
            },
          },
          select: {
            location: true,
          },
        }),

        // Projects by track
        prisma.project.groupBy({
          by: ['trackId'],
          where: { hackathonId: id },
          _count: true,
        }),

        // Engagement by hour (last 24 hours)
        prisma.roomMessage.groupBy({
          by: ['createdAt'],
          where: {
            room: {
              hackathonId: id,
            },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            isDeleted: false,
          },
          _count: true,
        }),

        // Participants over time
        prisma.hackathonRegistration.groupBy({
          by: ['createdAt'],
          where: { hackathonId: id },
          _count: true,
        }),

        // Feedback data (from RealTimeFeedback if available)
        prisma.project.findMany({
          where: { hackathonId: id },
          select: {
            id: true,
            name: true,
            votes: {
              select: {
                weight: true,
              },
            },
            comments: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            votes: {
              _count: 'desc',
            },
          },
          take: 10,
        }),

        // Sponsor data (from hackathon sponsors field)
        prisma.hackathon.findUnique({
          where: { id },
          select: {
            sponsors: true,
            totalPrizePool: true,
            currency: true,
          },
        }),
      ]);

      // Calculate active participants (active in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const activeParticipants = await prisma.roomParticipant.count({
        where: {
          room: {
            hackathonId: id,
          },
          isActive: true,
          joinedAt: {
            gte: oneHourAgo,
          },
        },
      });

      // Process countries
      const countryMap = new Map<string, number>();
      participantsByCountry.forEach((user) => {
        if (user.location) {
          countryMap.set(user.location, (countryMap.get(user.location) || 0) + 1);
        }
      });
      const topCountries = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, participants: count }))
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 10);

      // Process tracks
      const trackIds = projectsByTrack.map((p) => p.trackId).filter(Boolean) as string[];
      const tracks = await prisma.track.findMany({
        where: {
          id: { in: trackIds },
        },
        select: {
          id: true,
          name: true,
        },
      });
      const trackMap = new Map(tracks.map((t) => [t.id, t.name]));
      const projectsByTrackName = projectsByTrack
        .map((p) => ({
          track: p.trackId ? trackMap.get(p.trackId) || 'Unknown' : 'No Track',
          count: p._count,
        }))
        .sort((a, b) => b.count - a.count);

      // Process engagement by hour
      const hourMap = new Map<number, number>();
      engagementByHour.forEach((item) => {
        const hour = new Date(item.createdAt).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + item._count);
      });
      const engagementByHourArray = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        engagement: hourMap.get(i) || 0,
      }));

      // Process participants over time (group by day)
      const dayMap = new Map<string, number>();
      participantsOverTime.forEach((item) => {
        const day = new Date(item.createdAt).toISOString().split('T')[0];
        dayMap.set(day, (dayMap.get(day) || 0) + item._count);
      });
      const participantsOverTimeArray = Array.from(dayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate engagement metrics
      const totalVotes = votes.reduce((sum, v) => sum + v.weight, 0);
      const totalComments = comments.length;
      const totalInteractions = totalVotes + totalComments + messages;
      const totalParticipants = registrations;
      const averageEngagement =
        totalParticipants > 0 ? (totalInteractions / totalParticipants) * 100 : 0;

      // Calculate ROI for sponsors
      const sponsors = (sponsorData?.sponsors as any[]) || [];
      const sponsorROI = sponsors.map((sponsor: any) => {
        const sponsorInvestment = sponsor.amount || 0;
        const impressions = totalParticipants * 3; // Estimated impressions per participant
        const clicks = Math.floor(impressions * 0.05); // 5% CTR
        const conversions = Math.floor(clicks * 0.02); // 2% conversion rate
        const roi = sponsorInvestment > 0 ? ((conversions * 100 - sponsorInvestment) / sponsorInvestment) * 100 : 0;
        const cpm = sponsorInvestment > 0 ? (sponsorInvestment / impressions) * 1000 : 0;
        const cpc = clicks > 0 ? sponsorInvestment / clicks : 0;

        return {
          name: sponsor.name || 'Unknown Sponsor',
          investment: sponsorInvestment,
          impressions,
          clicks,
          conversions,
          roi: Math.round(roi * 100) / 100,
          cpm: Math.round(cpm * 100) / 100,
          cpc: Math.round(cpc * 100) / 100,
        };
      });

      // Calculate project feedback scores
      const projectFeedback = feedbackData.map((project) => {
        const voteCount = project.votes.length;
        const voteWeight = project.votes.reduce((sum, v) => sum + v.weight, 0);
        const commentCount = project.comments.length;
        const engagementScore = voteWeight * 2 + commentCount * 1.5;

        return {
          id: project.id,
          name: project.name,
          votes: voteCount,
          voteWeight,
          comments: commentCount,
          engagementScore: Math.round(engagementScore * 100) / 100,
        };
      });

      // Calculate submission rate
      const submittedProjects = projects.filter((p) => p.status === 'SUBMITTED').length;
      const submissionRate = projects.length > 0 ? (submittedProjects / projects.length) * 100 : 0;

      // Active rooms count
      const activeRooms = rooms.length;
      const totalActiveInRooms = rooms.reduce((sum, room) => sum + room.participants.length, 0);

      res.json({
        metrics: {
          totalParticipants: registrations,
          activeParticipants,
          totalProjects: projects.length,
          submittedProjects,
          submissionRate: Math.round(submissionRate * 100) / 100,
          totalMessages: messages,
          activeRooms,
          totalActiveInRooms,
          averageEngagement: Math.round(averageEngagement * 100) / 100,
          countriesRepresented: topCountries.length,
          totalVotes,
          totalComments,
          totalInteractions,
        },
        stats: {
          participantsOverTime: participantsOverTimeArray,
          projectsByTrack: projectsByTrackName,
          engagementByHour: engagementByHourArray,
          topCountries,
        },
        feedback: {
          topProjects: projectFeedback.slice(0, 10),
          averageVotesPerProject: projects.length > 0 ? totalVotes / projects.length : 0,
          averageCommentsPerProject: projects.length > 0 ? totalComments / projects.length : 0,
        },
        sponsors: {
          roi: sponsorROI,
          totalInvestment: sponsorROI.reduce((sum, s) => sum + s.investment, 0),
          totalImpressions: sponsorROI.reduce((sum, s) => sum + s.impressions, 0),
          totalClicks: sponsorROI.reduce((sum, s) => sum + s.clicks, 0),
          totalConversions: sponsorROI.reduce((sum, s) => sum + s.conversions, 0),
        },
      });
    } catch (error: any) {
      console.error('Error fetching dashboard metrics:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard metrics' });
    }
  },

  /**
   * Get real-time metrics updates (for WebSocket)
   */
  async getRealtimeMetrics(req: OptionalAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const walletAddress = req.walletAddress;

      // Verify user is organizer
      const hackathon = await prisma.hackathon.findUnique({
        where: { id },
        select: {
          organizerId: true,
          organizerWallet: true,
        },
      });

      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }

      // Verify organizer: check by userId or walletAddress
      let isOrganizer = false;
      if (userId && hackathon.organizerId === userId) {
        isOrganizer = true;
      } else if (walletAddress && hackathon.organizerWallet?.toLowerCase() === walletAddress.toLowerCase()) {
        isOrganizer = true;
      }

      if (!isOrganizer) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Get quick real-time metrics
      const [activeParticipants, recentMessages, recentProjects] = await Promise.all([
        prisma.roomParticipant.count({
          where: {
            room: {
              hackathonId: id,
            },
            isActive: true,
          },
        }),
        prisma.roomMessage.count({
          where: {
            room: {
              hackathonId: id,
            },
            createdAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
            },
            isDeleted: false,
          },
        }),
        prisma.project.count({
          where: {
            hackathonId: id,
            submittedAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
            },
          },
        }),
      ]);

      res.json({
        timestamp: new Date().toISOString(),
        activeParticipants,
        recentMessages,
        recentProjects,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch real-time metrics' });
    }
  },
};

