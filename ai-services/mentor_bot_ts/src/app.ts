/**
 * Servidor Express para SafariLink AI Mentor Bot
 * Migrado desde Python FastAPI a Node.js/TypeScript
 * Misma funcionalidad, sintaxis TypeScript
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { callGemini, testGeminiConnection, GeminiConfig } from './lib/gemini-advanced';
import { getSystemPrompt } from './utils/prompts';
import { generateResources } from './utils/resources';
import { generateRelatedQuestions } from './utils/related-questions';

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    '*', // En producción, especificar dominios exactos
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));

// Interfaces
interface MentorRequest {
  question: string;
  context?: {
    hackathonName?: string;
    chains?: string[];
    techStack?: string[];
  };
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>;
  language?: string;
}

interface MentorResponse {
  answer: string;
  suggestedResources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  relatedQuestions: string[];
  language: string;
  modelUsed?: string;
}

interface TestGeminiResponse {
  success: boolean;
  message: string;
  modelUsed?: string;
  error?: string;
}

// Verificar que Gemini esté configurado
let geminiConfigured = false;
if (process.env.GEMINI_API_KEY) {
  geminiConfigured = true;
  console.log('[Mentor Bot] Cliente Gemini inicializado correctamente');
} else {
  console.error('[Mentor Bot] GEMINI_API_KEY no está configurada');
}

/**
 * POST /ask
 * Ask the AI mentor a question
 */
app.post('/ask', async (req: Request<{}, MentorResponse, MentorRequest>, res: Response<MentorResponse | { error: string }>, next: NextFunction) => {
  try {
    const { question, context = {}, conversationHistory = [], language = 'en' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required and must be a string' } as any);
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

    // Call Gemini using the advanced helper
    if (!geminiConfigured) {
      return res.status(500).json({
        error: 'Gemini client not initialized. Check GEMINI_API_KEY environment variable.',
      } as any);
    }

    // Configure generation with optimized parameters
    const config: GeminiConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1500,
    };

    // Generate response using the helper
    const result = await callGemini(fullPrompt, config, false);

    if (!result.success) {
      const errorMsg = result.error || 'Unknown error generating response';
      console.error(`[Mentor Bot] Error generating response: ${errorMsg}`);
      return res.status(500).json({
        error: `Error calling Gemini API: ${errorMsg}`,
      } as any);
    }

    const answer = typeof result.data === 'string' ? result.data : String(result.data || '');
    const modelUsed = result.modelUsed;

    if (!answer || answer.trim().length === 0) {
      return res.status(500).json({
        error: 'Empty response from Gemini model',
      } as any);
    }

    console.log(`[Mentor Bot] Response generated successfully using model: ${modelUsed}`);

    // Generate suggested resources based on question
    const resources = generateResources(question, context);

    // Generate related questions
    const related = generateRelatedQuestions(question, lang);

    const response: MentorResponse = {
      answer,
      suggestedResources: resources,
      relatedQuestions: related,
      language: lang,
      modelUsed,
    };

    return res.json(response);
  } catch (error: any) {
    console.error('[Mentor Bot] Error in /ask:', error);
    console.error('[Mentor Bot] Error stack:', error.stack);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } as any);
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'mentor-bot',
    gemini_configured: geminiConfigured,
  });
});

/**
 * GET /test-gemini
 * Test endpoint to validate Gemini AI connectivity
 */
app.get('/test-gemini', async (req: Request, res: Response<TestGeminiResponse>) => {
  if (!geminiConfigured) {
    return res.json({
      success: false,
      message: 'Cliente Gemini no inicializado',
      error: 'GEMINI_API_KEY no está configurada o es inválida',
    });
  }

  try {
    const result = await testGeminiConnection();

    if (result.success) {
      return res.json({
        success: true,
        message: 'Conexión con Gemini AI exitosa',
        modelUsed: result.modelUsed,
        error: undefined,
      });
    } else {
      return res.json({
        success: false,
        message: 'Error al conectar con Gemini AI',
        modelUsed: undefined,
        error: result.error || 'Unknown error',
      });
    }
  } catch (error: any) {
    console.error('[Mentor Bot] Error in test-gemini:', error);
    return res.json({
      success: false,
      message: 'Error al probar conexión con Gemini',
      modelUsed: undefined,
      error: error.message || 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Mentor Bot] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Mentor Bot] Server running on port ${PORT}`);
  console.log(`[Mentor Bot] Health check: http://localhost:${PORT}/health`);
  console.log(`[Mentor Bot] Test Gemini: http://localhost:${PORT}/test-gemini`);
});

export default app;

