'use client';

import { motion } from 'framer-motion';
import { HandCoins, TrendingUp, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function GrantsHero() {
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
            <HandCoins className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/80">Post-Hackathon Funding</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold"
        >
          <span className="gradient-text">From Hackathon to</span>
          <br />
          <span className="text-white">Global Funding</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto"
        >
          Discover grant opportunities and funding programs for your Web3 projects. Connect with
          foundation programs like Arbitrum, Optimism RetroPGF, and Base Ecosystem Fund.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <Link href="/grants/apply">
            <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
              Apply for Grant
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Projects
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
              <HandCoins className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">$5M+</span>
            </div>
            <div className="text-sm text-white/60">Total Grants Distributed</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">200+</span>
            </div>
            <div className="text-sm text-white/60">Grant Applications</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">15+</span>
            </div>
            <div className="text-sm text-white/60">Grant Programs</div>
          </div>
          <div className="glassmorphic p-4 rounded-xl min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">85%</span>
            </div>
            <div className="text-sm text-white/60">Approval Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

