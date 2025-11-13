'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Lesson } from '@/app/learn/page';
import { findMockLessonBySlug } from '@/lib/mockLessons';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle, 
  ArrowLeft,
  BookOpen,
  Tag,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Try to fetch from API first
        const { getApiEndpoint } = await import('@/lib/api/config');
        const { API_ENDPOINTS } = await import('@/lib/constants');
        const response = await fetch(getApiEndpoint(API_ENDPOINTS.LEARN.LESSON(slug)));

        if (response.ok) {
          const data = await response.json();
          setLesson(data.lesson || data);
        } else {
          // Fallback to mock data
          const mockLesson = findMockLessonBySlug(slug);
          if (mockLesson) {
            setLesson(mockLesson);
          } else {
            // If no mock lesson found, redirect to learn page
            router.push('/learn');
          }
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockLesson = findMockLessonBySlug(slug);
        if (mockLesson) {
          setLesson(mockLesson);
        } else {
          router.push('/learn');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug, router]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading lesson...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 mb-4">Lesson not found</div>
            <Link href="/learn">
              <Button>Back to Learn</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const difficultyColor = DIFFICULTY_COLORS[lesson.difficulty] || DIFFICULTY_COLORS.beginner;
  const difficultyLabel = DIFFICULTY_LABELS[lesson.difficulty] || lesson.difficulty;

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <Link href="/learn">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learn
            </Button>
          </Link>
        </div>
      </div>

      {/* Lesson Header */}
      <section className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Video/Thumbnail Section */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden">
            <OptimizedImage
              src={lesson.thumbnail}
              alt={lesson.title}
              fill
              objectFit="cover"
              containerClassName="w-full h-full rounded-xl sm:rounded-2xl"
              fallbackText={lesson.title.charAt(0)}
              className="rounded-xl sm:rounded-2xl"
              type="lesson"
              contextData={{
                title: lesson.title,
                category: lesson.category,
                tags: lesson.tags,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Play Button Overlay */}
            {lesson.videoUrl && !isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm border-2 border-white/50 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
                </button>
              </div>
            )}

            {/* Video Player */}
            {isPlaying && lesson.videoUrl && (
              <div className="absolute inset-0 bg-black">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border backdrop-blur-sm ${difficultyColor}`}>
                {difficultyLabel}
              </span>
            </div>

            {/* Completion Badge */}
            {lesson.completed && (
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                <div className="p-2 sm:p-2.5 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Title and Meta */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                  {lesson.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{formatDuration(lesson.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{lesson.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{lesson.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  About This Lesson
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line">
                  {lesson.description}
                </p>
              </div>

              {/* Tags */}
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {lesson.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-lg text-sm sm:text-base text-white/90 border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Author Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Instructor</h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    {lesson.author.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base sm:text-lg font-semibold text-white">
                      {lesson.author.name}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60">Instructor</div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Lesson Stats</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Duration</span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Views</span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {lesson.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {lesson.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-sm sm:text-base text-white/70">Difficulty</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${difficultyColor}`}>
                      {difficultyLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Link */}
              {lesson.videoUrl && (
                <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 sm:px-6 py-3 sm:py-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white border border-red-500/50 transition"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-semibold">Watch on YouTube</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

