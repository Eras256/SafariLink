import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { redis } from '../config/redis';

// TODO: Fix Redis compatibility - rate-limit-redis v4 is not compatible with redis v4
// For now, using in-memory store. In production, consider:
// 1. Downgrade redis to v3, or
// 2. Use a different rate limiting solution compatible with redis v4

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  // store: new RedisStore({
  //   client: redis as any,
  //   prefix: 'rl:api:',
  // }),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
  // store: new RedisStore({
  //   client: redis as any,
  //   prefix: 'rl:auth:',
  // }),
});

export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour
  message: 'Submission rate limit exceeded.',
  // store: new RedisStore({
  //   client: redis as any,
  //   prefix: 'rl:submit:',
  // }),
});

