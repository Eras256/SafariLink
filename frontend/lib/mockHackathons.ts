// Mock hackathon data - used as fallback when API is unavailable
// This should match the structure from app/hackathons/page.tsx

export interface MockHackathon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  bannerImage?: string;
  logoImage?: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerWallet: string;
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  eventEnd: string;
  submissionDeadline: string;
  judgingStart: string;
  judgingEnd: string;
  winnersAnnounced?: string;
  locationType: 'IN_PERSON' | 'HYBRID' | 'ONLINE';
  location?: string;
  isOnline: boolean;
  chains: string[];
  totalPrizePool: number;
  currency: string;
  prizeDistribution: {
    first: number;
    second: number;
    third: number;
    [key: string]: number;
  };
  maxParticipants?: number;
  requiresApproval: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  status: string;
  tags: string[];
  sponsors: Array<{
    name: string;
    logo?: string;
    website?: string;
  }>;
  judges: Array<{
    name: string;
    role?: string;
    avatar?: string;
  }>;
  participantCount: number;
  projectCount: number;
  createdAt: string;
}

export const mockHackathons: MockHackathon[] = [
  {
    id: '1',
    slug: 'web3-africa-hackathon-2024',
    name: 'Web3 Africa Hackathon 2024',
    tagline: 'Building the Future of Web3 in Africa',
    description:
      'Join Africa\'s largest Web3 hackathon focused on DeFi, NFTs, and infrastructure solutions. Build innovative projects that solve real-world problems in African markets.',
    bannerImage: '/placeholder-hackathon.jpg',
    logoImage: '/placeholder-logo.jpg',
    organizerId: '1',
    organizerName: 'Web3 Africa Foundation',
    organizerEmail: 'contact@web3africa.org',
    organizerWallet: '0x1234567890123456789012345678901234567890',
    registrationStart: '2024-10-01T00:00:00Z',
    registrationEnd: '2024-10-31T23:59:59Z',
    eventStart: '2024-11-05T09:00:00Z',
    eventEnd: '2024-11-07T18:00:00Z',
    submissionDeadline: '2024-11-07T17:00:00Z',
    judgingStart: '2024-11-08T09:00:00Z',
    judgingEnd: '2024-11-10T18:00:00Z',
    winnersAnnounced: '2024-11-11T12:00:00Z',
    locationType: 'HYBRID',
    location: 'Lagos, Nigeria + Online',
    isOnline: true,
    chains: ['arbitrum', 'base', 'optimism'],
    totalPrizePool: 500000,
    currency: 'USDC',
    prizeDistribution: {
      first: 100000,
      second: 75000,
      third: 50000,
      track1: 50000,
      track2: 50000,
      track3: 50000,
      community: 125000,
    },
    maxParticipants: 500,
    requiresApproval: false,
    minTeamSize: 1,
    maxTeamSize: 5,
    status: 'ONGOING',
    tags: ['DeFi', 'NFT', 'Infrastructure', 'Africa'],
    sponsors: [
      { name: 'Arbitrum Foundation', logo: '/arbitrum-logo.png' },
      { name: 'Base', logo: '/base-logo.png' },
      { name: 'Optimism', logo: '/optimism-logo.png' },
    ],
    judges: [
      { name: 'Dr. Aisha Bello', role: 'DeFi Expert', avatar: '/judge1.jpg' },
      { name: 'John Doe', role: 'Blockchain Architect', avatar: '/judge2.jpg' },
    ],
    participantCount: 450,
    projectCount: 125,
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: '2',
    slug: 'base-ecosystem-hackathon',
    name: 'Base Ecosystem Hackathon',
    tagline: 'Build on Base, Scale Globally',
    description:
      'A focused hackathon for building on Base network. Create innovative dApps, explore new use cases, and compete for prizes in multiple tracks.',
    bannerImage: '/placeholder-hackathon.jpg',
    logoImage: '/placeholder-logo.jpg',
    organizerId: '2',
    organizerName: 'Base Community',
    organizerEmail: 'hackathon@base.org',
    organizerWallet: '0x2345678901234567890123456789012345678901',
    registrationStart: '2024-09-15T00:00:00Z',
    registrationEnd: '2024-10-15T23:59:59Z',
    eventStart: '2024-10-20T09:00:00Z',
    eventEnd: '2024-10-22T18:00:00Z',
    submissionDeadline: '2024-10-22T17:00:00Z',
    judgingStart: '2024-10-23T09:00:00Z',
    judgingEnd: '2024-10-25T18:00:00Z',
    winnersAnnounced: '2024-10-26T12:00:00Z',
    locationType: 'ONLINE',
    location: 'Virtual Event',
    isOnline: true,
    chains: ['base'],
    totalPrizePool: 300000,
    currency: 'USDC',
    prizeDistribution: {
      first: 75000,
      second: 50000,
      third: 30000,
      track1: 40000,
      track2: 40000,
      track3: 40000,
      community: 25000,
    },
    maxParticipants: 300,
    requiresApproval: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    status: 'COMPLETED',
    tags: ['Base', 'dApps', 'Onchain', 'L2'],
    sponsors: [{ name: 'Base', logo: '/base-logo.png' }],
    judges: [
      { name: 'Base Team', role: 'Core Team', avatar: '/judge3.jpg' },
    ],
    participantCount: 280,
    projectCount: 95,
    createdAt: '2024-08-20T10:00:00Z',
  },
  {
    id: '3',
    slug: 'climate-tech-hackathon',
    name: 'Climate Tech Hackathon',
    tagline: 'Blockchain for Climate Action',
    description:
      'Build Web3 solutions for climate change. Focus areas include carbon credits, renewable energy, and sustainable supply chains.',
    bannerImage: '/placeholder-hackathon.jpg',
    logoImage: '/placeholder-logo.jpg',
    organizerId: '3',
    organizerName: 'ClimateDAO',
    organizerEmail: 'info@climatedao.org',
    organizerWallet: '0x3456789012345678901234567890123456789012',
    registrationStart: '2024-11-10T00:00:00Z',
    registrationEnd: '2024-12-10T23:59:59Z',
    eventStart: '2024-12-15T09:00:00Z',
    eventEnd: '2024-12-17T18:00:00Z',
    submissionDeadline: '2024-12-17T17:00:00Z',
    judgingStart: '2024-12-18T09:00:00Z',
    judgingEnd: '2024-12-20T18:00:00Z',
    locationType: 'HYBRID',
    location: 'Nairobi, Kenya + Online',
    isOnline: true,
    chains: ['arbitrum', 'base'],
    totalPrizePool: 250000,
    currency: 'USDC',
    prizeDistribution: {
      first: 60000,
      second: 40000,
      third: 25000,
      track1: 30000,
      track2: 30000,
      track3: 30000,
      community: 15000,
    },
    maxParticipants: 400,
    requiresApproval: false,
    minTeamSize: 1,
    maxTeamSize: 5,
    status: 'REGISTRATION_OPEN',
    tags: ['Climate', 'Sustainability', 'Carbon', 'Energy'],
    sponsors: [
      { name: 'Arbitrum Foundation', logo: '/arbitrum-logo.png' },
      { name: 'ClimateDAO', logo: '/climatedao-logo.png' },
    ],
    judges: [
      { name: 'Climate Expert', role: 'Environmental Scientist', avatar: '/judge4.jpg' },
    ],
    participantCount: 120,
    projectCount: 0,
    createdAt: '2024-10-25T10:00:00Z',
  },
  {
    id: '4',
    slug: 'defi-innovation-challenge',
    name: 'DeFi Innovation Challenge',
    tagline: 'Pushing DeFi Boundaries',
    description:
      'A technical deep-dive into DeFi protocols. Build innovative yield strategies, lending platforms, and trading protocols.',
    bannerImage: '/placeholder-hackathon.jpg',
    logoImage: '/placeholder-logo.jpg',
    organizerId: '4',
    organizerName: 'DeFi Labs',
    organizerEmail: 'challenge@defilabs.org',
    organizerWallet: '0x4567890123456789012345678901234567890123',
    registrationStart: '2024-10-20T00:00:00Z',
    registrationEnd: '2024-11-20T23:59:59Z',
    eventStart: '2024-11-25T09:00:00Z',
    eventEnd: '2024-11-27T18:00:00Z',
    submissionDeadline: '2024-11-27T17:00:00Z',
    judgingStart: '2024-11-28T09:00:00Z',
    judgingEnd: '2024-11-30T18:00:00Z',
    locationType: 'ONLINE',
    location: 'Virtual Event',
    isOnline: true,
    chains: ['arbitrum', 'optimism'],
    totalPrizePool: 400000,
    currency: 'USDC',
    prizeDistribution: {
      first: 100000,
      second: 75000,
      third: 50000,
      track1: 60000,
      track2: 60000,
      track3: 55000,
    },
    maxParticipants: 350,
    requiresApproval: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    status: 'REGISTRATION_OPEN',
    tags: ['DeFi', 'Yield', 'Lending', 'Trading'],
    sponsors: [
      { name: 'Arbitrum Foundation', logo: '/arbitrum-logo.png' },
      { name: 'Optimism', logo: '/optimism-logo.png' },
    ],
    judges: [
      { name: 'DeFi Expert', role: 'Protocol Architect', avatar: '/judge5.jpg' },
    ],
    participantCount: 85,
    projectCount: 0,
    createdAt: '2024-10-15T10:00:00Z',
  },
  {
    id: '5',
    slug: 'nft-creator-hackathon',
    name: 'NFT Creator Hackathon',
    tagline: 'Empowering Digital Artists',
    description:
      'Build tools and platforms for NFT creators. Focus on marketplace features, royalty mechanisms, and creator-friendly tools.',
    bannerImage: '/placeholder-hackathon.jpg',
    logoImage: '/placeholder-logo.jpg',
    organizerId: '5',
    organizerName: 'NFT Collective',
    organizerEmail: 'hackathon@nftcollective.org',
    organizerWallet: '0x5678901234567890123456789012345678901234',
    registrationStart: '2024-11-15T00:00:00Z',
    registrationEnd: '2024-12-15T23:59:59Z',
    eventStart: '2024-12-20T09:00:00Z',
    eventEnd: '2024-12-22T18:00:00Z',
    submissionDeadline: '2024-12-22T17:00:00Z',
    judgingStart: '2024-12-23T09:00:00Z',
    judgingEnd: '2024-12-25T18:00:00Z',
    locationType: 'IN_PERSON',
    location: 'Cape Town, South Africa',
    isOnline: false,
    chains: ['base', 'arbitrum'],
    totalPrizePool: 200000,
    currency: 'USDC',
    prizeDistribution: {
      first: 50000,
      second: 35000,
      third: 25000,
      track1: 25000,
      track2: 25000,
      track3: 25000,
      community: 15000,
    },
    maxParticipants: 250,
    requiresApproval: false,
    minTeamSize: 1,
    maxTeamSize: 3,
    status: 'REGISTRATION_OPEN',
    tags: ['NFT', 'Art', 'Marketplace', 'Creators'],
    sponsors: [
      { name: 'Base', logo: '/base-logo.png' },
      { name: 'NFT Collective', logo: '/nftcollective-logo.png' },
    ],
    judges: [
      { name: 'Artist Advocate', role: 'NFT Curator', avatar: '/judge6.jpg' },
    ],
    participantCount: 45,
    projectCount: 0,
    createdAt: '2024-11-01T10:00:00Z',
  },
];

/**
 * Find a hackathon by slug in the mock data
 * @param slug - The slug of the hackathon to find
 * @returns The hackathon if found, or null
 */
export function findMockHackathonBySlug(slug: string): MockHackathon | null {
  return mockHackathons.find((h) => h.slug === slug) || null;
}

