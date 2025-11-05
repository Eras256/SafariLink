'use client';

import { motion } from 'framer-motion';

const partners = [
  'Arbitrum',
  'Base',
  'Optimism',
  'Human Passport',
  'Talent Protocol',
  'Smile ID',
  'Huddle01',
  'Circle',
  'Dune Analytics',
  'Snapshot',
  'Gnosis Safe',
];

export function EcosystemPartners() {
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
          <span className="gradient-text">Ecosystem Partners</span>
        </motion.h2>

        <div className="glassmorphic p-8 overflow-hidden">
          <div className="flex animate-scroll gap-12">
            {[...partners, ...partners].map((partner, index) => (
              <motion.div
                key={`${partner}-${index}`}
                className="text-white/60 hover:text-white transition whitespace-nowrap text-xl font-medium"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}

