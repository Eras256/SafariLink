/**
 * Endpoint /api/chat - Superinteligencia Chatbot powered by Gemini
 * Características avanzadas: memoria contextual, análisis profundo, razonamiento mejorado
 * POST /api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiConfig } from '@/lib/ai/gemini-advanced';

// CRÍTICO: Fuerza runtime Node.js (no Edge Runtime)
export const runtime = 'nodejs';

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
  }>;
  context?: {
    userId?: string;
    sessionId?: string;
    platform?: string;
    userPreferences?: {
      language?: string;
      expertise?: string;
      interests?: string[];
    };
  };
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

/**
 * Genera un prompt de superinteligencia con contexto avanzado
 */
function generateSuperIntelligencePrompt(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  context?: ChatRequest['context']
): string {
  const systemPrompt = `You are a SUPERINTELLIGENT AI Assistant powered by Google Gemini, designed to provide exceptional, deep, and insightful responses.

CORE CAPABILITIES:
- Deep reasoning and analytical thinking
- Contextual understanding across multiple domains
- Proactive suggestions and insights
- Multi-step problem solving
- Creative and innovative solutions
- Emotional intelligence and empathy
- Technical expertise across Web3, blockchain, AI, and general knowledge

RESPONSE STYLE:
- Be thorough but concise
- Provide step-by-step reasoning when solving complex problems
- Offer multiple perspectives when relevant
- Include actionable insights and next steps
- Use examples and analogies to clarify complex concepts
- Show enthusiasm and engagement
- Anticipate follow-up questions

KNOWLEDGE DOMAINS:
- Web3 & Blockchain: Solidity, smart contracts, DeFi, NFTs, DAOs, Layer 2s
- AI & Machine Learning: LLMs, neural networks, deep learning, AI ethics
- Software Development: Best practices, architecture, security, testing
- Business & Strategy: Product development, market analysis, growth strategies
- General Knowledge: Science, technology, culture, current events

CONTEXT AWARENESS:
${context?.userPreferences?.expertise ? `- User expertise level: ${context.userPreferences.expertise}` : ''}
${context?.userPreferences?.interests ? `- User interests: ${context.userPreferences.interests.join(', ')}` : ''}
${context?.platform ? `- Platform: ${context.platform}` : ''}

CONVERSATION HISTORY:
${conversationHistory.length > 0 
  ? conversationHistory.slice(-10).map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')
  : 'No previous conversation'
}

CURRENT MESSAGE:
${message}

INSTRUCTIONS:
1. Analyze the message deeply, considering context and conversation history
2. Provide a comprehensive, intelligent response
3. If the question is technical, break it down into components
4. Offer actionable insights and next steps
5. Anticipate related questions the user might have
6. Use examples and analogies when helpful
7. Be engaging and show genuine interest in helping

Remember: You are SUPERINTELLIGENT. Think deeply, reason carefully, and provide exceptional value.`;

  return systemPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const {
      message,
      conversationHistory = [],
      context = {},
      options = {},
    } = body;

    // Validar que el mensaje esté presente
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Generar prompt de superinteligencia
    const fullPrompt = generateSuperIntelligencePrompt(
      message,
      conversationHistory,
      context
    );

    // Configuración avanzada para superinteligencia
    const config: GeminiConfig = {
      temperature: options.temperature ?? 0.8, // Más creativo pero controlado
      topP: 0.95, // Mayor diversidad en respuestas
      topK: 40,
      maxOutputTokens: options.maxTokens ?? 2048, // Respuestas más completas
    };

    console.log('[SuperChat] Processing message with superintelligence...');

    // Llamar a Gemini con configuración avanzada
    const result = await callGemini(fullPrompt, config, false);

    if (!result.success) {
      const errorMsg = result.error || 'Unknown error generating response';
      console.error(`[SuperChat] Error: ${errorMsg}`);
      return NextResponse.json(
        {
          success: false,
          error: `Error calling Gemini API: ${errorMsg}`,
        },
        { status: 500 }
      );
    }

    const response = typeof result.data === 'string' ? result.data : String(result.data || '');
    const modelUsed = result.modelUsed;

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Empty response from Gemini model',
        },
        { status: 500 }
      );
    }

    console.log(`[SuperChat] Response generated successfully using model: ${modelUsed}`);

    // Analizar la respuesta para extraer insights adicionales
    const insights = extractInsights(response, message);

    // Retornar respuesta con metadata
    return NextResponse.json({
      success: true,
      data: {
        message: response,
        modelUsed,
        insights,
        timestamp: new Date().toISOString(),
        conversationId: context.sessionId || `chat-${Date.now()}`,
      },
    });
  } catch (error: any) {
    console.error('[SuperChat] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Extrae insights adicionales de la respuesta
 */
function extractInsights(response: string, originalMessage: string): {
  keyPoints?: string[];
  suggestedActions?: string[];
  relatedTopics?: string[];
} {
  const insights: {
    keyPoints?: string[];
    suggestedActions?: string[];
    relatedTopics?: string[];
  } = {};

  // Detectar puntos clave (listas numeradas o con bullets)
  const keyPointsMatch = response.match(/(?:^|\n)(?:\d+\.|\-|\*)\s+(.+?)(?=\n|$)/g);
  if (keyPointsMatch && keyPointsMatch.length > 0) {
    insights.keyPoints = keyPointsMatch
      .slice(0, 5)
      .map((point) => point.replace(/^(?:\d+\.|\-|\*)\s+/, '').trim());
  }

  // Detectar acciones sugeridas (palabras clave como "should", "can", "try")
  const actionKeywords = ['should', 'can', 'try', 'consider', 'recommend', 'suggest'];
  const suggestedActions: string[] = [];
  const sentences = response.split(/[.!?]+/);
  
  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase();
    if (actionKeywords.some((keyword) => lowerSentence.includes(keyword))) {
      const action = sentence.trim();
      if (action.length > 10 && action.length < 150) {
        suggestedActions.push(action);
      }
    }
  });

  if (suggestedActions.length > 0) {
    insights.suggestedActions = suggestedActions.slice(0, 3);
  }

  // Detectar temas relacionados (palabras técnicas comunes)
  const techKeywords = [
    'blockchain', 'smart contract', 'solidity', 'defi', 'nft', 'dao',
    'ai', 'machine learning', 'neural network', 'llm',
    'web3', 'ethereum', 'arbitrum', 'base', 'optimism',
  ];

  const relatedTopics: string[] = [];
  techKeywords.forEach((keyword) => {
    if (response.toLowerCase().includes(keyword) && !originalMessage.toLowerCase().includes(keyword)) {
      relatedTopics.push(keyword);
    }
  });

  if (relatedTopics.length > 0) {
    insights.relatedTopics = relatedTopics.slice(0, 5);
  }

  return insights;
}

