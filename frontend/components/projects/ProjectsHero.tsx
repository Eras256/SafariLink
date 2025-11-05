'use client';

import { motion } from 'framer-motion';
import { Sparkles, Trophy, TrendingUp } from 'lucide-react';

export function ProjectsHero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="flex items-center gap-2 glassmorphic px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/80">Explore Innovative Projects</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold"
        >
          <span className="gradient-text">Discover Amazing</span>
          <br />
          <span className="text-white">Web3 Projects</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto"
        >
          Explore groundbreaking projects built by talented developers across Africa and emerging markets.
          From DeFi protocols to NFT marketplaces, discover the future of Web3.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          <div className="glassmorphic p-4 rounded-xl min-w-[140px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">500+</span>
            </div>
            <div className="text-sm text-white/60">Projects Built</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[140px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">$2M+</span>
            </div>
            <div className="text-sm text-white/60">In Prizes Won</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[140px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">50+</span>
            </div>
            <div className="text-sm text-white/60">Winning Teams</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

