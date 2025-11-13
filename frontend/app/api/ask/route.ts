/**
 * Endpoint /api/ask - Compatible con el servicio externo mentor_bot
 * Usa Gemini directamente desde Next.js (server-side)
 * POST /api/ask
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiConfig } from '@/lib/ai/gemini-advanced';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { generateResources } from '@/lib/ai/resources';
import { generateRelatedQuestions } from '@/lib/ai/related-questions';

// CRÍTICO: Fuerza runtime Node.js (no Edge Runtime)
export const runtime = 'nodejs';

interface AskRequest {
  question: string;
  language?: string;
  context?: {
    hackathonId?: string;
    hackathonName?: string;
    chains?: string[];
    techStack?: string[];
  };
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AskRequest = await request.json();
    const { question, context = {}, conversationHistory = [], language = 'en' } = body;

    // Validar que el prompt esté presente
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        {
          error: 'Question is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Build context string
    let contextStr = '';
    if (context && Object.keys(context).length > 0) {
      contextStr = '\n\nContext:\n';
      contextStr += `- Hackathon: ${context.hackathonName || 'N/A'}\n`;
      contextStr += `- Chains: ${(context.chains || []).join(', ')}\n`;
      contextStr += `- User's tech stack: ${(context.techStack || []).join(', ')}\n`;
    }

    // Determine language
    const lang = language || 'en';
    
    // Get system prompt (necesitamos crear esta función)
    const systemPrompt = getSystemPrompt(lang);

    // Add language instruction to question if needed
    let questionWithLang = question;
    if (lang !== 'en') {
      questionWithLang = `Please respond in ${lang}. ${question}`;
    }

    // Build prompt for Gemini
    let fullPrompt = `${systemPrompt}\n\n${questionWithLang}${contextStr}`;

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      let conversationText = '';
      for (const msg of conversationHistory.slice(-5)) {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationText += `${role}: ${msg.content}\n`;
      }
      if (conversationText) {
        fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nCurrent Question:\n${questionWithLang}${contextStr}`;
      }
    }

    // Configure generation with optimized parameters
    const config: GeminiConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1500,
    };

    // Generate response using Gemini
    const result = await callGemini(fullPrompt, config, false);

    if (!result.success) {
      const errorMsg = result.error || 'Unknown error generating response';
      console.error(`[API /ask] Error generating response: ${errorMsg}`);
      return NextResponse.json(
        {
          error: `Error calling Gemini API: ${errorMsg}`,
        },
        { status: 500 }
      );
    }

    const answer = typeof result.data === 'string' ? result.data : String(result.data || '');
    const modelUsed = result.modelUsed;

    if (!answer || answer.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Empty response from Gemini model',
        },
        { status: 500 }
      );
    }

    console.log(`[API /ask] Response generated successfully using model: ${modelUsed}`);

    // Generate suggested resources based on question
    const resources = generateResources(question, context);

    // Generate related questions
    const related = generateRelatedQuestions(question, lang);

    // Return response compatible with mentor_bot service
    return NextResponse.json({
      answer,
      suggestedResources: resources,
      relatedQuestions: related,
      language: lang,
      modelUsed,
    });
  } catch (error: any) {
    console.error('[API /ask] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

