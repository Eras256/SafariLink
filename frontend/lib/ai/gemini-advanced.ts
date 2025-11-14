/**
 * Advanced helper for Google Gemini AI integration
 * Implements multi-model fallback, JSON extraction, and robust error handling
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate that API key is configured
if (!process.env.GEMINI_API_KEY) {
  console.error('[AI] GEMINI_API_KEY is not set');
}

// Single instance of GoogleGenerativeAI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Model fallback order
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
 * Default configuration optimized for generation
 */
const defaultConfig: Required<GeminiConfig> = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
};

/**
 * Calls Gemini AI with multi-model fallback
 * 
 * @param prompt - The prompt to send to the model
 * @param config - Generation configuration (optional)
 * @param extractJson - If true, attempts to extract JSON from response
 * @returns Response with success, data, modelUsed and error if applicable
 */
export async function callGemini(
  prompt: string,
  config: GeminiConfig = {},
  extractJson: boolean = false
): Promise<GeminiResponse> {
  if (!genAI) {
    const error = 'Gemini API key not configured. Set GEMINI_API_KEY environment variable.';
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
    };
  }

  // Combine configuration with default values
  const generationConfig = {
    ...defaultConfig,
    ...config,
  };

  let result: any = null;
  let modelUsed: string | undefined;
  let lastError: Error | null = null;

  // Try each model in order
  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Trying model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      result = await model.generateContent(prompt);
      modelUsed = modelName;
      
      console.log(`[AI] Model ${modelName} used successfully`);
      break;
    } catch (error: any) {
      lastError = error;
      console.warn(`[AI] Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  // If all models failed
  if (!result) {
    const error = `All models failed: ${lastError?.message || 'Unknown error'}`;
    console.error(`[AI] ${error}`);
    return {
      success: false,
      error,
      modelUsed: undefined,
    };
  }

  // Extract text from response
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

  // If JSON extraction is requested
  if (extractJson) {
    try {
      const jsonData = extractJsonFromResponse(responseText);
      return {
        success: true,
        data: jsonData,
        modelUsed,
      };
    } catch (error: any) {
      console.error(`[AI] Error extracting JSON:`, error.message);
      return {
        success: false,
        error: `Failed to extract JSON: ${error.message}`,
        modelUsed,
      };
    }
  }

  // Return plain text
  return {
    success: true,
    data: responseText,
    modelUsed,
  };
}

/**
 * Extracts JSON from a response that may be wrapped in markdown
 * 
 * @param responseText - Response text
 * @returns Parsed JSON object
 */
function extractJsonFromResponse(responseText: string): any {
  // Search for JSON in text (may be in markdown code blocks)
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
 * Tests connection with Gemini AI
 * 
 * @returns Response with connection status
 */
export async function testGeminiConnection(): Promise<GeminiResponse> {
  const testPrompt = 'Respond with a simple JSON: {"status": "ok", "message": "Connection successful"}';
  
  return callGemini(
    testPrompt,
    {
      temperature: 0.4,
      maxOutputTokens: 256,
    },
    true // Extract JSON
  );
}

