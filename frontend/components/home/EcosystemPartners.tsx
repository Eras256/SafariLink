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
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
        >
          <span className="gradient-text">Ecosystem Partners</span>
        </motion.h2>

        <div className="glassmorphic p-4 sm:p-6 md:p-8 overflow-hidden">
          <div className="flex animate-scroll gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {[...partners, ...partners].map((partner, index) => (
              <motion.div
                key={`${partner}-${index}`}
                className="text-white/60 hover:text-white transition whitespace-nowrap text-base sm:text-lg md:text-xl font-medium"
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

