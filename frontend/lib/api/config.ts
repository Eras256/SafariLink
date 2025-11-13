/**
 * Configuración centralizada de API con valores embebidos
 * Similar al patrón usado en lib/web3/config.ts y lib/images/unsplashService.ts
 */

// Valores embebidos por defecto (desarrollo local)
const DEFAULT_API_URL = 'http://localhost:4000';
const DEFAULT_AI_SERVICE_URL = 'http://localhost:8000';

/**
 * Obtiene la URL base del backend API
 * Prioridad: variable de entorno > valor embebido
 */
export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: usar variable de entorno o valor por defecto
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  }
  
  // Client-side: usar variable de entorno o valor embebido
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

/**
 * Obtiene la URL base del servicio de AI
 * Prioridad: variable de entorno > valor embebido
 */
export function getAiServiceUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AI_SERVICE_URL || DEFAULT_AI_SERVICE_URL;
  }
  
  return process.env.NEXT_PUBLIC_AI_SERVICE_URL || DEFAULT_AI_SERVICE_URL;
}

/**
 * Construye una URL completa para un endpoint de API
 * Maneja paths que ya incluyen query parameters
 */
export function getApiEndpoint(path: string): string {
  const baseUrl = getApiUrl();
  // Asegurar que el path comience con /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remover /api duplicado si ya está en el path
  if (normalizedPath.startsWith('/api')) {
    return `${baseUrl}${normalizedPath}`;
  }
  return `${baseUrl}/api${normalizedPath}`;
}

/**
 * Construye una URL completa para un endpoint del servicio de AI
 */
export function getAiEndpoint(path: string): string {
  const baseUrl = getAiServiceUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

// Exportar valores embebidos para referencia
export const API_CONFIG = {
  DEFAULT_API_URL,
  DEFAULT_AI_SERVICE_URL,
  getApiUrl,
  getAiServiceUrl,
  getApiEndpoint,
  getAiEndpoint,
} as const;

