import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  store: RedisStore.create({
    client: redis as any,
    prefix: 'rl:api:',
  }),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
  store: RedisStore.create({
    client: redis as any,
    prefix: 'rl:auth:',
  }),
});

export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour
  message: 'Submission rate limit exceeded.',
  store: RedisStore.create({
    client: redis as any,
    prefix: 'rl:submit:',
  }),
});

