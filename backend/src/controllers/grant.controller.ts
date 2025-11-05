import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const grantController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const grants = await prisma.grantApplication.findMany({
        where: { userId: req.userId! },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              hackathon: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ grants });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch grants' });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const grant = await prisma.grantApplication.findUnique({
        where: { id },
        include: {
          project: true,
          user: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
            },
          },
        },
      });

      if (!grant) {
        return res.status(404).json({ error: 'Grant application not found' });
      }

      res.json({ grant });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch grant' });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const grantData = req.body;

      const grant = await prisma.grantApplication.create({
        data: {
          ...grantData,
          userId: req.userId!,
        },
      });

      res.status(201).json({ grant });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create grant application' });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const grant = await prisma.grantApplication.update({
        where: { id },
        data: updateData,
      });

      res.json({ grant });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update grant application' });
    }
  },
};

