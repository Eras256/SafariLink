import { prisma } from '../config/database';

// Types
export interface TalentProtocolProfile {
  id: string;
  address: string;
  username?: string;
  name?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  tokenId?: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenBalance?: string;
  tokenPrice?: string;
  totalSupply?: string;
  supporterCount?: number;
  totalRaised?: string;
  builderScore?: number;
  builderScoreLevel?: {
    level: number;
    name: string;
    minScore: number;
    maxScore?: number;
  };
  creatorStats?: {
    earnings?: number;
    collectors?: number;
    dailyActivity?: Array<{
      date: string;
      activity: number;
    }>;
    zoraCreatorCoin?: {
      symbol?: string;
      price?: number;
    };
  };
  milestones?: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    type: 'education' | 'work' | 'achievement' | 'project';
    verified?: boolean;
  }>;
  skills?: string[];
  experience?: string;
  verified?: boolean;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch user profile from Talent Protocol using REST API v3
 * API Documentation: https://docs.talentprotocol.com/docs/developers/talent-api
 * 
 * Endpoints utilizados:
 * - GET /profile?id={wallet_address} - Obtener perfil completo
 * - GET /score?id={wallet_address} - Obtener Builder Score
 * - GET /accounts?id={wallet_address} - Obtener cuentas conectadas
 * - GET /socials?id={wallet_address} - Obtener redes sociales
 */
async function fetchTalentProtocolProfile(address: string): Promise<TalentProtocolProfile | null> {
  try {
    const normalizedAddress = address.toLowerCase();
    console.log('Buscando perfil de Talent Protocol para:', normalizedAddress);
    
    // Talent Protocol REST API v3
    const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
    const baseUrl = 'https://api.talentprotocol.com';
    
    // Método 1: Obtener perfil directamente por wallet address
    const profileUrl = `${baseUrl}/profile?id=${encodeURIComponent(normalizedAddress)}`;
    
    console.log('Obteniendo perfil de Talent Protocol:', {
      endpoint: profileUrl,
      address: normalizedAddress,
    });
    
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });

    let profileData: any = null;
    
    if (profileResponse.ok) {
      profileData = await profileResponse.json() as any;
      console.log('Respuesta de /profile:', JSON.stringify(profileData, null, 2));
      
      if (profileData.profile) {
        console.log('Perfil encontrado, obteniendo información adicional...');
        // Obtener información adicional en paralelo
        const [scoreData, accountsData, socialsData, projectsData] = await Promise.all([
          fetchScore(normalizedAddress, apiKey, baseUrl),
          fetchAccounts(normalizedAddress, apiKey, baseUrl),
          fetchSocials(normalizedAddress, apiKey, baseUrl),
          fetchProjects(normalizedAddress, apiKey, baseUrl),
        ]);
        
        console.log('Datos adicionales obtenidos:', {
          hasScore: !!scoreData,
          hasAccounts: !!accountsData,
          hasSocials: !!socialsData,
          hasProjects: !!projectsData,
        });
        
        return mapTalentProtocolResponse(profileData, normalizedAddress, {
          score: scoreData,
          accounts: accountsData,
          socials: socialsData,
          projects: projectsData,
          creatorStats: null, // Se obtendrá después si hay autenticación
        });
      }
    } else {
      const errorText = await profileResponse.text();
      console.warn(`Talent Protocol profile API error (${profileResponse.status}):`, errorText);
    }

    // Si el endpoint /profile no funciona, intentar búsqueda avanzada
    console.log('Intentando búsqueda avanzada por wallet address...');
    
    const searchQuery = {
      query: {
        walletAddresses: [normalizedAddress],
        exactMatch: true, // Buscar coincidencia exacta
      },
      sort: {
        id: {
          order: 'desc',
        },
      },
      page: 1,
      per_page: 1,
    };

    // URL encode los parámetros según la documentación
    const queryString = Object.keys(searchQuery)
      .map(key => `${key}=${encodeURIComponent(JSON.stringify(searchQuery[key as keyof typeof searchQuery]))}`)
      .join('&');

    const searchUrl = `${baseUrl}/search/advanced/profiles?${queryString}`;
    
    console.log('Buscando con búsqueda avanzada:', searchUrl);
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json() as any;
      console.log('Respuesta de búsqueda avanzada:', JSON.stringify(searchData, null, 2));
      
      if (searchData.profiles && searchData.profiles.length > 0) {
        const profile = searchData.profiles[0];
        // Obtener información adicional
        const [scoreData, accountsData, socialsData, projectsData] = await Promise.all([
          fetchScore(normalizedAddress, apiKey, baseUrl),
          fetchAccounts(normalizedAddress, apiKey, baseUrl),
          fetchSocials(normalizedAddress, apiKey, baseUrl),
          fetchProjects(normalizedAddress, apiKey, baseUrl),
        ]);
        
        return mapTalentProtocolResponse({ profile }, normalizedAddress, {
          score: scoreData,
          accounts: accountsData,
          socials: socialsData,
          projects: projectsData,
          creatorStats: null, // Se obtendrá después si hay autenticación
        });
      }
    } else {
      const errorText = await searchResponse.text();
      console.warn(`Talent Protocol search API error (${searchResponse.status}):`, errorText);
    }
    
    console.log('No se encontró perfil en Talent Protocol para la dirección:', normalizedAddress);
    return null;
  } catch (error) {
    console.error('Error fetching Talent Protocol profile:', error);
    return null;
  }
}

/**
 * Fetch Builder Score for a wallet address
 */
async function fetchScore(address: string, apiKey: string, baseUrl: string): Promise<any> {
  try {
    const scoreUrl = `${baseUrl}/score?id=${encodeURIComponent(address)}&scorer_slug=builder_score`;
    const response = await fetch(scoreUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('Error fetching score:', error);
  }
  return null;
}

/**
 * Fetch connected accounts for a wallet address
 */
async function fetchAccounts(address: string, apiKey: string, baseUrl: string): Promise<any> {
  try {
    const accountsUrl = `${baseUrl}/accounts?id=${encodeURIComponent(address)}`;
    const response = await fetch(accountsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('Error fetching accounts:', error);
  }
  return null;
}

/**
 * Fetch social media connections for a wallet address
 */
async function fetchSocials(address: string, apiKey: string, baseUrl: string): Promise<any> {
  try {
    const socialsUrl = `${baseUrl}/socials?id=${encodeURIComponent(address)}`;
    const response = await fetch(socialsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('Error fetching socials:', error);
  }
  return null;
}

/**
 * Fetch projects for a wallet address
 */
async function fetchProjects(address: string, apiKey: string, baseUrl: string): Promise<any> {
  try {
    const projectsUrl = `${baseUrl}/projects?id=${encodeURIComponent(address)}`;
    const response = await fetch(projectsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('Error fetching projects:', error);
  }
  return null;
}

/**
 * Create a nonce for wallet authentication
 * POST /auth/create_nonce
 */
async function createNonce(address: string, apiKey: string, baseUrl: string): Promise<string | null> {
  try {
    const nonceUrl = `${baseUrl}/auth/create_nonce?address=${encodeURIComponent(address)}`;
    const response = await fetch(nonceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      const data = await response.json() as any;
      return data.nonce || null;
    }
  } catch (error) {
    console.warn('Error creating nonce:', error);
  }
  return null;
}

/**
 * Create auth token after wallet signs the message
 * POST /auth/create_auth_token
 */
async function createAuthToken(
  address: string, 
  signature: string, 
  chainId: string, 
  apiKey: string, 
  baseUrl: string
): Promise<string | null> {
  try {
    const authUrl = `${baseUrl}/auth/create_auth_token?address=${encodeURIComponent(address)}&signature=${encodeURIComponent(signature)}&chain_id=${encodeURIComponent(chainId)}`;
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    
    if (response.ok) {
      const data = await response.json() as any;
      return data.auth?.token || data.token || null;
    }
  } catch (error) {
    console.warn('Error creating auth token:', error);
  }
  return null;
}

/**
 * Fetch creator stats for authenticated user
 * GET /creator_stats (requires Bearer token)
 */
async function fetchCreatorStats(authToken: string, apiKey: string, baseUrl: string): Promise<any> {
  try {
    const statsUrl = `${baseUrl}/creator_stats`;
    const response = await fetch(statsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    } else {
      const errorText = await response.text();
      console.warn(`Error fetching creator stats (${response.status}):`, errorText);
    }
  } catch (error) {
    console.warn('Error fetching creator stats:', error);
  }
  return null;
}

/**
 * Calculate Builder Score Level based on score value
 * Levels according to Talent Protocol documentation:
 * Level 1 (Novice): 0-39
 * Level 2 (Apprentice): 40-79
 * Level 3 (Practitioner): 80-119
 * Level 4 (Advanced): 120-169
 * Level 5 (Expert): 170-249
 * Level 6 (Master): 250+
 */
function getBuilderScoreLevel(score: number): {
  level: number;
  name: string;
  minScore: number;
  maxScore?: number;
} {
  if (score >= 250) {
    return { level: 6, name: 'Master', minScore: 250 };
  } else if (score >= 170) {
    return { level: 5, name: 'Expert', minScore: 170, maxScore: 249 };
  } else if (score >= 120) {
    return { level: 4, name: 'Advanced', minScore: 120, maxScore: 169 };
  } else if (score >= 80) {
    return { level: 3, name: 'Practitioner', minScore: 80, maxScore: 119 };
  } else if (score >= 40) {
    return { level: 2, name: 'Apprentice', minScore: 40, maxScore: 79 };
  } else {
    return { level: 1, name: 'Novice', minScore: 0, maxScore: 39 };
  }
}

/**
 * Map Talent Protocol API v3 response to our internal format
 * La respuesta de la API v3 tiene una estructura específica según la documentación
 */
function mapTalentProtocolResponse(
  data: any, 
  address: string,
  additionalData?: {
    score?: any;
    accounts?: any;
    socials?: any;
    projects?: any;
    creatorStats?: any;
  }
): TalentProtocolProfile | null {
  try {
    // La respuesta de /profile tiene la estructura: { profile: {...} }
    // La respuesta de /search/advanced/profiles tiene: { profiles: [...] }
    const profile = data.profile || (data.profiles && data.profiles[0]) || data;
    
    if (!profile) {
      console.warn('No se encontró objeto profile en la respuesta:', Object.keys(data));
      return null;
    }
    
    // Extraer información de score si está disponible
    const score = additionalData?.score?.score;
    const builderScore = score?.points || score?.value || profile.builder_score || profile.scores?.find((s: any) => s.scorer_slug === 'builder_score')?.points || 0;
    const builderScoreLevel = builderScore > 0 ? getBuilderScoreLevel(builderScore) : undefined;
    
    // Extraer información de socials según la documentación
    // Cada Social tiene: source, owner, follower_count, following_count, display_name, name, profile_url, image_url, bio, location, owned_since
    const socials = additionalData?.socials?.socials || [];
    const twitterSocial = socials.find((s: any) => s.source === 'x_twitter' || s.source === 'twitter' || s.source === 'x');
    const githubSocial = socials.find((s: any) => s.source === 'github');
    const linkedinSocial = socials.find((s: any) => s.source === 'linkedin');
    const farcasterSocial = socials.find((s: any) => s.source === 'farcaster');
    const lensSocial = socials.find((s: any) => s.source === 'lens');
    
    // Extraer información de accounts
    const accounts = additionalData?.accounts?.accounts || [];
    
    // Extraer tags/skills del perfil
    const tags = profile.tags || [];
    const skills = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : []);
    
    // Convertir proyectos a milestones si están disponibles
    const projects = additionalData?.projects?.projects || [];
    const milestones = projects.map((project: any, index: number) => ({
      id: project.id || project.slug || `project-${index}`,
      title: project.name || project.title || 'Project',
      description: project.description,
      date: project.created_at || project.created_date || new Date().toISOString(),
      type: 'project' as const,
      verified: project.verified || false,
    }));
    
    // Mapear campos según la estructura de la API v3
    const mappedProfile: TalentProtocolProfile = {
      id: profile.id || profile.uuid || profile.profile_id || '',
      address: profile.main_wallet || profile.wallet_address || profile.address || address,
      username: profile.username || profile.handle || profile.talent_protocol_id,
      name: profile.name || profile.display_name || profile.user_display_name,
      bio: profile.bio || profile.description,
      avatar: profile.avatar || profile.avatar_url || profile.image_url,
      coverImage: profile.cover_image || profile.cover_image_url,
      location: profile.location,
      website: profile.website || profile.website_url,
      // Socials - usar datos de /socials endpoint según la documentación
      // Cada Social tiene: source, owner, name, display_name, profile_url, follower_count, etc.
      // Usar profile_url si está disponible, sino construir la URL desde owner/name
      twitter: twitterSocial?.profile_url || 
               (twitterSocial?.owner ? `https://twitter.com/${twitterSocial.owner}` : null) ||
               (twitterSocial?.name ? `https://twitter.com/${twitterSocial.name}` : null) ||
               profile.twitter || profile.twitter_handle || profile.x,
      github: githubSocial?.profile_url || 
              (githubSocial?.owner ? `https://github.com/${githubSocial.owner}` : null) ||
              (githubSocial?.name ? `https://github.com/${githubSocial.name}` : null) ||
              profile.github || profile.github_username,
      linkedin: linkedinSocial?.profile_url || 
                (linkedinSocial?.owner ? `https://linkedin.com/in/${linkedinSocial.owner}` : null) ||
                (linkedinSocial?.name ? `https://linkedin.com/in/${linkedinSocial.name}` : null) ||
                profile.linkedin || profile.linkedin_username,
      // Token information
      tokenId: profile.talent_token?.id || profile.token?.id,
      tokenSymbol: profile.talent_token?.symbol || profile.token?.symbol,
      tokenName: profile.talent_token?.name || profile.token?.name,
      totalSupply: profile.talent_token?.total_supply?.toString() || profile.token?.total_supply?.toString(),
      tokenPrice: profile.talent_token?.current_price?.toString() || profile.token?.current_price?.toString(),
      tokenBalance: profile.token_balance?.toString() || profile.talent_token?.balance?.toString(),
      // Supporters y raised
      supporterCount: profile.supporter_count || profile.supporters_count || profile.supporters?.length || 0,
      totalRaised: profile.total_raised?.toString() || profile.raised_amount?.toString(),
      // Builder Score
      builderScore: builderScore,
      builderScoreLevel: builderScoreLevel,
      // Creator Stats (si está disponible y autenticado)
      creatorStats: additionalData?.creatorStats ? {
        earnings: additionalData.creatorStats.earnings,
        collectors: additionalData.creatorStats.collectors,
        dailyActivity: additionalData.creatorStats.daily_activity || additionalData.creatorStats.dailyActivity,
        zoraCreatorCoin: additionalData.creatorStats.zora_creator_coin || additionalData.creatorStats.zoraCreatorCoin,
      } : undefined,
      // Skills/Tags
      skills: skills.length > 0 ? skills : undefined,
      // Milestones (from projects)
      milestones: milestones.length > 0 ? milestones : undefined,
      // Verification - human_checkmark es el campo correcto según la documentación
      verified: profile.human_checkmark || profile.verified || profile.is_verified || false,
      verifiedAt: profile.verified_at || profile.verified_date || profile.human_checkmark_verified_at,
      createdAt: profile.created_at || profile.created_date,
      updatedAt: profile.updated_at || profile.updated_date,
    };
    
    // Validar que tenemos al menos un ID
    if (!mappedProfile.id) {
      console.warn('Perfil sin ID válido:', profile);
      return null;
    }
    
    console.log('Perfil mapeado de Talent Protocol:', {
      id: mappedProfile.id,
      username: mappedProfile.username,
      name: mappedProfile.name,
      address: mappedProfile.address,
      verified: mappedProfile.verified,
      supporterCount: mappedProfile.supporterCount,
      builderScore: mappedProfile.builderScore,
      builderScoreLevel: mappedProfile.builderScoreLevel?.name,
      accountsCount: accounts.length,
      socialsCount: socials.length,
      skillsCount: mappedProfile.skills?.length || 0,
      hasToken: !!mappedProfile.tokenSymbol,
      hasWebsite: !!mappedProfile.website,
      hasLocation: !!mappedProfile.location,
      twitter: mappedProfile.twitter || 'No disponible',
      github: mappedProfile.github || 'No disponible',
      linkedin: mappedProfile.linkedin || 'No disponible',
    });
    
    // Log detallado de socials
    if (socials.length > 0) {
      console.log('Redes sociales encontradas:', socials.map((s: any) => ({
        source: s.source,
        name: s.name,
        owner: s.owner,
        username: s.username,
      })));
    }
    
    // Log completo del perfil para debugging
    console.log('Perfil completo mapeado:', JSON.stringify(mappedProfile, null, 2));
    
    return mappedProfile;
  } catch (error) {
    console.error('Error mapping Talent Protocol response:', error);
    console.error('Datos recibidos:', JSON.stringify(data, null, 2));
    return null;
  }
}

/**
 * Get mock Talent Protocol profile for development
 */
function getMockTalentProtocolProfile(address: string): TalentProtocolProfile | null {
  return {
    id: `talent-${address.slice(0, 8)}`,
    address: address.toLowerCase(),
    username: `builder_${address.slice(2, 8)}`,
    name: 'Web3 Builder',
    bio: 'Passionate Web3 developer building the future of decentralized applications.',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
    location: 'Global',
    twitter: `@builder_${address.slice(2, 8)}`,
    github: `github.com/builder_${address.slice(2, 8)}`,
    tokenId: `token-${address.slice(0, 8)}`,
    tokenSymbol: 'TAL',
    tokenName: 'Builder Talent Token',
    tokenBalance: '1000',
    tokenPrice: '0.05',
    totalSupply: '10000',
    supporterCount: 12,
    totalRaised: '500',
    verified: true,
    verifiedAt: new Date().toISOString(),
    milestones: [
      {
        id: '1',
        title: 'ETH Safari 2025 Winner',
        description: 'Won first place in DeFi track',
        date: '2025-01-15',
        type: 'achievement',
        verified: true,
      },
    ],
    skills: ['Solidity', 'React', 'Node.js', 'DeFi', 'NFT'],
    experience: '5+ years',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate reputation score based on Talent Protocol data
 */
function calculateTalentProtocolScore(profile: TalentProtocolProfile | null): number {
  if (!profile) return 0;

  let score = 0;

  // Base score for having a profile
  score += 10;

  // Verified profile bonus
  if (profile.verified) {
    score += 20;
  }

  // Supporter count (1 point per supporter, max 50)
  score += Math.min(profile.supporterCount || 0, 50);

  // Total raised (1 point per $10, max 100)
  const raised = parseFloat(profile.totalRaised || '0');
  score += Math.min(Math.floor(raised / 10), 100);

  // Milestones (5 points each, max 50)
  const milestoneCount = profile.milestones?.length || 0;
  score += Math.min(milestoneCount * 5, 50);

  // Token balance (1 point per 100 tokens, max 30)
  const balance = parseFloat(profile.tokenBalance || '0');
  score += Math.min(Math.floor(balance / 100), 30);

  return Math.min(score, 260); // Max score of 260
}

export class TalentProtocolService {
  /**
   * Sync user's Talent Protocol profile
   */
  static async syncUserProfile(userId: string, walletAddress: string): Promise<void> {
    try {
      const profile = await fetchTalentProtocolProfile(walletAddress);

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          builderScore: true,
          talentProtocolScore: true,
        },
      });

      const previousScore = existingUser?.talentProtocolScore || 0;
      const baseScore = Math.max((existingUser?.builderScore || 0) - previousScore, 0);

      if (!profile) {
        // User doesn't have a Talent Protocol profile
        await prisma.user.update({
          where: { id: userId },
          data: {
            talentProtocolId: null,
            talentProtocolUsername: null,
            talentProtocolVerified: false,
            talentTokenBalance: null,
            talentSupporterCount: 0,
            talentTotalRaised: null,
            talentProtocolScore: 0,
            talentProtocolSyncedAt: new Date(),
            talentProtocolData: null,
            builderScore: baseScore,
          },
        });
        return;
      }

      // Calculate reputation score
      const score = calculateTalentProtocolScore(profile);

      // Update user with Talent Protocol data
      await prisma.user.update({
        where: { id: userId },
        data: {
          talentProtocolId: profile.id,
          talentProtocolUsername: profile.username || null,
          talentProtocolVerified: profile.verified || false,
          talentTokenBalance: profile.tokenBalance || null,
          talentSupporterCount: profile.supporterCount || 0,
          talentTotalRaised: profile.totalRaised || null,
          talentProtocolScore: score,
          talentProtocolSyncedAt: new Date(),
          talentProtocolData: JSON.stringify(profile) as any, // SQLite almacena JSON como string
          builderScore: baseScore + score,
        },
      });
    } catch (error) {
      console.error('Error syncing Talent Protocol profile:', error);
      throw error;
    }
  }

  /**
   * Get user's Talent Protocol profile
   */
  static async getUserProfile(userId: string): Promise<TalentProtocolProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          talentProtocolData: true,
          talentProtocolId: true,
        },
      });

      if (!user || !user.talentProtocolData) {
        return null;
      }

      // En SQLite, talentProtocolData es un string JSON
      const data = user.talentProtocolData;
      if (typeof data === 'string') {
        return JSON.parse(data) as TalentProtocolProfile;
      }
      return data as TalentProtocolProfile;
    } catch (error) {
      console.error('Error getting Talent Protocol profile:', error);
      return null;
    }
  }

  /**
   * Get creator stats for authenticated user
   * Requires wallet signature authentication
   */
  static async getCreatorStats(
    address: string, 
    signature: string, 
    chainId: string
  ): Promise<any> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';
      
      // Primero crear el auth token
      const authToken = await createAuthToken(address, signature, chainId, apiKey, baseUrl);
      
      if (!authToken) {
        console.warn('Failed to create auth token for creator stats');
        return null;
      }
      
      // Luego obtener los creator stats
      return await fetchCreatorStats(authToken, apiKey, baseUrl);
    } catch (error) {
      console.error('Error getting creator stats:', error);
      return null;
    }
  }

  static async getProfileByWalletAddress(address: string): Promise<TalentProtocolProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address.toLowerCase() },
        select: {
          talentProtocolData: true,
          talentProtocolId: true,
        },
      });

      if (!user || !user.talentProtocolData) {
        return null;
      }

      // En SQLite, talentProtocolData es un string JSON
      const data = user.talentProtocolData;
      if (typeof data === 'string') {
        return JSON.parse(data) as TalentProtocolProfile;
      }
      return data as TalentProtocolProfile;
    } catch (error) {
      console.error('Error getting Talent Protocol profile by address:', error);
      return null;
    }
  }

  /**
   * Check if user has Talent Protocol profile
   */
  static async hasProfile(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { talentProtocolId: true },
      });

      return user?.talentProtocolId !== null;
    } catch (error) {
      console.error('Error checking Talent Protocol profile:', error);
      return false;
    }
  }

  /**
   * Get Talent Protocol score for user
   */
  static async getScore(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { talentProtocolScore: true },
      });

      return user?.talentProtocolScore || 0;
    } catch (error) {
      console.error('Error getting Talent Protocol score:', error);
      return 0;
    }
  }

  /**
   * Batch sync multiple users
   */
  static async batchSyncUsers(userIds: string[]): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, walletAddress: true },
      });

      await Promise.all(
        users.map((user) => this.syncUserProfile(user.id, user.walletAddress))
      );
    } catch (error) {
      console.error('Error batch syncing Talent Protocol profiles:', error);
      throw error;
    }
  }

  /**
    * Sync profile by wallet address (creates user if needed)
    */
  static async syncByWalletAddress(walletAddress: string): Promise<void> {
    const normalizedAddress = walletAddress.toLowerCase();

    const user = await prisma.user.upsert({
      where: { walletAddress: normalizedAddress },
      update: {},
      create: { walletAddress: normalizedAddress },
      select: { id: true },
    });

    await this.syncUserProfile(user.id, normalizedAddress);
  }

  /**
   * Get Farcaster scores for a list of Farcaster IDs
   * GET /farcaster/scores?fids={fid1,fid2,...}&scorer_slug={optional}
   * 
   * @param fids - Comma-separated list of Farcaster IDs (max 100)
   * @param scorerSlug - Optional scorer slug (defaults to builder_score)
   * @returns Array of score objects
   */
  static async getFarcasterScores(
    fids: string | string[],
    scorerSlug?: string
  ): Promise<any[]> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      // Normalize fids to comma-separated string
      const fidsString = Array.isArray(fids) ? fids.join(',') : fids;
      
      // Validate: max 100 FIDs
      const fidArray = fidsString.split(',').map(f => f.trim()).filter(f => f);
      if (fidArray.length > 100) {
        throw new Error('Maximum 100 Farcaster IDs allowed');
      }

      // Validate: only positive integers
      for (const fid of fidArray) {
        const fidNum = parseInt(fid, 10);
        if (isNaN(fidNum) || fidNum <= 0) {
          throw new Error(`Invalid Farcaster ID: ${fid}. Only positive integers are accepted.`);
        }
      }

      // Build URL with query parameters
      const params = new URLSearchParams({
        fids: fidsString,
      });

      if (scorerSlug) {
        params.append('scorer_slug', scorerSlug);
      }

      const url = `${baseUrl}/farcaster/scores?${params.toString()}`;

      console.log('Fetching Farcaster scores:', {
        url,
        fidsCount: fidArray.length,
        scorerSlug: scorerSlug || 'default (builder_score)',
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching Farcaster scores:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch Farcaster scores: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { scores: [...] }
      const scores = data.scores || data || [];
      
      console.log(`Successfully fetched ${scores.length} Farcaster scores`);
      
      return scores;
    } catch (error: any) {
      console.error('Error getting Farcaster scores:', error);
      throw error;
    }
  }

  /**
   * Get Farcaster casts that a talent profile is the author of
   * GET /farcaster/profile_farcaster_casts?id={talent_id|wallet|account}&account_source={optional}
   * 
   * @param id - Talent ID, wallet address, or account identifier
   * @param accountSource - Optional account source (farcaster, github, wallet)
   * @returns Array of Farcaster cast objects
   */
  static async getProfileFarcasterCasts(
    id: string,
    accountSource?: 'farcaster' | 'github' | 'wallet'
  ): Promise<any[]> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      // Build URL with query parameters
      const params = new URLSearchParams({
        id: id,
      });

      if (accountSource) {
        params.append('account_source', accountSource);
      }

      const url = `${baseUrl}/farcaster/profile_farcaster_casts?${params.toString()}`;

      console.log('Fetching profile Farcaster casts:', {
        url,
        id,
        accountSource: accountSource || 'not specified',
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching profile Farcaster casts:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch profile Farcaster casts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { farcaster_casts: [...] }
      const casts = data.farcaster_casts || data || [];
      
      console.log(`Successfully fetched ${casts.length} Farcaster casts for profile`);
      
      return casts;
    } catch (error: any) {
      console.error('Error getting profile Farcaster casts:', error);
      throw error;
    }
  }

  /**
   * Get top Farcaster casts
   * GET /farcaster/farcaster_casts
   * 
   * @returns Array of top Farcaster cast objects
   */
  static async getTopFarcasterCasts(): Promise<any[]> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      const url = `${baseUrl}/farcaster/farcaster_casts`;

      console.log('Fetching top Farcaster casts:', { url });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching top Farcaster casts:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch top Farcaster casts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { farcaster_casts: [...] }
      const casts = data.farcaster_casts || data || [];
      
      console.log(`Successfully fetched ${casts.length} top Farcaster casts`);
      
      return casts;
    } catch (error: any) {
      console.error('Error getting top Farcaster casts:', error);
      throw error;
    }
  }

  /**
   * Get Talent Protocol human checkmark status for a profile
   * GET /human_checkmark?id={talent_id|wallet|account}&account_source={optional}
   * 
   * @param id - Talent ID, wallet address, or account identifier
   * @param accountSource - Optional account source (farcaster, github, wallet)
   * @returns Boolean indicating if the profile has human checkmark verified
   */
  static async getHumanCheckmark(
    id: string,
    accountSource?: 'farcaster' | 'github' | 'wallet'
  ): Promise<boolean> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      // Build URL with query parameters
      const params = new URLSearchParams({
        id: id,
      });

      if (accountSource) {
        params.append('account_source', accountSource);
      }

      const url = `${baseUrl}/human_checkmark?${params.toString()}`;

      console.log('Fetching human checkmark status:', {
        url,
        id,
        accountSource: accountSource || 'not specified',
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching human checkmark:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch human checkmark: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { humanity_verified: boolean }
      const isVerified = data.humanity_verified || data.verified || false;
      
      console.log(`Human checkmark status for ${id}: ${isVerified ? 'verified' : 'not verified'}`);
      
      return isVerified;
    } catch (error: any) {
      console.error('Error getting human checkmark:', error);
      throw error;
    }
  }

  /**
   * Get Talent Protocol human checkmark data points for a profile
   * GET /human_checkmark/data_points?id={talent_id|wallet|account}&account_source={optional}
   * 
   * @param id - Talent ID, wallet address, or account identifier (optional)
   * @param accountSource - Optional account source (farcaster, github, wallet)
   * @returns Array of data point objects that contribute to the human checkmark
   */
  static async getHumanCheckmarkDataPoints(
    id?: string,
    accountSource?: 'farcaster' | 'github' | 'wallet'
  ): Promise<any[]> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      // Build URL with query parameters
      const params = new URLSearchParams();

      if (id) {
        params.append('id', id);
      }

      if (accountSource) {
        params.append('account_source', accountSource);
      }

      const url = `${baseUrl}/human_checkmark/data_points${params.toString() ? `?${params.toString()}` : ''}`;

      console.log('Fetching human checkmark data points:', {
        url,
        id: id || 'not specified',
        accountSource: accountSource || 'not specified',
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching human checkmark data points:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch human checkmark data points: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { data_points: [...] }
      const dataPoints = data.data_points || data || [];
      
      console.log(`Successfully fetched ${dataPoints.length} human checkmark data points`);
      
      return dataPoints;
    } catch (error: any) {
      console.error('Error getting human checkmark data points:', error);
      throw error;
    }
  }

  /**
   * Get a profile using wallet, talent id or account identifier
   * GET /profile?id={talent_id|wallet|account}&account_source={optional}&scorer_slug={optional}
   * 
   * This is a direct wrapper around the Talent Protocol /profile endpoint
   * with full support for all query parameters including scorer_slug for rank position
   * 
   * @param id - Talent ID, wallet address, or account identifier
   * @param accountSource - Optional account source (farcaster, github, wallet)
   * @param scorerSlug - Optional scorer slug (builder_score, creator_score) for rank position
   * @returns Profile object from Talent Protocol API
   */
  static async getProfileDirect(
    id: string,
    accountSource?: 'farcaster' | 'github' | 'wallet',
    scorerSlug?: 'builder_score' | 'creator_score'
  ): Promise<any> {
    try {
      const apiKey = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
      const baseUrl = 'https://api.talentprotocol.com';

      // Build URL with query parameters
      const params = new URLSearchParams({
        id: id,
      });

      if (accountSource) {
        params.append('account_source', accountSource);
      }

      if (scorerSlug) {
        params.append('scorer_slug', scorerSlug);
      }

      const url = `${baseUrl}/profile?${params.toString()}`;

      console.log('Fetching profile directly from Talent Protocol:', {
        url,
        id,
        accountSource: accountSource || 'not specified',
        scorerSlug: scorerSlug || 'not specified',
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching profile:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // The API returns { profile: {...} }
      const profile = data.profile || data;
      
      console.log(`Successfully fetched profile for ${id}`);
      
      return profile;
    } catch (error: any) {
      console.error('Error getting profile directly:', error);
      throw error;
    }
  }
}

