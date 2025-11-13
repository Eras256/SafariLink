/**
 * Endpoint de prueba para validar la conectividad con Gemini AI
 * GET /api/test-gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { testGeminiConnection } from '@/lib/ai/gemini-advanced';

// CRÍTICO: Fuerza runtime Node.js (no Edge Runtime)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const result = await testGeminiConnection();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Conexión con Gemini AI exitosa',
          modelUsed: result.modelUsed,
          data: result.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Error al conectar con Gemini AI',
          error: result.error,
          modelUsed: result.modelUsed,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Error en test-gemini:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al probar conexión con Gemini',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

