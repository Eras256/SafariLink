/**
 * Main endpoint for Gemini AI calls
 * POST /api/ai
 * 
 * Body:
 * {
 *   "prompt": "Your prompt here",
 *   "extractJson": false, // optional, default false
 *   "config": { // optional
 *     "temperature": 0.7,
 *     "topP": 0.9,
 *     "topK": 40,
 *     "maxOutputTokens": 1024
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiConfig } from '@/lib/ai/gemini-advanced';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, extractJson = false, config = {} } = body;

    // Validate that prompt is present
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Validate configuration if provided
    const validatedConfig: GeminiConfig = {};
    if (config.temperature !== undefined) {
      validatedConfig.temperature = Math.max(0, Math.min(2, config.temperature));
    }
    if (config.topP !== undefined) {
      validatedConfig.topP = Math.max(0, Math.min(1, config.topP));
    }
    if (config.topK !== undefined) {
      validatedConfig.topK = Math.max(1, Math.min(100, config.topK));
    }
    if (config.maxOutputTokens !== undefined) {
      validatedConfig.maxOutputTokens = Math.max(1, Math.min(8192, config.maxOutputTokens));
    }

    // Call Gemini
    const result = await callGemini(prompt, validatedConfig, extractJson);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          modelUsed: result.modelUsed,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          modelUsed: result.modelUsed,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Error in /api/ai:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

