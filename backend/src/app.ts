import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
// Database config is imported via prisma client
import { securityMiddleware } from './middleware/security.middleware';
import authRoutes from './routes/auth.routes';
import hackathonRoutes from './routes/hackathon.routes';
import projectRoutes from './routes/project.routes';
import grantRoutes from './routes/grant.routes';
import networkingRoutes from './routes/networking.routes';
import organizerRoutes from './routes/organizer.routes';
import feedbackRoutes from './routes/feedback.routes';
import gamificationRoutes from './routes/gamification.routes';
import teamMatchingRoutes from './routes/teamMatching.routes';
import { WebSocketService } from './services/websocket.service';
import { setWebSocketService } from './controllers/teamMatching.controller';

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(securityMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/networking', networkingRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/team-matching', teamMatchingRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

// Initialize WebSocket service
const wsService = new WebSocketService(httpServer);

// Inject wsService into team matching controller
setWebSocketService(wsService);

httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.log(`WebSocket Server initialized`);
});

export { app, httpServer, wsService };

