'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Join Hackathon',
    description: 'Register, form team (1-2 days)',
    timeline: '1-2 days',
  },
  {
    number: '2',
    title: 'Build & Submit',
    description: 'AI mentor, resources (2-7 days)',
    timeline: '2-7 days',
  },
  {
    number: '3',
    title: 'Transparent Judging',
    description: 'Public rubrics, feedback (3-5 days)',
    timeline: '3-5 days',
  },
  {
    number: '4',
    title: 'Receive Prizes',
    description: 'Smart contract escrow, USDC/Polygon (instant)',
    timeline: 'Instant',
  },
  {
    number: '5',
    title: 'Post-Hack Support',
    description: 'Grants dashboard, accelerator intros (3-12 months)',
    timeline: '3-12 months',
  },
  {
    number: '6',
    title: 'Funding Pathway',
    description: 'VC connections, demo days (6-24 months)',
    timeline: '6-24 months',
  },
];

export function HowItWorks() {
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
          <span className="gradient-text">How It Works</span>
        </motion.h2>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphic p-6 card-lift relative"
              >
                <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 mt-4">{step.title}</h3>
                <p className="text-white/70 mb-2">{step.description}</p>
                <div className="text-sm text-blue-400 font-medium">{step.timeline}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

