/**
 * Test endpoint to validate connectivity with Gemini AI
 * GET /api/test-gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { testGeminiConnection } from '@/lib/ai/gemini-advanced';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const result = await testGeminiConnection();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Connection to Gemini AI successful',
          modelUsed: result.modelUsed,
          data: result.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Error connecting to Gemini AI',
          error: result.error,
          modelUsed: result.modelUsed,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Error in test-gemini:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error testing connection to Gemini',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

