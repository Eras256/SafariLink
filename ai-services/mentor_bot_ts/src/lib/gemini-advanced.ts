/**
 * Helper avanzado para integración con Google Gemini AI (Node.js/TypeScript)
 * Migrado desde Python - Misma funcionalidad, sintaxis TypeScript
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Validar que la API key esté configurada
if (!process.env.GEMINI_API_KEY) {
  console.error('[AI] GEMINI_API_KEY is not set');
}

// Instancia única de GoogleGenerativeAI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Orden de fallback de modelos
const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

export type GeminiModel = typeof modelsToTry[number];

export interface GeminiConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse<T = any> {
  success: boolean;
  data?: T;
  modelUsed?: string;
  error?: string;
}

/**
 * Configuración por defecto optimizada para generación
 */
const defaultConfig: Required<GeminiConfig> = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1500,
};

/**
 * Llama a Gemini AI con fallback multi-modelo
 * 
 * @param prompt - El prompt a enviar al modelo
 * @param config - Configuración de generación (opcional)
 * @param extractJson - Si true, intenta extraer JSON de la respuesta
 * @param conversationHistory - Historial de conversación (opcional)
 * @returns Respuesta con success, data, modelUsed y error si aplica
 */
export async function callGemini(
  prompt: string,
  config: GeminiConfig = {},
  extractJson: boolean = false,
  conversationHistory?: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<GeminiResponse> {
  if (!genAI) {
    const error = 'Gemini API key not configured. Set GEMINI_API_KEY environment variable.';
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
    };
  }

  // Combinar configuración con valores por defecto
  const generationConfig = {
    ...defaultConfig,
    ...config,
  };

  let result: any = null;
  let modelUsed: string | undefined;
  let lastError: Error | null = null;

  // Intentar cada modelo en orden
  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Intentando modelo: ${modelName}`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      // Por ahora, siempre usar generateContent (el historial se incluye en el prompt)
      // Esto se puede mejorar en el futuro para usar chat nativo de Gemini
      result = await model.generateContent(prompt);

      modelUsed = modelName;
      console.log(`[AI] Modelo ${modelName} usado exitosamente`);
      break;
    } catch (error: any) {
      lastError = error;
      console.warn(`[AI] Modelo ${modelName} falló:`, error.message);
      continue;
    }
  }

  // Si todos los modelos fallaron
  if (!result) {
    const error = `All models failed: ${lastError?.message || 'Unknown error'}`;
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
      modelUsed: undefined,
    };
  }

  // Extraer texto de la respuesta
  let responseText: string;
  try {
    responseText = result.response.text();
  } catch (error: any) {
    const errorMsg = `Error extracting text from response: ${error.message}`;
    console.error(`[AI] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      modelUsed,
    };
  }

  // Si se solicita extracción de JSON
  if (extractJson) {
    try {
      const jsonData = extractJsonFromResponse(responseText);
      return {
        success: true,
        data: jsonData,
        modelUsed,
      };
    } catch (error: any) {
      console.error(`[AI] Error extrayendo JSON:`, error.message);
      return {
        success: false,
        error: `Failed to extract JSON: ${error.message}`,
        modelUsed,
      };
    }
  }

  // Retornar texto plano
  return {
    success: true,
    data: responseText,
    modelUsed,
  };
}

/**
 * Extrae JSON de una respuesta que puede estar envuelta en markdown
 * 
 * @param responseText - Texto de la respuesta
 * @returns Objeto JSON parseado
 */
function extractJsonFromResponse(responseText: string): any {
  // Buscar JSON en el texto (puede estar en bloques de código markdown)
  const jsonPattern = /\{[\s\S]*\}/;
  const match = responseText.match(jsonPattern);

  if (!match) {
    throw new Error('No valid JSON found in response');
  }

  const jsonStr = match[0];

  try {
    return JSON.parse(jsonStr);
  } catch (error: any) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

/**
 * Prueba la conexión con Gemini AI
 * 
 * @returns Respuesta con el estado de la conexión
 */
export async function testGeminiConnection(): Promise<GeminiResponse> {
  const testPrompt = 'Responde con un JSON simple: {"status": "ok", "message": "Conexión exitosa"}';
  
  return callGemini(
    testPrompt,
    {
      temperature: 0.4,
      maxOutputTokens: 256,
    },
    true // Extraer JSON
  );
}

