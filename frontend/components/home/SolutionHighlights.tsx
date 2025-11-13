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
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
        >
          <span className="gradient-text">The Solution</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphic p-5 sm:p-6 md:p-8 card-lift"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{solution.title}</h3>
                <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">{solution.description}</p>
                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                  {solution.bullets.map((bullet) => (
                    <li key={bullet} className="text-white/60 flex items-center text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link href={solution.link} className="text-blue-400 hover:text-blue-300 transition text-xs sm:text-sm font-medium">
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

