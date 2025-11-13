'use client';

import { motion } from 'framer-motion';

const features = [
  {
    name: 'Unified Builder Identity',
    description: 'Human Passport + Talent Protocol integration for verified reputation.',
    icon: '👤',
  },
  {
    name: 'Multi-Chain Support',
    description: 'Deploy on Arbitrum, Base, Optimism with seamless chain switching.',
    icon: '⛓️',
  },
  {
    name: 'Sponsor ROI Dashboard',
    description: 'Real-time analytics on developer engagement and API usage.',
    icon: '📊',
  },
  {
    name: 'Compliance Automation',
    description: 'KYC/AML, OFAC screening, and tax withholding built-in.',
    icon: '✅',
  },
  {
    name: 'Community DAO',
    description: 'Governance token and community-driven decision making.',
    icon: '🗳️',
  },
  {
    name: 'Low-Bandwidth Optimized',
    description: 'PWA optimized for emerging markets with offline support.',
    icon: '🌍',
  },
];

export function KeyFeatures() {
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
          <span className="gradient-text">Key Features</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphic p-4 sm:p-5 md:p-6 card-lift"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.name}</h3>
              <p className="text-white/70 text-xs sm:text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

