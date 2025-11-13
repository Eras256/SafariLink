import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '@/lib/api/config';

interface Feedback {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  rating?: number | null;
  feedbackType: 'COMMENT' | 'SUGGESTION' | 'PRAISE' | 'WARNING' | 'QUESTION';
  userRole: 'PARTICIPANT' | 'MENTOR' | 'JUDGE' | 'ORGANIZER';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username?: string | null;
    avatar?: string | null;
    walletAddress: string;
  };
  project: {
    id: string;
    name: string;
    hackathonId: string;
  };
}

interface UseRealtimeFeedbackOptions {
  projectId?: string;
  userId?: string;
  token?: string;
  enabled?: boolean;
}

interface FeedbackNotification {
  type: string;
  projectId: string;
  projectName: string;
  feedback: Feedback;
  message: string;
}

export function useRealtimeFeedback({
  projectId,
  userId,
  token,
  enabled = true,
}: UseRealtimeFeedbackOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<FeedbackNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Connect to WebSocket server
  useEffect(() => {
    if (!enabled || !projectId) return; // Allow connection without userId for read-only mode

    const apiUrl = getApiUrl();
    const newSocket = io(apiUrl, {
      auth: {
        ...(token && { token }),
        ...(userId && { userId }),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Feedback WebSocket connected');
      setIsConnected(true);
      setError(null);

      // Subscribe to feedback for this project (userId is optional for read-only)
      newSocket.emit('feedback:subscribe', { projectId, userId: userId || undefined });
    });

    newSocket.on('disconnect', () => {
      console.log('Feedback WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (error: any) => {
      console.error('Feedback WebSocket error:', error);
      setError(error.message || 'Connection error');
    });

    // Feedback handlers
    newSocket.on('feedback:list', (data: { feedback: Feedback[] }) => {
      setFeedback(data.feedback.reverse()); // Reverse to show oldest first
      setLoading(false);
    });

    newSocket.on('feedback:new', (data: { feedback: Feedback }) => {
      setFeedback((prev) => [...prev, data.feedback]);
      
      // Show browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nuevo Feedback', {
          body: `${data.feedback.user.username || 'Alguien'} dejó feedback en el proyecto`,
          icon: data.feedback.user.avatar || undefined,
        });
      }
    });

    newSocket.on('feedback:notification', (data: FeedbackNotification) => {
      setNotifications((prev) => [data, ...prev.slice(0, 9)]); // Keep last 10
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Notificación de Feedback', {
          body: data.message,
          icon: data.feedback.user.avatar || undefined,
        });
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    setLoading(true);

    return () => {
      if (projectId) {
        newSocket.emit('feedback:unsubscribe', { projectId });
      }
      newSocket.close();
      socketRef.current = null;
    };
  }, [enabled, userId, projectId, token]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  // Create feedback
  const createFeedback = useCallback(
    (data: {
      content: string;
      rating?: number;
      feedbackType?: string;
      userRole?: string;
      isPublic?: boolean;
    }) => {
      if (!socket || !projectId || !userId) {
        throw new Error('Socket not connected or missing required data');
      }

      socket.emit('feedback:create', {
        projectId,
        userId,
        ...data,
      });
    },
    [socket, projectId, userId]
  );

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove notification
  const removeNotification = useCallback((index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    socket,
    isConnected,
    feedback,
    notifications,
    loading,
    error,
    createFeedback,
    clearNotifications,
    removeNotification,
    requestNotificationPermission,
  };
}

