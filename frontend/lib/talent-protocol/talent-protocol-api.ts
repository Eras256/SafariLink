/**
 * Server-side helper for Talent Protocol API integration
 * Similar to gemini-advanced.ts, runs only on server
 * 
 * API Documentation: https://docs.talentprotocol.com/docs/developers/talent-api
 * Base URL: https://api.talentprotocol.com
 */

// Validate that API key is configured
if (!process.env.TALENT_PROTOCOL_API_KEY) {
  console.warn('[Talent Protocol] TALENT_PROTOCOL_API_KEY is not set');
}

const API_KEY = process.env.TALENT_PROTOCOL_API_KEY || 'your_talent_protocol_api_key_here';
const BASE_URL = 'https://api.talentprotocol.com';

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
  verified?: boolean;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TalentProtocolResponse {
  success: boolean;
  profile?: TalentProtocolProfile | null;
  error?: string;
}

/**
 * Fetch Builder Score for a wallet address
 */
async function fetchScore(address: string): Promise<any> {
  try {
    const scoreUrl = `${BASE_URL}/score?id=${encodeURIComponent(address)}&scorer_slug=builder_score`;
    const response = await fetch(scoreUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('[Talent Protocol] Error fetching score:', error);
  }
  return null;
}

/**
 * Fetch connected accounts for a wallet address
 */
async function fetchAccounts(address: string): Promise<any> {
  try {
    const accountsUrl = `${BASE_URL}/accounts?id=${encodeURIComponent(address)}`;
    const response = await fetch(accountsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('[Talent Protocol] Error fetching accounts:', error);
  }
  return null;
}

/**
 * Fetch social media connections for a wallet address
 */
async function fetchSocials(address: string): Promise<any> {
  try {
    const socialsUrl = `${BASE_URL}/socials?id=${encodeURIComponent(address)}`;
    const response = await fetch(socialsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('[Talent Protocol] Error fetching socials:', error);
  }
  return null;
}

/**
 * Fetch projects for a wallet address
 */
async function fetchProjects(address: string): Promise<any> {
  try {
    const projectsUrl = `${BASE_URL}/projects?id=${encodeURIComponent(address)}`;
    const response = await fetch(projectsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    
    if (response.ok) {
      return await response.json() as any;
    }
  } catch (error) {
    console.warn('[Talent Protocol] Error fetching projects:', error);
  }
  return null;
}

/**
 * Calculate Builder Score Level based on score value
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
 */
function mapTalentProtocolResponse(
  data: any, 
  address: string,
  additionalData?: {
    score?: any;
    accounts?: any;
    socials?: any;
    projects?: any;
  }
): TalentProtocolProfile | null {
  try {
    const profile = data.profile || (data.profiles && data.profiles[0]) || data;
    
    if (!profile) {
      console.warn('[Talent Protocol] No profile found in response');
      return null;
    }
    
    // Extract score information
    const score = additionalData?.score?.score;
    const builderScore = score?.points || score?.value || profile.builder_score || 
                        profile.scores?.find((s: any) => s.scorer_slug === 'builder_score')?.points || 0;
    const builderScoreLevel = builderScore > 0 ? getBuilderScoreLevel(builderScore) : undefined;
    
    // Extract socials
    const socials = additionalData?.socials?.socials || [];
    const twitterSocial = socials.find((s: any) => s.source === 'x_twitter' || s.source === 'twitter' || s.source === 'x');
    const githubSocial = socials.find((s: any) => s.source === 'github');
    const linkedinSocial = socials.find((s: any) => s.source === 'linkedin');
    
    // Extract tags/skills
    const tags = profile.tags || [];
    const skills = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : []);
    
    // Convert projects to milestones
    const projects = additionalData?.projects?.projects || [];
    const milestones = projects.map((project: any, index: number) => ({
      id: project.id || project.slug || `project-${index}`,
      title: project.name || project.title || 'Project',
      description: project.description,
      date: project.created_at || project.created_date || new Date().toISOString(),
      type: 'project' as const,
      verified: project.verified || false,
    }));
    
    // Map fields according to API v3 structure
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
      tokenId: profile.talent_token?.id || profile.token?.id,
      tokenSymbol: profile.talent_token?.symbol || profile.token?.symbol,
      tokenName: profile.talent_token?.name || profile.token?.name,
      totalSupply: profile.talent_token?.total_supply?.toString() || profile.token?.total_supply?.toString(),
      tokenPrice: profile.talent_token?.current_price?.toString() || profile.token?.current_price?.toString(),
      tokenBalance: profile.token_balance?.toString() || profile.talent_token?.balance?.toString(),
      supporterCount: profile.supporter_count || profile.supporters_count || profile.supporters?.length || 0,
      totalRaised: profile.total_raised?.toString() || profile.raised_amount?.toString(),
      builderScore: builderScore,
      builderScoreLevel: builderScoreLevel,
      skills: skills.length > 0 ? skills : undefined,
      milestones: milestones.length > 0 ? milestones : undefined,
      verified: profile.human_checkmark || profile.verified || profile.is_verified || false,
      verifiedAt: profile.verified_at || profile.verified_date || profile.human_checkmark_verified_at,
      createdAt: profile.created_at || profile.created_date,
      updatedAt: profile.updated_at || profile.updated_date,
    };
    
    // Validate that we have at least an ID
    if (!mappedProfile.id) {
      console.warn('[Talent Protocol] Profile without valid ID:', profile);
      return null;
    }
    
    console.log('[Talent Protocol] Profile mapped successfully:', {
      id: mappedProfile.id,
      username: mappedProfile.username,
      name: mappedProfile.name,
      verified: mappedProfile.verified,
      builderScore: mappedProfile.builderScore,
    });
    
    return mappedProfile;
  } catch (error) {
    console.error('[Talent Protocol] Error mapping response:', error);
    return null;
  }
}

/**
 * Fetch user profile from Talent Protocol using REST API v3
 * 
 * @param address - Wallet address of the user
 * @returns Profile data or null if not found
 */
export async function fetchTalentProtocolProfile(
  address: string
): Promise<TalentProtocolResponse> {
  try {
    const normalizedAddress = address.toLowerCase();
    console.log('[Talent Protocol] Fetching profile for:', normalizedAddress);
    
    // Method 1: Get profile directly by wallet address
    const profileUrl = `${BASE_URL}/profile?id=${encodeURIComponent(normalizedAddress)}`;
    
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });

    let profileData: any = null;
    
    if (profileResponse.ok) {
      profileData = await profileResponse.json() as any;
      
      if (profileData.profile) {
        console.log('[Talent Protocol] Profile found, fetching additional data...');
        // Fetch additional data in parallel
        const [scoreData, accountsData, socialsData, projectsData] = await Promise.all([
          fetchScore(normalizedAddress),
          fetchAccounts(normalizedAddress),
          fetchSocials(normalizedAddress),
          fetchProjects(normalizedAddress),
        ]);
        
        const mappedProfile = mapTalentProtocolResponse(profileData, normalizedAddress, {
          score: scoreData,
          accounts: accountsData,
          socials: socialsData,
          projects: projectsData,
        });
        
        if (mappedProfile) {
          return {
            success: true,
            profile: mappedProfile,
          };
        }
      }
    } else {
      const errorText = await profileResponse.text();
      console.warn(`[Talent Protocol] Profile API error (${profileResponse.status}):`, errorText);
    }

    // Method 2: Try advanced search if direct profile lookup failed
    console.log('[Talent Protocol] Trying advanced search...');
    
    const searchQuery = {
      query: {
        walletAddresses: [normalizedAddress],
        exactMatch: true,
      },
      sort: {
        id: {
          order: 'desc',
        },
      },
      page: 1,
      per_page: 1,
    };

    const queryString = Object.keys(searchQuery)
      .map(key => `${key}=${encodeURIComponent(JSON.stringify(searchQuery[key as keyof typeof searchQuery]))}`)
      .join('&');

    const searchUrl = `${BASE_URL}/search/advanced/profiles?${queryString}`;
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json() as any;
      
      if (searchData.profiles && searchData.profiles.length > 0) {
        const profile = searchData.profiles[0];
        // Fetch additional data
        const [scoreData, accountsData, socialsData, projectsData] = await Promise.all([
          fetchScore(normalizedAddress),
          fetchAccounts(normalizedAddress),
          fetchSocials(normalizedAddress),
          fetchProjects(normalizedAddress),
        ]);
        
        const mappedProfile = mapTalentProtocolResponse({ profile }, normalizedAddress, {
          score: scoreData,
          accounts: accountsData,
          socials: socialsData,
          projects: projectsData,
        });
        
        if (mappedProfile) {
          return {
            success: true,
            profile: mappedProfile,
          };
        }
      }
    } else {
      const errorText = await searchResponse.text();
      console.warn(`[Talent Protocol] Search API error (${searchResponse.status}):`, errorText);
    }
    
    console.log('[Talent Protocol] No profile found for address:', normalizedAddress);
    return {
      success: true,
      profile: null,
    };
  } catch (error: any) {
    console.error('[Talent Protocol] Error fetching profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch Talent Protocol profile',
    };
  }
}

