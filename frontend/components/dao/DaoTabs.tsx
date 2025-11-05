'use client';

import { motion } from 'framer-motion';
import { FileText, Users, Coins } from 'lucide-react';

interface DaoTabsProps {
  activeTab: 'proposals' | 'members' | 'treasury';
  onTabChange: (tab: 'proposals' | 'members' | 'treasury') => void;
}

const tabs = [
  { id: 'proposals' as const, label: 'Proposals', icon: FileText },
  { id: 'members' as const, label: 'Members', icon: Users },
  { id: 'treasury' as const, label: 'Treasury', icon: Coins },
];

export function DaoTabs({ activeTab, onTabChange }: DaoTabsProps) {
  return (
    <section className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300
                  relative
                  ${isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

