/**
 * Hook React para usar Gemini AI desde componentes del cliente
 * Maneja estados de carga, errores, y timeouts automáticamente
 */

import { useState, useCallback } from 'react';

export interface UseGeminiOptions {
  timeout?: number; // Timeout en milisegundos (default: 30000)
  extractJson?: boolean;
  config?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface UseGeminiResult {
  callGemini: (prompt: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  data: any;
  modelUsed: string | undefined;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiResult {
  const { timeout = 30000, extractJson = false, config = {} } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [modelUsed, setModelUsed] = useState<string | undefined>();

  const callGemini = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      setModelUsed(undefined);

      try {
        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            extractJson,
            config,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setModelUsed(result.modelUsed);
          return result.data;
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err: any) {
        const errorMessage =
          err.name === 'AbortError'
            ? 'Request timeout. Please try again.'
            : err.message || 'An error occurred';
        
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [timeout, extractJson, config]
  );

  return {
    callGemini,
    isLoading,
    error,
    data,
    modelUsed,
  };
}

/**
 * Hook simplificado para probar la conexión con Gemini
 */
export function useTestGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    modelUsed?: string;
  } | null>(null);

  const testConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-gemini');
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Error testing Gemini connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    testConnection,
    isLoading,
    error,
    result,
  };
}

