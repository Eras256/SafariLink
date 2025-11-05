import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const hackathonController = {
  async getAll(req: Request, res: Response) {
    try {
      const { status, chain, page = '1', limit = '10' } = req.query;

      const where: any = {};
      if (status) where.status = status;
      if (chain) where.chains = { has: chain };

      const hackathons = await prisma.hackathon.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { eventStart: 'desc' },
        include: {
          _count: {
            select: {
              registrations: true,
              projects: true,
            },
          },
        },
      });

      res.json({ hackathons });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const hackathon = await prisma.hackathon.findUnique({
        where: { id },
        include: {
          tracks: true,
          registrations: {
            include: {
              user: {
                select: {
                  id: true,
                  walletAddress: true,
                  username: true,
                  builderScore: true,
                },
              },
            },
          },
          projects: {
            include: {
              creator: {
                select: {
                  id: true,
                  walletAddress: true,
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }

      res.json({ hackathon });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hackathon' });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const hackathonData = req.body;

      const hackathon = await prisma.hackathon.create({
        data: {
          ...hackathonData,
          organizerId: req.userId!,
          organizerWallet: req.walletAddress!,
        },
      });

      res.status(201).json({ hackathon });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create hackathon' });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const hackathon = await prisma.hackathon.update({
        where: { id },
        data: updateData,
      });

      res.json({ hackathon });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update hackathon' });
    }
  },

  async register(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const registration = await prisma.hackathonRegistration.create({
        data: {
          userId: req.userId!,
          hackathonId: id,
          status: 'PENDING',
        },
      });

      res.status(201).json({ registration });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Already registered' });
      }
      res.status(500).json({ error: 'Failed to register' });
    }
  },

  async getProjects(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const projects = await prisma.project.findMany({
        where: { hackathonId: id },
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
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },
};

