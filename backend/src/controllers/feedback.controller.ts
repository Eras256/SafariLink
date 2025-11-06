import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { OptionalAuthRequest } from '../middleware/optionalAuth.middleware';

export const feedbackController = {
  /**
   * Get all feedback for a project
   */
  async getProjectFeedback(req: OptionalAuthRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { limit = 50, offset = 0, feedbackType, userRole, includePrivate = false } = req.query;

      const where: any = {
        projectId,
        ...(includePrivate === 'false' && { isPublic: true }),
        ...(feedbackType && { feedbackType }),
        ...(userRole && { userRole }),
      };

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where,
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
          orderBy: { createdAt: 'desc' },
          take: Number(limit),
          skip: Number(offset),
        }),
        prisma.comment.count({ where }),
      ]);

      // Calculate average rating
      const ratings = comments.filter((c) => c.rating !== null).map((c) => c.rating!);
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : null;

      res.json({
        feedback: comments,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + comments.length < total,
        },
        stats: {
          totalFeedback: total,
          averageRating,
          ratingCount: ratings.length,
        },
      });
    } catch (error: any) {
      console.error('Error fetching project feedback:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch feedback' });
    }
  },

  /**
   * Create feedback for a project
   */
  async createFeedback(req: AuthRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { content, rating, feedbackType = 'COMMENT', userRole = 'PARTICIPANT', isPublic = true } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Verify project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          hackathonId: true,
          creatorId: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: {
          id: true,
          username: true,
          avatar: true,
          walletAddress: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Determine user role if not provided
      let finalUserRole = userRole;
      if (userRole === 'PARTICIPANT') {
        // Check if user is a judge or mentor in the hackathon
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
          userId: req.userId!,
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

      // Calculate updated project stats
      const projectStats = await prisma.comment.groupBy({
        by: ['rating'],
        where: { projectId, rating: { not: null } },
        _count: true,
      });

      const ratings = await prisma.comment.findMany({
        where: { projectId, rating: { not: null } },
        select: { rating: true },
      });

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        : null;

      res.status(201).json({
        feedback,
        projectStats: {
          averageRating,
          ratingCount: ratings.length,
          ratingDistribution: projectStats,
        },
      });
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      res.status(500).json({ error: error.message || 'Failed to create feedback' });
    }
  },

  /**
   * Update feedback
   */
  async updateFeedback(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content, rating, feedbackType, isPublic } = req.body;

      // Get existing feedback
      const existingFeedback = await prisma.comment.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingFeedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      // Verify ownership
      if (existingFeedback.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized: You can only update your own feedback' });
      }

      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Update feedback
      const feedback = await prisma.comment.update({
        where: { id },
        data: {
          ...(content && { content: content.trim() }),
          ...(rating !== undefined && { rating: rating || null }),
          ...(feedbackType && { feedbackType: feedbackType as any }),
          ...(isPublic !== undefined && { isPublic }),
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

      res.json({ feedback });
    } catch (error: any) {
      console.error('Error updating feedback:', error);
      res.status(500).json({ error: error.message || 'Failed to update feedback' });
    }
  },

  /**
   * Delete feedback
   */
  async deleteFeedback(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Get existing feedback
      const existingFeedback = await prisma.comment.findUnique({
        where: { id },
        select: { userId: true, projectId: true },
      });

      if (!existingFeedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      // Verify ownership or admin
      if (existingFeedback.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized: You can only delete your own feedback' });
      }

      // Delete feedback
      await prisma.comment.delete({
        where: { id },
      });

      res.json({ message: 'Feedback deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ error: error.message || 'Failed to delete feedback' });
    }
  },

  /**
   * Get feedback statistics for a project
   */
  async getFeedbackStats(req: OptionalAuthRequest, res: Response) {
    try {
      const { projectId } = req.params;

      const [
        totalFeedback,
        publicFeedback,
        ratings,
        feedbackByType,
        feedbackByRole,
      ] = await Promise.all([
        prisma.comment.count({
          where: { projectId },
        }),
        prisma.comment.count({
          where: { projectId, isPublic: true },
        }),
        prisma.comment.findMany({
          where: { projectId, rating: { not: null } },
          select: { rating: true },
        }),
        prisma.comment.groupBy({
          by: ['feedbackType'],
          where: { projectId },
          _count: true,
        }),
        prisma.comment.groupBy({
          by: ['userRole'],
          where: { projectId },
          _count: true,
        }),
      ]);

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        : null;

      const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
        const count = ratings.filter((r) => r.rating === i + 1).length;
        return { rating: i + 1, count };
      });

      res.json({
        totalFeedback,
        publicFeedback,
        averageRating,
        ratingCount: ratings.length,
        ratingDistribution,
        feedbackByType: feedbackByType.map((f) => ({
          type: f.feedbackType,
          count: f._count,
        })),
        feedbackByRole: feedbackByRole.map((f) => ({
          role: f.userRole,
          count: f._count,
        })),
      });
    } catch (error: any) {
      console.error('Error fetching feedback stats:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch feedback stats' });
    }
  },
};

