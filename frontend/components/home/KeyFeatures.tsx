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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="gradient-text">Key Features</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphic p-6 card-lift"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.name}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

