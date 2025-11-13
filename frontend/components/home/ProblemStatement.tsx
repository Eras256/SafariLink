'use client';

import { Skull, TrendingDown, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: Skull,
    title: '90% of hackathon projects die post-event',
    description: 'Lack of continuous support and funding pathways leads to project abandonment.',
  },
  {
    icon: TrendingDown,
    title: 'Sponsors lack clear ROI metrics',
    description: 'No visibility into developer engagement, API usage, or long-term project success.',
  },
  {
    icon: Puzzle,
    title: 'Organizers struggle with fragmented tools',
    description: 'Multiple platforms for registration, judging, prizes, and community management.',
  },
];

export function ProblemStatement() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
        >
          <span className="gradient-text">The Problem</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glassmorphic p-5 sm:p-6 md:p-8 card-lift"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{problem.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

