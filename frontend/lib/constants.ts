export const SUPPORTED_CHAINS = {
  ARBITRUM_SEPOLIA: 421614,
  BASE_SEPOLIA: 84532,
  OPTIMISM_SEPOLIA: 11155420,
} as const;

export const CHAIN_NAMES = {
  [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA]: 'Arbitrum Sepolia',
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: 'Base Sepolia',
  [SUPPORTED_CHAINS.OPTIMISM_SEPOLIA]: 'Optimism Sepolia',
} as const;

export const HACKATHON_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  ONGOING: 'ONGOING',
  JUDGING: 'JUDGING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PROJECT_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WINNER: 'WINNER',
} as const;

export const GRANT_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    NONCE: '/api/auth/nonce',
    VERIFY: '/api/auth/verify',
    ME: '/api/auth/me',
  },
  HACKATHONS: {
    LIST: '/api/hackathons',
    DETAIL: (id: string) => `/api/hackathons/${id}`,
    REGISTER: (id: string) => `/api/hackathons/${id}/register`,
    PROJECTS: (id: string) => `/api/hackathons/${id}/projects`,
  },
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: (id: string) => `/api/projects/${id}`,
    SUBMIT: (id: string) => `/api/projects/${id}/submit`,
    VOTE: (id: string) => `/api/projects/${id}/vote`,
  },
  GRANTS: {
    LIST: '/api/grants',
    DETAIL: (id: string) => `/api/grants/${id}`,
    PROJECT: (slug: string) => `/api/grants/project/${slug}`,
  },
  DAO: {
    LIST: '/api/dao/proposals',
    PROPOSAL: (slug: string) => `/api/dao/proposals/${slug}`,
  },
  LEARN: {
    LIST: '/api/lessons',
    LESSON: (slug: string) => `/api/lessons/${slug}`,
  },
  ORGANIZER: {
    DASHBOARD: (id: string) => `/api/organizer/${id}/dashboard`,
    REALTIME_METRICS: (id: string) => `/api/organizer/${id}/metrics/realtime`,
  },
  TALENT_PROTOCOL: {
    SYNC_ADDRESS: '/api/talent-protocol/sync-address',
    PROFILE_BY_ADDRESS: (address: string) => `/api/talent-protocol/profile/by-address?address=${encodeURIComponent(address)}`,
  },
} as const;

/**
 * NOTA: Para obtener la URL base de la API, usa getApiUrl() de @/lib/api/config
 * en lugar de process.env.NEXT_PUBLIC_API_URL directamente.
 * 
 * Ejemplo:
 * import { getApiUrl, getApiEndpoint } from '@/lib/api/config';
 * const apiUrl = getApiUrl();
 * const fullUrl = getApiEndpoint(API_ENDPOINTS.AUTH.ME);
 */

