/**
 * Endpoint /api/chat - Superintelligence Chatbot powered by Gemini
 * Advanced features: contextual memory, deep analysis, enhanced reasoning
 * POST /api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiConfig } from '@/lib/ai/gemini-advanced';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
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
 * Generates a superintelligence prompt with advanced context
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

    // Validate that message is present
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Generate superintelligence prompt
    const fullPrompt = generateSuperIntelligencePrompt(
      message,
      conversationHistory,
      context
    );

    // Advanced configuration for superintelligence
    const config: GeminiConfig = {
      temperature: options.temperature ?? 0.8, // More creative but controlled
      topP: 0.95, // Greater diversity in responses
      topK: 40,
      maxOutputTokens: options.maxTokens ?? 2048, // More complete responses
    };

    console.log('[SuperChat] Processing message with superintelligence...');

    // Call Gemini with advanced configuration
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

    // Analyze response to extract additional insights
    const insights = extractInsights(response, message);

    // Return response with metadata
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
 * Extracts additional insights from the response
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

  // Detect key points (numbered lists or bullets)
  const keyPointsMatch = response.match(/(?:^|\n)(?:\d+\.|\-|\*)\s+(.+?)(?=\n|$)/g);
  if (keyPointsMatch && keyPointsMatch.length > 0) {
    insights.keyPoints = keyPointsMatch
      .slice(0, 5)
      .map((point) => point.replace(/^(?:\d+\.|\-|\*)\s+/, '').trim());
  }

  // Detect suggested actions (keywords like "should", "can", "try")
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

  // Detect related topics (common technical keywords)
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

