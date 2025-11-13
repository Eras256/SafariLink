'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { ProjectsFilters } from '@/components/projects/ProjectsFilters';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { mockProjects } from '@/lib/mockProjects';

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

