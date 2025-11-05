'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

export function DaoStats() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glassmorphic p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">15</div>
            <div className="text-sm text-white/60">Proposals Passed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glassmorphic p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-sm text-white/60">Active Votes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glassmorphic p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">62%</div>
            <div className="text-sm text-white/60">Participation Rate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glassmorphic p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">5</div>
            <div className="text-sm text-white/60">Proposals Rejected</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

