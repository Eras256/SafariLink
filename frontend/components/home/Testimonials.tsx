'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'SafariLink transformed our hackathon experience. The AI mentor helped us debug our smart contract in minutes!',
    name: 'Sarah K.',
    role: 'Winner, ETH Safari 2025',
    avatar: '👩‍💻',
  },
  {
    quote: 'As a sponsor, the ROI dashboard gave us incredible insights into developer engagement. Best investment we made.',
    name: 'James M.',
    role: 'Sponsor, Polygon Build',
    avatar: '👨‍💼',
  },
  {
    quote: 'The post-hackathon grant pathway led us to $50K in funding within 3 months. This platform is a game-changer.',
    name: 'Amina O.',
    role: 'Builder, Base Camp',
    avatar: '👩‍🔬',
  },
];

export function Testimonials() {
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
          <span className="gradient-text">What Builders Say</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glassmorphic p-6 card-lift"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/80 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

