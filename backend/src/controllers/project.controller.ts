import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const projectController = {
  async getAll(req: Request, res: Response) {
    try {
      const { hackathonId, trackId, status } = req.query;

      const where: any = {};
      if (hackathonId) where.hackathonId = hackathonId;
      if (trackId) where.trackId = trackId;
      if (status) where.status = status;

      const projects = await prisma.project.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
            },
          },
          hackathon: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
            },
          },
          team: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      walletAddress: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  walletAddress: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const projectData = req.body;

      const project = await prisma.project.create({
        data: {
          ...projectData,
          creatorId: req.userId!,
          slug: projectData.name.toLowerCase().replace(/\s+/g, '-'),
        },
      });

      res.status(201).json({ project });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create project' });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const project = await prisma.project.update({
        where: { id },
        data: updateData,
      });

      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  async submit(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const project = await prisma.project.update({
        where: { id },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit project' });
    }
  },

  async vote(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const vote = await prisma.vote.upsert({
        where: {
          userId_projectId: {
            userId: req.userId!,
            projectId: id,
          },
        },
        update: {
          weight: { increment: 1 },
        },
        create: {
          userId: req.userId!,
          projectId: id,
          weight: 1,
        },
      });

      res.json({ vote });
    } catch (error) {
      res.status(500).json({ error: 'Failed to vote' });
    }
  },
};

