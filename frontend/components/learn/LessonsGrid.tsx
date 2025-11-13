'use client';

import { LessonCard } from './LessonCard';
import { Lesson } from '@/app/learn/page';
import { Inbox, Loader2 } from 'lucide-react';

interface LessonsGridProps {
  lessons: Lesson[];
  loading: boolean;
}

export function LessonsGrid({ lessons, loading }: LessonsGridProps) {
  if (loading) {
    return (
      <section className="px-3 sm:px-4 md:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-spin" />
              <p className="text-white/60 text-sm sm:text-base">Loading lessons...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (lessons.length === 0) {
    return (
      <section className="px-3 sm:px-4 md:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="flex flex-col items-center gap-3 sm:gap-4 text-center px-4">
              <div className="glassmorphic p-6 sm:p-8 rounded-full">
                <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-white/40" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">No lessons found</h3>
              <p className="text-white/60 max-w-md text-sm sm:text-base">
                Try adjusting your filters or search terms to find more lessons.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'} Available
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {lessons.map((lesson, index) => (
            <LessonCard key={lesson.id} lesson={lesson} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

