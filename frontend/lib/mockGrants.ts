import { Grant } from '@/app/grants/page';

export const mockGrants: Grant[] = [
  {
    id: '1',
    userId: '1',
    projectId: '1',
    grantProgram: 'Arbitrum Foundation',
    amountRequested: 50000,
    amountApproved: 45000,
    proposal: 'We propose to expand our DeFi Yield Optimizer platform to support Arbitrum One, bringing advanced yield optimization strategies to the Arbitrum ecosystem. This will enable users to maximize returns across multiple DeFi protocols on Arbitrum. Our platform will integrate seamlessly with existing Arbitrum DeFi protocols and provide users with automated yield optimization strategies.',
    milestones: [
      {
        title: 'Smart Contract Development',
        description: 'Develop and audit smart contracts for Arbitrum integration. This includes creating optimized yield farming strategies specific to Arbitrum protocols.',
        deadline: '2025-01-15',
        amount: 20000,
      },
      {
        title: 'Frontend Integration',
        description: 'Build user interface for Arbitrum protocol support. Create intuitive dashboards for users to monitor and manage their yield strategies.',
        deadline: '2025-02-15',
        amount: 15000,
      },
      {
        title: 'Testing & Launch',
        description: 'Comprehensive testing and mainnet deployment. Ensure all security measures are in place before public launch.',
        deadline: '2025-03-01',
        amount: 10000,
      },
    ],
    budget: [
      { category: 'Development', amount: 30000, description: 'Core development team salaries and tools' },
      { category: 'Security Audit', amount: 10000, description: 'Smart contract audit by leading security firm' },
      { category: 'Marketing', amount: 5000, description: 'Community outreach and platform promotion' },
      { category: 'Infrastructure', amount: 5000, description: 'Server costs and infrastructure setup' },
    ],
    status: 'APPROVED',
    submittedAt: '2024-11-01T10:00:00Z',
    decidedAt: '2024-11-15T14:00:00Z',
    createdAt: '2024-10-28T09:00:00Z',
    user: {
      id: '1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      username: 'cryptodev',
    },
    project: {
      id: '1',
      slug: 'decentralized-finance-platform',
      name: 'DeFi Yield Optimizer',
      tagline: 'Maximize your DeFi yields across multiple protocols',
      coverImage: '/placeholder-project.jpg',
      hackathon: {
        id: '1',
        name: 'Web3 Africa Hackathon 2024',
      },
    },
  },
  {
    id: '2',
    userId: '2',
    projectId: '2',
    grantProgram: 'Optimism RetroPGF',
    amountRequested: 75000,
    amountApproved: 70000,
    proposal: 'AfriNFT Marketplace aims to onboard 1000+ African artists to the NFT space, creating sustainable income streams and preserving cultural heritage through blockchain technology. We will integrate with Optimism for low-cost transactions and build educational resources to help artists navigate the Web3 space. Our platform will feature royalty mechanisms, cross-chain support, and a focus on showcasing authentic African art and culture.',
    milestones: [
      {
        title: 'Artist Onboarding Program',
        description: 'Recruit and onboard 500+ African artists. Provide training and resources to help artists create and mint their first NFTs.',
        deadline: '2025-02-01',
        amount: 30000,
      },
      {
        title: 'Platform Enhancement',
        description: 'Build advanced features for artist tools and analytics. Create dashboards for artists to track sales and manage their collections.',
        deadline: '2025-03-01',
        amount: 25000,
      },
      {
        title: 'Community Building',
        description: 'Establish artist communities and educational programs. Host workshops and events to grow the African NFT community.',
        deadline: '2025-04-01',
        amount: 15000,
      },
    ],
    budget: [
      { category: 'Artist Support', amount: 35000, description: 'Artist grants and onboarding programs' },
      { category: 'Development', amount: 25000, description: 'Platform development and feature enhancements' },
      { category: 'Marketing', amount: 15000, description: 'Community growth and marketing initiatives' },
    ],
    status: 'APPROVED',
    submittedAt: '2024-11-02T11:00:00Z',
    decidedAt: '2024-11-18T16:00:00Z',
    createdAt: '2024-10-30T10:00:00Z',
    user: {
      id: '2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      username: 'artblockchain',
    },
    project: {
      id: '2',
      slug: 'nft-marketplace-africa',
      name: 'AfriNFT Marketplace',
      tagline: 'Empowering African artists in the digital economy',
      coverImage: '/placeholder-project.jpg',
      hackathon: {
        id: '1',
        name: 'Web3 Africa Hackathon 2024',
      },
    },
  },
  {
    id: '3',
    userId: '3',
    projectId: '3',
    grantProgram: 'Base Ecosystem Fund',
    amountRequested: 60000,
    proposal: 'DAO Governance Suite will provide comprehensive governance tools for Base ecosystem DAOs, including voting mechanisms, proposal management, and treasury oversight. We aim to make DAO governance more accessible and efficient. Our platform will integrate seamlessly with Base and provide tools for proposal creation, voting, and execution.',
    milestones: [
      {
        title: 'Core Platform Development',
        description: 'Build core governance platform features including proposal creation, voting mechanisms, and treasury management.',
        deadline: '2025-01-31',
        amount: 25000,
      },
      {
        title: 'Integration with Base',
        description: 'Integrate Base-specific features and optimizations. Ensure seamless interaction with Base ecosystem protocols.',
        deadline: '2025-02-28',
        amount: 20000,
      },
      {
        title: 'DAO Onboarding',
        description: 'Onboard first 10 DAOs to the platform. Provide support and training to ensure successful adoption.',
        deadline: '2025-03-31',
        amount: 15000,
      },
    ],
    budget: [
      { category: 'Development', amount: 35000, description: 'Core development and platform features' },
      { category: 'Integration', amount: 15000, description: 'Base integration and ecosystem support' },
      { category: 'Operations', amount: 10000, description: 'DAO onboarding support and training' },
    ],
    status: 'UNDER_REVIEW',
    submittedAt: '2024-11-05T09:00:00Z',
    createdAt: '2024-11-01T14:00:00Z',
    user: {
      id: '3',
      walletAddress: '0x3456789012345678901234567890123456789012',
      username: 'daobuilder',
    },
    project: {
      id: '3',
      slug: 'dao-governance-tool',
      name: 'DAO Governance Suite',
      tagline: 'Streamlined governance for decentralized organizations',
      coverImage: '/placeholder-project.jpg',
      hackathon: {
        id: '2',
        name: 'Base Ecosystem Hackathon',
      },
    },
  },
  {
    id: '4',
    userId: '4',
    projectId: '4',
    grantProgram: 'Arbitrum Foundation',
    amountRequested: 40000,
    proposal: 'Cross-Chain Bridge Pro will enable seamless asset transfers between Arbitrum, Base, and Optimism. We focus on user experience, security, and low transaction costs. Our bridge will use advanced security mechanisms and provide a simple interface for users to transfer assets across chains.',
    milestones: [
      {
        title: 'Bridge Protocol Development',
        description: 'Develop secure cross-chain bridge protocol with multi-chain support. Implement security measures and testing procedures.',
        deadline: '2025-01-20',
        amount: 20000,
      },
      {
        title: 'Security Audit',
        description: 'Comprehensive security audit by leading firm. Ensure all smart contracts are secure and ready for mainnet deployment.',
        deadline: '2025-02-10',
        amount: 10000,
      },
      {
        title: 'Mainnet Launch',
        description: 'Launch on mainnet with multi-chain support. Ensure smooth user experience and monitor for any issues.',
        deadline: '2025-03-01',
        amount: 10000,
      },
    ],
    budget: [
      { category: 'Development', amount: 25000, description: 'Protocol development and implementation' },
      { category: 'Security', amount: 10000, description: 'Security audit and testing' },
      { category: 'Infrastructure', amount: 5000, description: 'Infrastructure setup and maintenance' },
    ],
    status: 'SUBMITTED',
    submittedAt: '2024-11-10T10:00:00Z',
    createdAt: '2024-11-05T08:00:00Z',
    user: {
      id: '4',
      walletAddress: '0x4567890123456789012345678901234567890123',
      username: 'bridgebuilder',
    },
    project: {
      id: '4',
      slug: 'cross-chain-bridge',
      name: 'Cross-Chain Bridge Pro',
      tagline: 'Seamless asset transfers across all EVM chains',
      coverImage: '/placeholder-project.jpg',
      hackathon: {
        id: '2',
        name: 'Base Ecosystem Hackathon',
      },
    },
  },
  {
    id: '5',
    userId: '5',
    projectId: '5',
    grantProgram: 'Optimism RetroPGF',
    amountRequested: 80000,
    proposal: 'Smart Wallet for Africa will provide financial inclusion to millions of unbanked individuals across Africa. Using Optimism for low-cost transactions, we will build a mobile-first wallet optimized for low-bandwidth environments. Our wallet will support multiple African currencies and provide easy access to DeFi services.',
    milestones: [
      {
        title: 'Wallet Development',
        description: 'Build core wallet functionality with support for multiple African currencies. Ensure offline capabilities and low data usage.',
        deadline: '2025-02-15',
        amount: 35000,
      },
      {
        title: 'Optimism Integration',
        description: 'Integrate Optimism for low-cost transactions. Ensure seamless user experience for sending and receiving funds.',
        deadline: '2025-03-15',
        amount: 25000,
      },
      {
        title: 'Pilot Launch',
        description: 'Launch pilot in 3 African countries. Gather user feedback and iterate on the product based on real-world usage.',
        deadline: '2025-04-30',
        amount: 20000,
      },
    ],
    budget: [
      { category: 'Development', amount: 40000, description: 'Core wallet development and features' },
      { category: 'Infrastructure', amount: 20000, description: 'Infrastructure and scaling for African markets' },
      { category: 'Pilot Program', amount: 20000, description: 'Pilot launch support and user acquisition' },
    ],
    status: 'DRAFT',
    createdAt: '2024-11-08T12:00:00Z',
    user: {
      id: '5',
      walletAddress: '0x5678901234567890123456789012345678901234',
      username: 'fintechafrica',
    },
    project: {
      id: '5',
      slug: 'smart-wallet-africa',
      name: 'Smart Wallet for Africa',
      tagline: 'Banking the unbanked with Web3 technology',
      coverImage: '/placeholder-project.jpg',
      hackathon: {
        id: '1',
        name: 'Web3 Africa Hackathon 2024',
      },
    },
  },
];

// Generate slug from project name for URL-friendly routing
function generateSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findMockGrantById(id: string): Grant | undefined {
  return mockGrants.find((grant) => grant.id === id);
}

export function findMockGrantByProjectSlug(slug: string): Grant | undefined {
  return mockGrants.find((grant) => grant.project.slug === slug);
}

