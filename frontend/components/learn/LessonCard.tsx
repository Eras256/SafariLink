'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Play, CheckCircle, Lock } from 'lucide-react';
import { Lesson } from '@/app/learn/page';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
}

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

export function LessonCard({ lesson, index }: LessonCardProps) {
  const difficultyColor = DIFFICULTY_COLORS[lesson.difficulty] || DIFFICULTY_COLORS.beginner;
  const difficultyLabel = DIFFICULTY_LABELS[lesson.difficulty] || lesson.difficulty;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/learn/${lesson.slug}`}>
        <div className="glassmorphic p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {/* Thumbnail */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group/image">
            <OptimizedImage
              src={lesson.thumbnail}
              alt={lesson.title}
              fill
              objectFit="cover"
              containerClassName="w-full h-48 rounded-lg"
              fallbackText={lesson.title.charAt(0)}
              className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              type="lesson"
              contextData={{
                title: lesson.title,
                category: lesson.category,
                tags: lesson.tags,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 pointer-events-none">
              {lesson.completed ? (
                <div className="p-2 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                </div>
              ) : (
                <div className="p-2 glassmorphic rounded-full backdrop-blur-sm">
                  <Play className="w-5 h-5 text-white/80" />
                </div>
              )}
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColor}`}
            >
              {difficultyLabel}
            </span>
          </div>

          {/* Title and Description */}
          <div className="flex-1 mb-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {lesson.title}
            </h3>
            <p className="text-sm text-white/70 line-clamp-3 mb-4">{lesson.description}</p>

            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {lesson.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
                {lesson.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10">
                    +{lesson.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(lesson.duration)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{lesson.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{lesson.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-xs text-white/50">{lesson.author.name}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

