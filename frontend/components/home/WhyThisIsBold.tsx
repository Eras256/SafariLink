'use client';

import { motion } from 'framer-motion';
import { Globe, Link as LinkIcon, Brain, Star } from 'lucide-react';

export function WhyThisIsBold() {
  const innovations = [
    {
      title: 'First Native Swahili Support',
      subtitle: 'For Hackathon Platforms',
      description: 'SafariLink is the first hackathon platform with native Swahili support in both UI and AI, breaking language barriers for millions of African developers and making Web3 truly accessible to the continent.',
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'World First',
      details: [
        'Full UI translation in Swahili',
        'AI mentor responds in Swahili',
        'Context-aware for African markets',
        'Optimized for low connectivity'
      ]
    },
    {
      title: 'First Blockchain-Powered',
      subtitle: 'Post-Hackathon Tracking',
      description: 'The first system to track hackathon projects on-chain after the event ends, creating a verifiable reputation system and connecting winners to long-term funding opportunities.',
      icon: LinkIcon,
      gradient: 'from-purple-500 to-pink-500',
      badge: 'World First',
      details: [
        'On-chain project tracking',
        'Verifiable reputation system',
        'Soulbound NFT certificates',
        'Automated funding pipeline'
      ]
    },
    {
      title: 'First Multilingual AI',
      subtitle: 'For Web3 Hackathons',
      description: 'The first AI mentor specifically designed for Web3 hackathons with native multilingual support, understanding blockchain context, Solidity, and African developer needs.',
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500',
      badge: 'World First',
      details: [
        'Web3-specific knowledge base',
        'Multilingual AI (Swahili, English, French)',
        'Context-aware for hackathons',
        'Real-time code assistance'
      ]
    },
  ];

  return (
    <section id="bold" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-transparent to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm mb-4"
          >
            🚀 Why This Is Bold
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="gradient-text">Three World-First Innovations</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg md:text-xl mt-4 max-w-3xl mx-auto">
            SafariLink introduces groundbreaking features that have never been implemented in hackathon platforms before
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {innovations.map((innovation, index) => {
            const Icon = innovation.icon;
            return (
              <motion.div
                key={innovation.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glassmorphic p-5 sm:p-6 md:p-8 card-lift relative overflow-hidden group"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/50 rounded-full text-yellow-300 text-xs font-semibold">
                    {innovation.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${innovation.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 pr-16">
                  {innovation.title}
                </h3>
                <p className="text-blue-300 text-sm sm:text-base mb-3 font-medium">
                  {innovation.subtitle}
                </p>

                {/* Description */}
                <p className="text-white/70 text-sm sm:text-base mb-4">
                  {innovation.description}
                </p>

                {/* Details */}
                <ul className="space-y-2 mt-4 pt-4 border-t border-white/10">
                  {innovation.details.map((detail) => (
                    <li key={detail} className="text-white/60 text-xs sm:text-sm flex items-start">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium">
              <span className="text-yellow-300 font-bold">These innovations</span> don&apos;t just improve hackathons—{' '}
              <span className="text-yellow-300 font-bold">they transform</span> how virtual events work globally, 
              making Web3 accessible to millions of developers who were previously excluded.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

