'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Brain,
  Zap,
  Lightbulb,
  TrendingUp,
  X,
  Minimize2,
  Maximize2,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: {
    keyPoints?: string[];
    suggestedActions?: string[];
    relatedTopics?: string[];
  };
  modelUsed?: string;
}

interface SuperChatBotProps {
  className?: string;
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

// Inner component that uses wagmi hooks - must be inside WagmiProvider
function SuperChatBotInner({
  className = '',
  defaultOpen = false,
  position = 'bottom-right',
}: SuperChatBotProps) {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `👋 Hello! I'm your Superintelligent AI Assistant powered by Google Gemini.

I can help you with:
🧠 Deep analysis and reasoning
💡 Creative problem solving
🔧 Technical guidance (Web3, AI, Development)
📊 Strategic insights
🌍 General knowledge and current events

What would you like to explore today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45000); // 45 second timeout

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationHistory: messages.slice(-10).map((msg) => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp.toISOString(),
            })),
            context: {
              userId: address,
              sessionId,
              platform: 'SafariLink',
              userPreferences: {
                language: 'en',
                expertise: 'intermediate',
              },
            },
            options: {
              temperature: 0.8,
              maxTokens: 2048,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to get response');
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
          insights: data.data.insights,
          modelUsed: data.data.modelUsed,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);

        let errorMessage = 'An error occurred while communicating with the AI. Please try again.';

        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            errorMessage = 'The request took too long. Please try again with a shorter question.';
          } else {
            errorMessage = fetchError.message;
          }
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ ${errorMessage}`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Chat Button (when minimized or closed) */}
      {(!isOpen || isMinimized) && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer"
        >
          <MessageCircle className="w-7 h-7" />
          {messages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {messages.length - 1}
            </span>
          )}
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Super AI
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <p className="text-white/60 text-xs">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-900/50 to-transparent">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500/20 text-white'
                          : 'bg-white/5 text-white/90 backdrop-blur-sm'
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>

                      {/* Insights */}
                      {message.insights && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                          {message.insights.keyPoints && message.insights.keyPoints.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs text-white/60 font-semibold">Key Points</span>
                              </div>
                              <ul className="space-y-1">
                                {message.insights.keyPoints.map((point, idx) => (
                                  <li key={idx} className="text-xs text-white/70 pl-4">
                                    • {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.insights.suggestedActions && message.insights.suggestedActions.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-white/60 font-semibold">Suggested Actions</span>
                              </div>
                              <ul className="space-y-1">
                                {message.insights.suggestedActions.map((action, idx) => (
                                  <li key={idx} className="text-xs text-white/70 pl-4">
                                    → {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.insights.relatedTopics && message.insights.relatedTopics.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-white/60 font-semibold">Related Topics</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {message.insights.relatedTopics.map((topic, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Model Used */}
                      {message.modelUsed && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <span className="text-xs text-white/40">
                            Model: {message.modelUsed}
                          </span>
                        </div>
                      )}

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyMessage(message.content, message.id)}
                        className="mt-2 text-white/40 hover:text-white transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      <div className="text-xs text-white/40 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {address ? address.slice(0, 2).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-white/60 text-sm">Super AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-gray-900/50">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask anything... (Shift+Enter for new line)"
                    rows={1}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 h-11 px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                <Sparkles className="w-3 h-3" />
                <span>Superintelligence powered by Gemini AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper component that waits for mount and WagmiProvider to be available
export function SuperChatBot({
  className = '',
  defaultOpen = false,
  position = 'bottom-right',
}: SuperChatBotProps) {
  const [mounted, setMounted] = useState(false);
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    // Only render after component is mounted on client
    // This ensures the provider is available
    setMounted(true);
    
    // Wait a bit more to ensure provider is mounted
    // This is necessary during hydration
    const timer = setTimeout(() => {
      setProviderReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // On server or before mount, don't render (or render a minimal version)
  if (!mounted || !providerReady) {
    return null;
  }

  // Render the inner component that uses wagmi hooks
  // The provider must be available at this point
  return (
    <SuperChatBotInner
      className={className}
      defaultOpen={defaultOpen}
      position={position}
    />
  );
}



