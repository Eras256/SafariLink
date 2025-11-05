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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="gradient-text">The Problem</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glassmorphic p-8 card-lift"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                <p className="text-white/70">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

