'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { ProjectsFilters } from '@/components/projects/ProjectsFilters';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  coverImage?: string;
  hackathonId: string;
  trackId?: string;
  demoUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  techStack: string[];
  finalScore?: number;
  rank?: number;
  prizeWon?: number;
  status: string;
  submittedAt?: string;
  creator: {
    id: string;
    walletAddress: string;
    username?: string;
  };
  hackathon: {
    id: string;
    name: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    hackathonId: '',
    status: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    // TODO: Reemplazar con llamada real a la API
    // Por ahora usamos datos mock
    const mockProjects: Project[] = [
      {
        id: '1',
        slug: 'decentralized-finance-platform',
        name: 'DeFi Yield Optimizer',
        tagline: 'Maximize your DeFi yields across multiple protocols',
        description: 'A comprehensive DeFi platform that automatically optimizes yield farming strategies across Ethereum, Arbitrum, and Base networks.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '1',
        techStack: ['Solidity', 'React', 'TypeScript', 'Ethers.js'],
        finalScore: 95.5,
        rank: 1,
        prizeWon: 50000,
        status: 'WINNER',
        submittedAt: '2024-11-01T10:00:00Z',
        creator: {
          id: '1',
          walletAddress: '0x1234567890123456789012345678901234567890',
          username: 'cryptodev',
        },
        hackathon: {
          id: '1',
          name: 'Web3 Africa Hackathon 2024',
        },
      },
      {
        id: '2',
        slug: 'nft-marketplace-africa',
        name: 'AfriNFT Marketplace',
        tagline: 'Empowering African artists in the digital economy',
        description: 'A decentralized NFT marketplace focused on showcasing African art and culture, with built-in royalty mechanisms and cross-chain support.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '1',
        techStack: ['Next.js', 'IPFS', 'Web3.js', 'Polygon'],
        finalScore: 92.3,
        rank: 2,
        prizeWon: 30000,
        status: 'WINNER',
        submittedAt: '2024-11-01T11:00:00Z',
        creator: {
          id: '2',
          walletAddress: '0x2345678901234567890123456789012345678901',
          username: 'artblockchain',
        },
        hackathon: {
          id: '1',
          name: 'Web3 Africa Hackathon 2024',
        },
      },
      {
        id: '3',
        slug: 'dao-governance-tool',
        name: 'DAO Governance Suite',
        tagline: 'Streamlined governance for decentralized organizations',
        description: 'A comprehensive governance platform for DAOs with voting mechanisms, proposal management, and treasury oversight.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '2',
        techStack: ['Vue.js', 'Solidity', 'GraphQL', 'The Graph'],
        finalScore: 88.7,
        rank: 3,
        prizeWon: 20000,
        status: 'WINNER',
        submittedAt: '2024-10-28T14:00:00Z',
        creator: {
          id: '3',
          walletAddress: '0x3456789012345678901234567890123456789012',
          username: 'daobuilder',
        },
        hackathon: {
          id: '2',
          name: 'Base Ecosystem Hackathon',
        },
      },
      {
        id: '4',
        slug: 'cross-chain-bridge',
        name: 'Cross-Chain Bridge Pro',
        tagline: 'Seamless asset transfers across all EVM chains',
        description: 'A user-friendly bridge protocol enabling fast and secure transfers between Arbitrum, Base, and Optimism networks.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '2',
        techStack: ['React', 'Solidity', 'Hardhat', 'Chainlink'],
        finalScore: 87.2,
        rank: 4,
        prizeWon: 15000,
        status: 'APPROVED',
        submittedAt: '2024-10-27T09:00:00Z',
        creator: {
          id: '4',
          walletAddress: '0x4567890123456789012345678901234567890123',
          username: 'bridgebuilder',
        },
        hackathon: {
          id: '2',
          name: 'Base Ecosystem Hackathon',
        },
      },
      {
        id: '5',
        slug: 'smart-wallet-africa',
        name: 'Smart Wallet for Africa',
        tagline: 'Banking the unbanked with Web3 technology',
        description: 'A mobile-first smart wallet solution designed for low-bandwidth environments, enabling financial inclusion across Africa.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '1',
        techStack: ['Flutter', 'Solidity', 'IPFS', 'PWA'],
        finalScore: 85.9,
        rank: 5,
        prizeWon: 10000,
        status: 'APPROVED',
        submittedAt: '2024-11-01T08:00:00Z',
        creator: {
          id: '5',
          walletAddress: '0x5678901234567890123456789012345678901234',
          username: 'fintechafrica',
        },
        hackathon: {
          id: '1',
          name: 'Web3 Africa Hackathon 2024',
        },
      },
      {
        id: '6',
        slug: 'carbon-credit-marketplace',
        name: 'Carbon Credit Marketplace',
        tagline: 'Tokenizing carbon credits for transparent climate action',
        description: 'A blockchain-based marketplace for buying and selling carbon credits, with full transparency and verification.',
        coverImage: '/placeholder-project.jpg',
        hackathonId: '3',
        techStack: ['Next.js', 'Solidity', 'Chainlink', 'OpenZeppelin'],
        status: 'UNDER_REVIEW',
        submittedAt: '2024-11-03T16:00:00Z',
        creator: {
          id: '6',
          walletAddress: '0x6789012345678901234567890123456789012345',
          username: 'climatechain',
        },
        hackathon: {
          id: '3',
          name: 'Climate Tech Hackathon',
        },
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.tagline?.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.techStack.some((tech) => tech.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por hackathon
    if (filters.hackathonId) {
      filtered = filtered.filter((project) => project.hackathonId === filters.hackathonId);
    }

    // Filtrar por status
    if (filters.status) {
      filtered = filtered.filter((project) => project.status === filters.status);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
        case 'oldest':
          return new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
        case 'score':
          return (b.finalScore || 0) - (a.finalScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, filters]);

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <ProjectsHero />
      <ProjectsFilters filters={filters} onFiltersChange={setFilters} />
      <ProjectsGrid projects={filteredProjects} loading={loading} />
      <Footer />
    </main>
  );
}

