/**
 * Configuración centralizada de API con valores embebidos
 * Similar al patrón usado en lib/web3/config.ts y lib/images/unsplashService.ts
 */

// Valores embebidos por defecto
const DEFAULT_API_URL_DEV = 'http://localhost:4000';
const DEFAULT_AI_SERVICE_URL = 'http://localhost:8000';

/**
 * Obtiene la URL base del backend API
 * Prioridad: variable de entorno > API proxy route > detección automática > valor embebido
 * 
 * En producción, usa el API route de Next.js como proxy para evitar problemas de CORS
 * y no necesitar configurar URLs en el cliente
 */
export function getApiUrl(): string {
  // Primero intentar variable de entorno (siempre tiene prioridad)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // En producción (cliente), usar el API route como proxy
  // Esto evita problemas de CORS y no requiere configuración
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si no es localhost, usar el API route de Next.js como proxy
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('localhost')) {
      // Usar el mismo dominio pero con /api/proxy
      // El proxy route manejará la conexión al backend real
      return window.location.origin;
    }
  }
  
  // Por defecto: localhost para desarrollo
  return DEFAULT_API_URL_DEV;
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
 * En producción, usa el proxy route de Next.js
 */
export function getApiEndpoint(path: string): string {
  const baseUrl = getApiUrl();
  // Asegurar que el path comience con /
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Si estamos usando el proxy (producción sin variable de entorno)
  if (typeof window !== 'undefined' && baseUrl === window.location.origin) {
    // El path ya incluye /api/talent-protocol/..., solo necesitamos agregar /api/proxy
    // Remover el prefijo /api si existe porque el proxy lo maneja
    if (normalizedPath.startsWith('/api/')) {
      normalizedPath = normalizedPath.replace('/api', '');
    }
    return `${baseUrl}/api/proxy${normalizedPath}`;
  }
  
  // Para desarrollo o cuando hay variable de entorno configurada
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
  DEFAULT_API_URL: DEFAULT_API_URL_DEV,
  DEFAULT_AI_SERVICE_URL,
  getApiUrl,
  getAiServiceUrl,
  getApiEndpoint,
  getAiEndpoint,
} as const;

