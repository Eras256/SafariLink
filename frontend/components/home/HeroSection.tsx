'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-40 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
        >
          <span className="gradient-text">The Complete Web3</span>
          <br />
          <span className="text-white">Hackathon Lifecycle Platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto px-2"
        >
          From First Hack to Global Funding – Optimized for Africa & Emerging Markets
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/hackathons/create">
            <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
              Start Building
            </Button>
          </Link>
          <Link href="/hackathons">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Hackathons
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glassmorphic p-4 sm:p-6 mt-8 sm:mt-12"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/60">Builders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$20M+</div>
              <div className="text-white/60">Distributed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-white/60">Events</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 text-white/60 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

