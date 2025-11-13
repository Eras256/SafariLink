'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, Award } from 'lucide-react';

export function LearnHero() {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-12 sm:pb-14 md:pb-16 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-5 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-3 sm:mb-4"
        >
          <div className="flex items-center gap-2 glassmorphic px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm text-white/80">Learn Web3 Development</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
        >
          <span className="gradient-text">Master Web3</span>
          <br />
          <span className="text-white">From Zero to Hero</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto px-2"
        >
          Comprehensive learning resources for Web3 development. From smart contracts to DeFi,
          NFTs, and DAOs. Optimized for developers in Africa and emerging markets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12"
        >
          <div className="glassmorphic p-3 sm:p-4 rounded-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">50+</span>
            </div>
            <div className="text-xs sm:text-sm text-white/60">Lessons Available</div>
          </div>
          <div className="glassmorphic p-3 sm:p-4 rounded-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">10K+</span>
            </div>
            <div className="text-xs sm:text-sm text-white/60">Students Learning</div>
          </div>
          <div className="glassmorphic p-3 sm:p-4 rounded-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">25+</span>
            </div>
            <div className="text-xs sm:text-sm text-white/60">Expert Instructors</div>
          </div>
          <div className="glassmorphic p-3 sm:p-4 rounded-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">4.8</span>
            </div>
            <div className="text-xs sm:text-sm text-white/60">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

