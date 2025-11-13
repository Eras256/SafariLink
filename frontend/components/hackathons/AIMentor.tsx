'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Bot,
  Globe,
  Code,
  BookOpen,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocale, setLocale, type Locale, supportedLocales } from '@/lib/i18n/locales';
import { useAccount } from 'wagmi';

interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeExamples?: CodeExample[];
  resources?: Resource[];
  relatedQuestions?: string[];
  timestamp: Date;
}

interface CodeExample {
  language: string;
  code: string;
  description?: string;
}

interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'library' | 'video';
}

interface AIMentorProps {
  hackathonId: string;
  userId?: string;
  context?: {
    hackathonName?: string;
    chains?: string[];
    techStack?: string[];
  };
}

export function AIMentor({ hackathonId, userId, context }: AIMentorProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(getCurrentLocale());
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Welcome message
  useEffect(() => {
    const welcomeMessages: Record<Locale, string> = {
      en: "Hello! I'm your AI Mentor. I can help you with Web3 development, smart contracts, and hackathon questions. Ask me anything!",
      sw: "Hujambo! Mimi ni Mentor wako wa AI. Ninaweza kukusaidia na maendeleo ya Web3, kandarasi za akili, na maswali ya hackathon. Niulize kitu chochote!",
      fr: "Bonjour! Je suis votre Mentor IA. Je peux vous aider avec le développement Web3, les contrats intelligents et les questions de hackathon. Posez-moi n'importe quelle question!",
    };

    // Update welcome message if language changes and it's the only message
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessages[selectedLanguage],
          timestamp: new Date(),
        },
      ]);
    } else if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessages[selectedLanguage],
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedLanguage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: MentorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Usar endpoint local de Next.js en producción, o servicio externo en desarrollo
      const apiUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL && process.env.NEXT_PUBLIC_AI_SERVICE_URL !== 'http://localhost:8000'
        ? process.env.NEXT_PUBLIC_AI_SERVICE_URL
        : '/api'; // Usar endpoint local de Next.js
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`${apiUrl}/ask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: inputMessage,
            language: selectedLanguage,
            context: {
              hackathonId,
              hackathonName: context?.hackathonName || 'ETH Safari 2025',
              chains: context?.chains || [],
              techStack: context?.techStack || [],
            },
            conversationHistory: messages.slice(-5).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Check if it's a server error (500+) or client error (400-499)
          if (response.status >= 500) {
            throw new Error(`Server error: ${response.status} - The AI service is experiencing issues.`);
          } else if (response.status === 404) {
            throw new Error(`Not found: ${response.status} - The AI service endpoint was not found.`);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();

        // Parse the response to extract code examples
        const codeExamples = extractCodeExamples(data.answer);
        const resources = data.suggestedResources || [];
        const relatedQuestions = data.relatedQuestions || [];

        // Remove code blocks from the answer content (they're shown separately)
        let answerContent = data.answer;
        codeExamples.forEach(() => {
          answerContent = answerContent.replace(/```[\w]*\n[\s\S]*?```/g, '');
        });
        answerContent = answerContent.trim();

        const assistantMessage: MentorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: answerContent || data.answer, // Use cleaned content or fallback to original
          codeExamples,
          resources,
          relatedQuestions,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        
        // Determine error type and show appropriate message
        let errorMessage: string;
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            // Timeout error
            errorMessage = selectedLanguage === 'sw' 
              ? 'Ombi limesita muda mrefu. Tafadhali jaribu tena.'
              : selectedLanguage === 'fr'
              ? 'La requête a pris trop de temps. Veuillez réessayer.'
              : 'The request took too long. Please try again.';
          } else if (fetchError.message.includes('500') || fetchError.message.includes('Internal Server Error')) {
            // Server error
            errorMessage = selectedLanguage === 'sw'
              ? 'Huduma ya AI haipatikani kwa sasa. Tafadhali jaribu tena baadaye.'
              : selectedLanguage === 'fr'
              ? 'Le service IA n\'est pas disponible pour le moment. Veuillez réessayer plus tard.'
              : 'The AI service is currently unavailable. Please try again later.';
          } else if (
            fetchError.message.includes('Failed to fetch') || 
            fetchError.message.includes('NetworkError') ||
            fetchError.message.includes('ERR_CONNECTION_REFUSED') ||
            fetchError.message.includes('ERR_FAILED')
          ) {
            // Network error - service not running or connection refused
            errorMessage = selectedLanguage === 'sw'
              ? 'Huduma ya AI haipatikani. Tafadhali hakikisha huduma inaendesha na jaribu tena.'
              : selectedLanguage === 'fr'
              ? 'Le service IA n\'est pas disponible. Veuillez vérifier que le service est en cours d\'exécution et réessayer.'
              : 'The AI service is not available. Please ensure the service is running on port 8000 and try again.';
          } else {
            // Generic error
            errorMessage = selectedLanguage === 'sw'
              ? 'Kuna hitilafu katika kuwasiliana na huduma ya AI. Tafadhali jaribu tena.'
              : selectedLanguage === 'fr'
              ? 'Une erreur s\'est produite lors de la communication avec le service IA. Veuillez réessayer.'
              : 'An error occurred while communicating with the AI service. Please try again.';
          }
        } else {
          // Unknown error
          errorMessage = selectedLanguage === 'sw'
            ? 'Kuna hitilafu. Tafadhali jaribu tena.'
            : selectedLanguage === 'fr'
            ? 'Une erreur s\'est produite. Veuillez réessayer.'
            : 'An error occurred. Please try again.';
        }

        const assistantMessage: MentorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMessage,
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

  const extractCodeExamples = (text: string): CodeExample[] => {
    const codeExamples: CodeExample[] = [];
    
    // Match code blocks with language identifier
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1] || 'solidity';
      const code = match[2].trim();
      
      codeExamples.push({
        language,
        code,
      });
    }
    
    return codeExamples;
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleLanguageChange = (lang: Locale) => {
    setSelectedLanguage(lang);
    setLocale(lang);
  };

  const handleRelatedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full h-full flex flex-col glassmorphic rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Mentor</h3>
            <p className="text-white/60 text-xs">24/7 Multilingual Assistant</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-white/60" />
          <div className="flex gap-1 glassmorphic p-1 rounded-lg">
            {supportedLocales.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500/20 text-white'
                    : 'glassmorphic text-white/90'
                }`}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>

                {/* Code Examples */}
                {message.codeExamples && message.codeExamples.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.codeExamples.map((example, idx) => {
                      const codeId = `${message.id}-code-${idx}`;
                      return (
                        <div key={idx} className="relative group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4 text-blue-400" />
                              <span className="text-xs text-white/60 font-mono">
                                {example.language}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(example.code, codeId)}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              {copiedCodeId === codeId ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {example.description && (
                            <p className="text-xs text-white/60 mb-2">{example.description}</p>
                          )}
                          <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-xs font-mono">
                            <code className={`language-${example.language}`}>{example.code}</code>
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Resources */}
                {message.resources && message.resources.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/60 font-semibold">Resources</span>
                    </div>
                    <div className="space-y-1">
                      {message.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        >
                          • {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Questions */}
                {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-white/60 font-semibold">Related Questions</span>
                    </div>
                    <div className="space-y-1">
                      {message.relatedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRelatedQuestion(question)}
                          className="block w-full text-left text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                        >
                          <HelpCircle className="w-3 h-3 inline mr-1" />
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
            <div className="glassmorphic rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-white/60 text-sm">AI Mentor is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
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
              placeholder={
                selectedLanguage === 'sw'
                  ? 'Niulize swali...'
                  : selectedLanguage === 'fr'
                  ? 'Posez votre question...'
                  : 'Ask your question...'
              }
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="glassmorphic-button h-11 px-6"
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
          <span>
            {selectedLanguage === 'sw'
              ? 'Tumia Enter ili kutuma, Shift+Enter kwa mstari mpya'
              : selectedLanguage === 'fr'
              ? 'Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne'
              : 'Press Enter to send, Shift+Enter for new line'}
          </span>
        </div>
      </div>
    </div>
  );
}

