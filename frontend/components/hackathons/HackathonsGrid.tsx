'use client';

import { HackathonCard } from './HackathonCard';
import { Hackathon } from '@/app/hackathons/page';
import { Inbox, Loader2 } from 'lucide-react';

interface HackathonsGridProps {
  hackathons: Hackathon[];
  loading: boolean;
}

export function HackathonsGrid({ hackathons, loading }: HackathonsGridProps) {
  if (loading) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-white/60">Loading hackathons...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hackathons.length === 0) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="glassmorphic p-8 rounded-full">
                <Inbox className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white">No hackathons found</h3>
              <p className="text-white/60 max-w-md">
                Try adjusting your filters or search terms to find more hackathons.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {hackathons.length} {hackathons.length === 1 ? 'Hackathon' : 'Hackathons'} Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon, index) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

