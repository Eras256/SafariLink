'use client';

import { Rocket, Globe, Brain, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const solutions = [
  {
    icon: Rocket,
    title: 'Post-Hackathon Launchpad',
    description: 'Pathway from hack to VC funding',
    bullets: ['Grant applications', 'Accelerator intros', 'VC connections', 'Demo days'],
    link: '/grants',
  },
  {
    icon: Globe,
    title: 'Africa-First Infrastructure',
    description: 'PWA, offline-first, 108KB',
    bullets: ['Low bandwidth optimized', 'Offline support', 'Mobile-first design', 'Fast loading'],
    link: '/learn',
  },
  {
    icon: Brain,
    title: 'AI Co-Pilot',
    description: 'Team matching, plagiarism detection, mentor bot',
    bullets: ['Smart team matching', 'Code originality checks', '24/7 mentor support', 'AI-powered insights'],
    link: '/learn',
  },
  {
    icon: Eye,
    title: 'Transparent Judging',
    description: 'Real-time public scoring dashboards',
    bullets: ['Public rubrics', 'Live scoring', 'Judge feedback', 'Community voting'],
    link: '/hackathons',
  },
];

export function SolutionHighlights() {
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
          <span className="gradient-text">The Solution</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphic p-8 card-lift"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{solution.title}</h3>
                <p className="text-white/70 mb-4">{solution.description}</p>
                <ul className="space-y-2 mb-6">
                  {solution.bullets.map((bullet) => (
                    <li key={bullet} className="text-white/60 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link href={solution.link} className="text-blue-400 hover:text-blue-300 transition text-sm font-medium">
                  Learn More →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

