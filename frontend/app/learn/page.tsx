'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { LearnHero } from '@/components/learn/LearnHero';
import { LearnCategories } from '@/components/learn/LearnCategories';
import { LessonsGrid } from '@/components/learn/LessonsGrid';
import { LearnFilters } from '@/components/learn/LearnFilters';

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  thumbnail?: string;
  videoUrl?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  views: number;
  rating: number;
  completed?: boolean;
}

export default function LearnPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    sortBy: 'popular',
  });

  useEffect(() => {
    // TODO: Reemplazar con llamada real a la API
    const mockLessons: Lesson[] = [
      {
        id: '1',
        slug: 'solidity-basics',
        title: 'Solidity Fundamentals',
        description: 'Learn the basics of Solidity programming language, including variables, functions, modifiers, and events.',
        category: 'smart-contracts',
        difficulty: 'beginner',
        duration: 45,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Web3 Africa',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Solidity', 'Smart Contracts', 'Ethereum'],
        views: 12500,
        rating: 4.8,
      },
      {
        id: '2',
        slug: 'defi-yield-farming',
        title: 'DeFi Yield Farming Strategies',
        description: 'Master yield farming strategies across multiple DeFi protocols on Arbitrum, Base, and Optimism.',
        category: 'defi',
        difficulty: 'intermediate',
        duration: 60,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'DeFi Expert',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['DeFi', 'Yield Farming', 'Arbitrum', 'Base'],
        views: 8900,
        rating: 4.9,
      },
      {
        id: '3',
        slug: 'nft-marketplace-development',
        title: 'Build an NFT Marketplace',
        description: 'Create a fully functional NFT marketplace from scratch using React, Solidity, and IPFS.',
        category: 'nft',
        difficulty: 'advanced',
        duration: 120,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'NFT Builder',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['NFT', 'ERC-721', 'IPFS', 'React'],
        views: 15200,
        rating: 4.7,
      },
      {
        id: '4',
        slug: 'dao-governance',
        title: 'DAO Governance Best Practices',
        description: 'Learn how to structure and govern decentralized autonomous organizations effectively.',
        category: 'dao',
        difficulty: 'intermediate',
        duration: 50,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'DAO Architect',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['DAO', 'Governance', 'Voting', 'Treasury'],
        views: 6700,
        rating: 4.6,
      },
      {
        id: '5',
        slug: 'hardhat-testing',
        title: 'Smart Contract Testing with Hardhat',
        description: 'Comprehensive guide to writing and running tests for your smart contracts using Hardhat.',
        category: 'smart-contracts',
        difficulty: 'intermediate',
        duration: 55,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Smart Contract Dev',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Hardhat', 'Testing', 'JavaScript', 'Smart Contracts'],
        views: 9800,
        rating: 4.8,
      },
      {
        id: '6',
        slug: 'wagmi-web3-integration',
        title: 'Web3 Integration with Wagmi',
        description: 'Connect your React app to Ethereum and L2 networks using Wagmi and Viem.',
        category: 'frontend',
        difficulty: 'beginner',
        duration: 40,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Frontend Dev',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Wagmi', 'React', 'Web3', 'Viem'],
        views: 11200,
        rating: 4.9,
      },
      {
        id: '7',
        slug: 'cross-chain-bridge',
        title: 'Cross-Chain Bridge Development',
        description: 'Build a cross-chain bridge to transfer assets between Arbitrum, Base, and Optimism.',
        category: 'infrastructure',
        difficulty: 'advanced',
        duration: 90,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Infrastructure Expert',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Cross-Chain', 'Bridge', 'Arbitrum', 'Base', 'Optimism'],
        views: 5400,
        rating: 4.5,
      },
      {
        id: '8',
        slug: 'hackathon-success',
        title: 'Winning Your First Hackathon',
        description: 'Strategies and tips for building and presenting winning projects at Web3 hackathons.',
        category: 'hackathons',
        difficulty: 'beginner',
        duration: 35,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Hackathon Winner',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Hackathons', 'Strategy', 'Pitching', 'Teamwork'],
        views: 18900,
        rating: 4.9,
      },
      {
        id: '9',
        slug: 'security-best-practices',
        title: 'Smart Contract Security',
        description: 'Common vulnerabilities and best practices for writing secure smart contracts.',
        category: 'security',
        difficulty: 'advanced',
        duration: 70,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Security Auditor',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Security', 'Auditing', 'Best Practices', 'Vulnerabilities'],
        views: 14300,
        rating: 5.0,
      },
      {
        id: '10',
        slug: 'foundry-development',
        title: 'Foundry Development Workflow',
        description: 'Complete guide to using Foundry for smart contract development, testing, and deployment.',
        category: 'smart-contracts',
        difficulty: 'intermediate',
        duration: 65,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Foundry Expert',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Foundry', 'Forge', 'Testing', 'Deployment'],
        views: 7600,
        rating: 4.7,
      },
      {
        id: '11',
        slug: 'token-standards',
        title: 'ERC Token Standards Explained',
        description: 'Deep dive into ERC-20, ERC-721, ERC-1155, and other token standards on Ethereum.',
        category: 'smart-contracts',
        difficulty: 'intermediate',
        duration: 50,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Token Standards Expert',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['ERC-20', 'ERC-721', 'ERC-1155', 'Standards'],
        views: 10200,
        rating: 4.8,
      },
      {
        id: '12',
        slug: 'africa-web3-opportunities',
        title: 'Web3 Opportunities in Africa',
        description: 'Exploring unique opportunities and use cases for blockchain technology in African markets.',
        category: 'business',
        difficulty: 'beginner',
        duration: 30,
        thumbnail: '/placeholder-lesson.jpg',
        author: {
          name: 'Web3 Africa',
          avatar: '/placeholder-avatar.jpg',
        },
        tags: ['Africa', 'Use Cases', 'Business', 'Opportunities'],
        views: 15600,
        rating: 4.9,
      },
    ];

    setTimeout(() => {
      setLessons(mockLessons);
      setFilteredLessons(mockLessons);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...lessons];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((lesson) => lesson.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchLower) ||
          lesson.description.toLowerCase().includes(searchLower) ||
          lesson.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por dificultad
    if (filters.difficulty) {
      filtered = filtered.filter((lesson) => lesson.difficulty === filters.difficulty);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredLessons(filtered);
  }, [lessons, selectedCategory, filters]);

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <LearnHero />
      <LearnCategories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <LearnFilters filters={filters} onFiltersChange={setFilters} />
      <LessonsGrid lessons={filteredLessons} loading={loading} />
      <Footer />
    </main>
  );
}

