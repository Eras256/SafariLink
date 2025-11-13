'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { GrantsHero } from '@/components/grants/GrantsHero';
import { GrantsFilters } from '@/components/grants/GrantsFilters';
import { GrantsGrid } from '@/components/grants/GrantsGrid';
import { mockGrants } from '@/lib/mockGrants';

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

