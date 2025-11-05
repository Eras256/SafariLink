'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, Rocket } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Builders',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: DollarSign,
    value: '$20M+',
    label: 'Prizes Distributed',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Calendar,
    value: '100+',
    label: 'Hackathons',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Rocket,
    value: '40%',
    label: 'Project Continuation Rate',
    color: 'from-orange-500 to-red-500',
  },
];

export function Stats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphic p-8 text-center card-lift"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

