'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { LearnHero } from '@/components/learn/LearnHero';
import { LearnCategories } from '@/components/learn/LearnCategories';
import { LessonsGrid } from '@/components/learn/LessonsGrid';
import { LearnFilters } from '@/components/learn/LearnFilters';
import { mockLessons } from '@/lib/mockLessons';

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

