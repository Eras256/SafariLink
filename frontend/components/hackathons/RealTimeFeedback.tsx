'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackMessage {
  id: string;
  from: string;
  fromRole: 'mentor' | 'judge' | 'participant';
  message: string;
  rating?: number;
  type: 'comment' | 'suggestion' | 'praise' | 'warning';
  timestamp: Date;
  projectId?: string;
}

interface RealTimeFeedbackProps {
  hackathonId: string;
  projectId?: string;
  userId?: string;
  userRole?: 'mentor' | 'judge' | 'participant';
}

export function RealTimeFeedback({
  hackathonId,
  projectId,
  userId,
  userRole = 'participant',
}: RealTimeFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'comment' | 'suggestion' | 'praise' | 'warning'>('comment');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock initial feedbacks - in production, fetch from WebSocket/API
    setFeedbacks([
      {
        id: '1',
        from: 'Mentor Sarah',
        fromRole: 'mentor',
        message: 'Great progress on the smart contract! Consider adding reentrancy guards for better security.',
        type: 'suggestion',
        rating: 4,
        timestamp: new Date(Date.now() - 3600000),
        projectId: projectId,
      },
      {
        id: '2',
        from: 'Judge Mike',
        fromRole: 'judge',
        message: 'The UI design is clean and intuitive. Well done!',
        type: 'praise',
        rating: 5,
        timestamp: new Date(Date.now() - 1800000),
        projectId: projectId,
      },
    ]);

    // In production: Connect to WebSocket for real-time feedback
    // const ws = new WebSocket(`wss://api.safarilink.xyz/feedback/${hackathonId}`);
    // ws.onmessage = (event) => {
    //   const feedback = JSON.parse(event.data);
    //   setFeedbacks((prev) => [...prev, feedback]);
    // };
    // return () => ws.close();
  }, [hackathonId, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feedbacks]);

  const handleSendFeedback = () => {
    if (!newFeedback.trim()) return;

    const feedback: FeedbackMessage = {
      id: Date.now().toString(),
      from: userId || 'You',
      fromRole: userRole,
      message: newFeedback,
      rating: rating || undefined,
      type: feedbackType,
      timestamp: new Date(),
      projectId: projectId,
    };

    setFeedbacks([...feedbacks, feedback]);
    setNewFeedback('');
    setRating(null);
    setFeedbackType('comment');

    // In production: Send via WebSocket
    // ws.send(JSON.stringify(feedback));
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'praise':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'suggestion':
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'praise':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-red-500/30 bg-red-500/10';
      case 'suggestion':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'mentor':
        return 'text-purple-400';
      case 'judge':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Feedback Header */}
      <div className="flex items-center justify-between p-4 glassmorphic border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Real-time Feedback</h3>
        </div>
        <div className="text-white/60 text-sm">
          {feedbacks.length} {feedbacks.length === 1 ? 'message' : 'messages'}
        </div>
      </div>

      {/* Feedback Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glassmorphic p-4 rounded-lg border ${getFeedbackColor(feedback.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getFeedbackIcon(feedback.type)}
                  <span className={`font-semibold ${getRoleColor(feedback.fromRole)}`}>
                    {feedback.from}
                  </span>
                  <span className="text-white/40 text-xs">
                    {feedback.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {feedback.rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating!
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-white/80 text-sm">{feedback.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {feedbacks.length === 0 && (
          <div className="text-center text-white/50 py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No feedback yet. Be the first to share your thoughts!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Feedback Input */}
      <div className="glassmorphic border-t border-white/10 p-4 space-y-3">
        {/* Feedback Type Selector */}
        <div className="flex items-center gap-2">
          {(['comment', 'suggestion', 'praise', 'warning'] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={feedbackType === type ? 'default' : 'outline'}
              onClick={() => setFeedbackType(type)}
              className="text-xs capitalize"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Rating (for mentors/judges) */}
        {(userRole === 'mentor' || userRole === 'judge') && (
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Rating:</span>
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
                Clear
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
              userRole === 'mentor' || userRole === 'judge'
                ? 'Provide feedback...'
                : 'Ask a question or share feedback...'
            }
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSendFeedback} className="glassmorphic-button">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

