'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealtimeFeedback } from '@/hooks/useRealtimeFeedback';
import { format } from 'date-fns';

interface RealTimeFeedbackProps {
  hackathonId: string;
  projectId: string;
  userId?: string;
  userRole?: 'PARTICIPANT' | 'MENTOR' | 'JUDGE' | 'ORGANIZER';
  token?: string;
}

export function RealTimeFeedback({
  hackathonId,
  projectId,
  userId,
  userRole = 'PARTICIPANT',
  token,
}: RealTimeFeedbackProps) {
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'COMMENT' | 'SUGGESTION' | 'PRAISE' | 'WARNING' | 'QUESTION'>('COMMENT');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    feedback,
    notifications,
    loading,
    error,
    createFeedback,
    requestNotificationPermission,
    clearNotifications,
  } = useRealtimeFeedback({
    projectId,
    userId,
    token,
    enabled: !!projectId && !!userId,
  });

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission === 'default') {
        requestNotificationPermission().then(() => {
          if (Notification.permission === 'granted') {
            setNotificationsEnabled(true);
          }
        });
      }
    }
  }, [requestNotificationPermission]);

  // Auto-scroll to bottom when new feedback arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feedback]);

  const handleSendFeedback = () => {
    if (!newFeedback.trim() || !userId) return;

    try {
      createFeedback({
        content: newFeedback.trim(),
        rating: rating || undefined,
        feedbackType,
        userRole,
        isPublic: true,
      });

      setNewFeedback('');
      setRating(null);
      setFeedbackType('COMMENT');
    } catch (error: any) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'PRAISE':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'WARNING':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'SUGGESTION':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'QUESTION':
        return <HelpCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'PRAISE':
        return 'border-green-500/30 bg-green-500/10';
      case 'WARNING':
        return 'border-red-500/30 bg-red-500/10';
      case 'SUGGESTION':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'QUESTION':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MENTOR':
        return 'text-purple-400';
      case 'JUDGE':
        return 'text-yellow-400';
      case 'ORGANIZER':
        return 'text-orange-400';
      default:
        return 'text-blue-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'MENTOR':
        return 'Mentor';
      case 'JUDGE':
        return 'Juez';
      case 'ORGANIZER':
        return 'Organizador';
      default:
        return 'Participante';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Feedback Header */}
      <div className="flex items-center justify-between p-4 glassmorphic border-b border-white/10">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Feedback en Tiempo Real</h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs">Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs">Desconectado</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {notifications.length}
              </span>
            </div>
          )}
          {!notificationsEnabled && 'Notification' in window && (
            <button
              onClick={handleEnableNotifications}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Habilitar notificaciones"
            >
              <BellOff className="w-4 h-4 text-white/60" />
            </button>
          )}
          <div className="text-white/60 text-sm">
            {feedback.length} {feedback.length === 1 ? 'mensaje' : 'mensajes'}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="p-2 bg-blue-500/10 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-blue-400 text-sm font-medium">
              {notifications.length} nueva{notifications.length > 1 ? 's' : ''} notificación{notifications.length > 1 ? 'es' : ''}
            </span>
            <button
              onClick={clearNotifications}
              className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && feedback.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60">Cargando feedback...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400">Error: {error}</div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {feedback.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`glassmorphic p-4 rounded-lg border ${getFeedbackColor(item.feedbackType)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {getFeedbackIcon(item.feedbackType)}
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getRoleColor(item.userRole)}`}>
                          {item.user.username || item.user.walletAddress.slice(0, 6) + '...'}
                        </span>
                        <span className="text-white/40 text-xs">
                          ({getRoleLabel(item.userRole)})
                        </span>
                      </div>
                      <span className="text-white/40 text-xs">
                        {format(new Date(item.createdAt), 'HH:mm')}
                      </span>
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating!
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 text-sm">{item.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {feedback.length === 0 && (
              <div className="text-center text-white/50 py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No hay feedback aún. ¡Sé el primero en compartir tus pensamientos!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Feedback Input */}
      {userId && (
        <div className="glassmorphic border-t border-white/10 p-4 space-y-3">
          {/* Feedback Type Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['COMMENT', 'SUGGESTION', 'PRAISE', 'WARNING', 'QUESTION'] as const).map((type) => (
              <Button
                key={type}
                size="sm"
                variant={feedbackType === type ? 'default' : 'outline'}
                onClick={() => setFeedbackType(type)}
                className="text-xs capitalize"
              >
                {type === 'COMMENT' && 'Comentario'}
                {type === 'SUGGESTION' && 'Sugerencia'}
                {type === 'PRAISE' && 'Elogio'}
                {type === 'WARNING' && 'Advertencia'}
                {type === 'QUESTION' && 'Pregunta'}
              </Button>
            ))}
          </div>

          {/* Rating (for mentors/judges) */}
          {(userRole === 'MENTOR' || userRole === 'JUDGE') && (
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Calificación:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      rating !== null && i < rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/30 hover:text-yellow-400'
                    }`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
              {rating && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRating(null)}
                  className="text-xs text-white/60"
                >
                  Limpiar
                </Button>
              )}
            </div>
          )}

          {/* Message Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendFeedback()}
              placeholder={
                userRole === 'MENTOR' || userRole === 'JUDGE'
                  ? 'Proporciona feedback...'
                  : 'Haz una pregunta o comparte feedback...'
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <Button 
              onClick={handleSendFeedback} 
              className="glassmorphic-button"
              disabled={!isConnected || !newFeedback.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {!userId && (
        <div className="glassmorphic border-t border-white/10 p-4 text-center text-white/60 text-sm">
          Conecta tu wallet para dejar feedback
        </div>
      )}
    </div>
  );
}
