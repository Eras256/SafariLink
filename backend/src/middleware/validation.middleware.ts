import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};

export const schemas = {
  createHackathon: z.object({
    body: z.object({
      name: z.string().min(3).max(100),
      tagline: z.string().max(200).optional(),
      description: z.string().min(50).max(10000),
      registrationStart: z.string().datetime(),
      registrationEnd: z.string().datetime(),
      eventStart: z.string().datetime(),
      eventEnd: z.string().datetime(),
      submissionDeadline: z.string().datetime(),
      totalPrizePool: z.number().positive(),
      chains: z.array(z.enum(['arbitrum', 'base', 'optimism'])).min(1),
      tracks: z.array(z.object({
        name: z.string(),
        description: z.string(),
        prizeAmount: z.number().positive(),
      })),
    }),
  }),

  submitProject: z.object({
    body: z.object({
      name: z.string().min(3).max(100),
      tagline: z.string().max(200).optional(),
      description: z.string().min(200).max(10000),
      demoUrl: z.string().url().optional(),
      videoUrl: z.string().url().optional(),
      githubUrl: z.string().url(),
      contracts: z.record(z.string()).optional(),
      techStack: z.array(z.string()),
    }),
  }),

  applyGrant: z.object({
    body: z.object({
      grantProgram: z.string(),
      amountRequested: z.number().positive(),
      proposal: z.string().min(500).max(20000),
      milestones: z.array(z.object({
        title: z.string(),
        description: z.string(),
        deliverables: z.array(z.string()),
        timeline: z.string(),
        budget: z.number().positive(),
      })),
    }),
  }),
};

