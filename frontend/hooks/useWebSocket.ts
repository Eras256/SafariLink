import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  roomId?: string;
  userId?: string;
  token?: string;
  enabled?: boolean;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  messageType: string;
  createdAt: Date;
  user: {
    id: string;
    username?: string;
    avatar?: string;
  };
}

export function useWebSocket({ roomId, userId, token, enabled = true }: UseWebSocketOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  // Connect to WebSocket server
  useEffect(() => {
    if (!enabled || !userId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const newSocket = io(apiUrl, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    // Message handlers
    newSocket.on('room:messages', (data: { messages: Message[] }) => {
      setMessages(data.messages);
    });

    newSocket.on('message:new', (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    newSocket.on('room:participants', (data: { participants: any[] }) => {
      setParticipants(data.participants);
    });

    newSocket.on('room:user-joined', (data: { userId: string; username?: string; avatar?: string }) => {
      setParticipants((prev) => {
        if (prev.find((p) => p.userId === data.userId)) return prev;
        return [...prev, { userId: data.userId, username: data.username, avatar: data.avatar }];
      });
    });

    newSocket.on('room:user-left', (data: { userId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));
    });

    newSocket.on('message:typing', (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [enabled, userId, token]);

  // Join room
  const joinRoom = useCallback(
    (roomId: string) => {
      if (!socket || !userId) return;

      socket.emit('room:join', { roomId, userId });
    },
    [socket, userId]
  );

  // Leave room
  const leaveRoom = useCallback(
    (roomId: string) => {
      if (!socket || !userId) return;

      socket.emit('room:leave', { roomId, userId });
      setMessages([]);
      setParticipants([]);
    },
    [socket, userId]
  );

  // Send message
  const sendMessage = useCallback(
    (content: string, messageType: string = 'TEXT') => {
      if (!socket || !roomId || !userId) return;

      socket.emit('message:send', {
        roomId,
        userId,
        content,
        messageType,
      });
    },
    [socket, roomId, userId]
  );

  // Typing indicator
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !roomId || !userId) return;

      socket.emit('message:typing', { roomId, userId, isTyping });
    },
    [socket, roomId, userId]
  );

  // Update participant state
  const updateParticipantState = useCallback(
    (videoEnabled?: boolean, audioEnabled?: boolean) => {
      if (!socket || !roomId || !userId) return;

      socket.emit('participant:update-state', {
        roomId,
        userId,
        videoEnabled,
        audioEnabled,
      });
    },
    [socket, roomId, userId]
  );

  return {
    socket,
    isConnected,
    messages,
    participants,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    setTyping,
    updateParticipantState,
  };
}

