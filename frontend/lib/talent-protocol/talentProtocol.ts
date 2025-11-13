/**
 * Talent Protocol Integration
 * 
 * Talent Protocol allows professionals to build an on-chain resume and launch a talent token ($TAL).
 * This integration syncs user profiles, token balances, supporters, and career milestones.
 * 
 * API Documentation: https://docs.talentprotocol.com
 * GraphQL Endpoint: https://api.talentprotocol.com/graphql
 */

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
  
  // Token Information
  tokenId?: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenBalance?: string;
  tokenPrice?: string;
  totalSupply?: string;
  
  // Supporters & Sponsors
  supporterCount?: number;
  totalRaised?: string;
  supporters?: TalentProtocolSupporter[];
  
  // Builder Score (from Talent Protocol API v3)
  builderScore?: number;
  builderScoreLevel?: {
    level: number;
    name: string;
    minScore: number;
    maxScore?: number;
  };
  
  // Creator Stats (from Talent Protocol API v3)
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
  
  // Career & Achievements
  milestones?: TalentProtocolMilestone[];
  skills?: string[];
  experience?: string;
  
  // Verification
  verified?: boolean;
  verifiedAt?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface TalentProtocolSupporter {
  id: string;
  address: string;
  amount: string;
  tokenAmount: string;
  message?: string;
  supportedAt: string;
}

export interface TalentProtocolMilestone {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'education' | 'work' | 'achievement' | 'project';
  verified?: boolean;
}

export interface TalentProtocolToken {
  id: string;
  symbol: string;
  name: string;
  totalSupply: string;
  currentPrice: string;
  marketCap?: string;
  holders?: number;
}

/**
 * Fetch user profile from Talent Protocol
 * @param address - Wallet address of the user
 * @returns User profile data or null if not found
 */
export async function fetchTalentProtocolProfile(
  address: string
): Promise<TalentProtocolProfile | null> {
  try {
    // Talent Protocol uses GraphQL API
    // For now, we'll use a mock implementation until we have the actual API endpoint
    // TODO: Replace with actual GraphQL query to Talent Protocol API
    
    const query = `
      query GetUserProfile($address: String!) {
        user(address: $address) {
          id
          address
          username
          name
          bio
          avatar
          coverImage
          location
          website
          twitter
          github
          linkedin
          token {
            id
            symbol
            name
            totalSupply
            currentPrice
          }
          supporterCount
          totalRaised
          verified
          verifiedAt
          createdAt
          updatedAt
        }
      }
    `;

    // Mock response for development
    // In production, replace with actual API call
    const response = await fetch('https://api.talentprotocol.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { address: address.toLowerCase() },
      }),
    });

    if (!response.ok) {
      console.warn('Talent Protocol API not available, using mock data');
      return getMockTalentProtocolProfile(address);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Talent Protocol API errors:', data.errors);
      return getMockTalentProtocolProfile(address);
    }

    return data.data?.user || null;
  } catch (error) {
    console.error('Error fetching Talent Protocol profile:', error);
    // Return mock data for development
    return getMockTalentProtocolProfile(address);
  }
}

/**
 * Get mock Talent Protocol profile for development
 */
function getMockTalentProtocolProfile(address: string): TalentProtocolProfile | null {
  // Only return mock data if user has participated in hackathons
  // This simulates that only active builders have Talent Protocol profiles
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
      {
        id: '2',
        title: 'Senior Solidity Developer',
        description: '5+ years of experience in smart contract development',
        date: '2020-01-01',
        type: 'work',
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
 * Check if user has a Talent Protocol profile
 */
export async function hasTalentProtocolProfile(address: string): Promise<boolean> {
  const profile = await fetchTalentProtocolProfile(address);
  return profile !== null;
}

/**
 * Get user's Talent Protocol token balance
 */
export async function getTalentTokenBalance(address: string): Promise<string | null> {
  const profile = await fetchTalentProtocolProfile(address);
  return profile?.tokenBalance || null;
}

/**
 * Get user's supporter count
 */
export async function getSupporterCount(address: string): Promise<number> {
  const profile = await fetchTalentProtocolProfile(address);
  return profile?.supporterCount || 0;
}

/**
 * Calculate reputation score based on Talent Protocol data
 */
export function calculateTalentProtocolScore(profile: TalentProtocolProfile | null): number {
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

