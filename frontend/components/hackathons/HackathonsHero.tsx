'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Coins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HackathonsHero() {
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
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/80">Compete & Build</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold"
        >
          <span className="gradient-text">Discover Web3</span>
          <br />
          <span className="text-white">Hackathons</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto"
        >
          Join hackathons across Africa and emerging markets. Build innovative Web3 projects,
          compete for prizes, and connect with the global developer community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <Link href="/hackathons/create">
            <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
              Create Hackathon
            </Button>
          </Link>
          <Link href="/hackathons?status=REGISTRATION_OPEN">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse Open Registrations
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">50+</span>
            </div>
            <div className="text-sm text-white/60">Hackathons</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">10K+</span>
            </div>
            <div className="text-sm text-white/60">Participants</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">$5M+</span>
            </div>
            <div className="text-sm text-white/60">In Prizes</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">12+</span>
            </div>
            <div className="text-sm text-white/60">Active Events</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

