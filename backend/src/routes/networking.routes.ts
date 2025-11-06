import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  getMessages,
  createBreakout,
  updateParticipantState,
} from '../controllers/networking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/rooms', getRooms);
router.get('/rooms/:roomId', getRoom);
router.get('/rooms/:roomId/messages', getMessages);

// Protected routes
router.post('/rooms', authMiddleware, createRoom);
router.post('/rooms/:roomId/join', authMiddleware, joinRoom);
router.post('/rooms/:roomId/leave', authMiddleware, leaveRoom);
router.post('/rooms/:roomId/breakout', authMiddleware, createBreakout);
router.patch('/rooms/:roomId/participant', authMiddleware, updateParticipantState);

export default router;

