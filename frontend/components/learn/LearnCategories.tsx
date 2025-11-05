'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Coins,
  Image as ImageIcon,
  Users,
  Code2,
  Shield,
  Trophy,
  Building2,
  Network,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All Courses', icon: Code, color: 'from-blue-500 to-cyan-500' },
  {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    icon: Code2,
    color: 'from-purple-500 to-pink-500',
  },
  { id: 'defi', name: 'DeFi', icon: Coins, color: 'from-green-500 to-emerald-500' },
  { id: 'nft', name: 'NFTs', icon: ImageIcon, color: 'from-pink-500 to-rose-500' },
  { id: 'dao', name: 'DAOs', icon: Users, color: 'from-blue-500 to-indigo-500' },
  { id: 'frontend', name: 'Frontend', icon: Code, color: 'from-cyan-500 to-blue-500' },
  { id: 'security', name: 'Security', icon: Shield, color: 'from-red-500 to-orange-500' },
  { id: 'hackathons', name: 'Hackathons', icon: Trophy, color: 'from-yellow-500 to-amber-500' },
  { id: 'business', name: 'Business', icon: Building2, color: 'from-indigo-500 to-purple-500' },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    icon: Network,
    color: 'from-teal-500 to-green-500',
  },
];

interface LearnCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function LearnCategories({ selectedCategory, onCategoryChange }: LearnCategoriesProps) {
  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300
                  ${isSelected
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : 'glassmorphic text-white/80 hover:text-white hover:scale-105'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white/60'}`} />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

