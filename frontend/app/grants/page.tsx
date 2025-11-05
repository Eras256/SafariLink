'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { GrantsHero } from '@/components/grants/GrantsHero';
import { GrantsFilters } from '@/components/grants/GrantsFilters';
import { GrantsGrid } from '@/components/grants/GrantsGrid';

export interface Grant {
  id: string;
  userId: string;
  projectId: string;
  grantProgram: string;
  amountRequested: number;
  amountApproved?: number;
  proposal: string;
  milestones: Array<{
    title: string;
    description: string;
    deadline: string;
    amount: number;
  }>;
  budget: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  status: string;
  submittedAt?: string;
  decidedAt?: string;
  createdAt: string;
  user: {
    id: string;
    walletAddress: string;
    username?: string;
  };
  project: {
    id: string;
    slug: string;
    name: string;
    tagline?: string;
    coverImage?: string;
    hackathon: {
      id: string;
      name: string;
    };
  };
}

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    grantProgram: '',
    status: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    // TODO: Reemplazar con llamada real a la API
    // Por ahora usamos datos mock
    const mockGrants: Grant[] = [
      {
        id: '1',
        userId: '1',
        projectId: '1',
        grantProgram: 'Arbitrum Foundation',
        amountRequested: 50000,
        amountApproved: 45000,
        proposal: 'We propose to expand our DeFi Yield Optimizer platform to support Arbitrum One, bringing advanced yield optimization strategies to the Arbitrum ecosystem. This will enable users to maximize returns across multiple DeFi protocols on Arbitrum.',
        milestones: [
          {
            title: 'Smart Contract Development',
            description: 'Develop and audit smart contracts for Arbitrum integration',
            deadline: '2025-01-15',
            amount: 20000,
          },
          {
            title: 'Frontend Integration',
            description: 'Build user interface for Arbitrum protocol support',
            deadline: '2025-02-15',
            amount: 15000,
          },
          {
            title: 'Testing & Launch',
            description: 'Comprehensive testing and mainnet deployment',
            deadline: '2025-03-01',
            amount: 10000,
          },
        ],
        budget: [
          { category: 'Development', amount: 30000, description: 'Core development team' },
          { category: 'Security Audit', amount: 10000, description: 'Smart contract audit' },
          { category: 'Marketing', amount: 5000, description: 'Community outreach' },
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
        proposal: 'AfriNFT Marketplace aims to onboard 1000+ African artists to the NFT space, creating sustainable income streams and preserving cultural heritage through blockchain technology. We will integrate with Optimism for low-cost transactions and build educational resources.',
        milestones: [
          {
            title: 'Artist Onboarding Program',
            description: 'Recruit and onboard 500+ African artists',
            deadline: '2025-02-01',
            amount: 30000,
          },
          {
            title: 'Platform Enhancement',
            description: 'Build advanced features for artist tools and analytics',
            deadline: '2025-03-01',
            amount: 25000,
          },
          {
            title: 'Community Building',
            description: 'Establish artist communities and educational programs',
            deadline: '2025-04-01',
            amount: 15000,
          },
        ],
        budget: [
          { category: 'Artist Support', amount: 35000, description: 'Artist grants and onboarding' },
          { category: 'Development', amount: 25000, description: 'Platform development' },
          { category: 'Marketing', amount: 15000, description: 'Community growth' },
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
        proposal: 'DAO Governance Suite will provide comprehensive governance tools for Base ecosystem DAOs, including voting mechanisms, proposal management, and treasury oversight. We aim to make DAO governance more accessible and efficient.',
        milestones: [
          {
            title: 'Core Platform Development',
            description: 'Build core governance platform features',
            deadline: '2025-01-31',
            amount: 25000,
          },
          {
            title: 'Integration with Base',
            description: 'Integrate Base-specific features and optimizations',
            deadline: '2025-02-28',
            amount: 20000,
          },
          {
            title: 'DAO Onboarding',
            description: 'Onboard first 10 DAOs to the platform',
            deadline: '2025-03-31',
            amount: 15000,
          },
        ],
        budget: [
          { category: 'Development', amount: 35000, description: 'Core development' },
          { category: 'Integration', amount: 15000, description: 'Base integration' },
          { category: 'Operations', amount: 10000, description: 'DAO onboarding support' },
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
        proposal: 'Cross-Chain Bridge Pro will enable seamless asset transfers between Arbitrum, Base, and Optimism. We focus on user experience, security, and low transaction costs.',
        milestones: [
          {
            title: 'Bridge Protocol Development',
            description: 'Develop secure cross-chain bridge protocol',
            deadline: '2025-01-20',
            amount: 20000,
          },
          {
            title: 'Security Audit',
            description: 'Comprehensive security audit by leading firm',
            deadline: '2025-02-10',
            amount: 10000,
          },
          {
            title: 'Mainnet Launch',
            description: 'Launch on mainnet with multi-chain support',
            deadline: '2025-03-01',
            amount: 10000,
          },
        ],
        budget: [
          { category: 'Development', amount: 25000, description: 'Protocol development' },
          { category: 'Security', amount: 10000, description: 'Security audit' },
          { category: 'Infrastructure', amount: 5000, description: 'Infrastructure setup' },
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
        proposal: 'Smart Wallet for Africa will provide financial inclusion to millions of unbanked individuals across Africa. Using Optimism for low-cost transactions, we will build a mobile-first wallet optimized for low-bandwidth environments.',
        milestones: [
          {
            title: 'Wallet Development',
            description: 'Build core wallet functionality',
            deadline: '2025-02-15',
            amount: 35000,
          },
          {
            title: 'Optimism Integration',
            description: 'Integrate Optimism for low-cost transactions',
            deadline: '2025-03-15',
            amount: 25000,
          },
          {
            title: 'Pilot Launch',
            description: 'Launch pilot in 3 African countries',
            deadline: '2025-04-30',
            amount: 20000,
          },
        ],
        budget: [
          { category: 'Development', amount: 40000, description: 'Core development' },
          { category: 'Infrastructure', amount: 20000, description: 'Infrastructure and scaling' },
          { category: 'Pilot Program', amount: 20000, description: 'Pilot launch support' },
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

    setTimeout(() => {
      setGrants(mockGrants);
      setFilteredGrants(mockGrants);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...grants];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (grant) =>
          grant.project.name.toLowerCase().includes(searchLower) ||
          grant.project.tagline?.toLowerCase().includes(searchLower) ||
          grant.proposal.toLowerCase().includes(searchLower) ||
          grant.grantProgram.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por programa de grant
    if (filters.grantProgram) {
      filtered = filtered.filter((grant) => grant.grantProgram === filters.grantProgram);
    }

    // Filtrar por status
    if (filters.status) {
      filtered = filtered.filter((grant) => grant.status === filters.status);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount':
          return b.amountRequested - a.amountRequested;
        case 'program':
          return a.grantProgram.localeCompare(b.grantProgram);
        default:
          return 0;
      }
    });

    setFilteredGrants(filtered);
  }, [grants, filters]);

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <GrantsHero />
      <GrantsFilters filters={filters} onFiltersChange={setFilters} grants={grants} />
      <GrantsGrid grants={filteredGrants} loading={loading} />
      <Footer />
    </main>
  );
}

