'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glassmorphic p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join the largest Web3 builder community in Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hackathons/create">
              <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
                Create Hackathon
              </Button>
            </Link>
            <Link href="/hackathons">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Find Events
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

