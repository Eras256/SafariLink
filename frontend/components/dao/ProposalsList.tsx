'use client';

import { ProposalCard } from './ProposalCard';
import { Proposal } from '@/app/dao/page';
import { Inbox, Loader2, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProposalsListProps {
  proposals: Proposal[];
  loading: boolean;
}

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'passed', label: 'Passed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'draft', label: 'Draft' },
];

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All Categories' },
  { value: 'governance', label: 'Governance' },
  { value: 'treasury', label: 'Treasury' },
  { value: 'technical', label: 'Technical' },
  { value: 'community', label: 'Community' },
];

export function ProposalsList({ proposals, loading }: ProposalsListProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProposals = proposals.filter((proposal) => {
    if (statusFilter !== 'all' && proposal.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && proposal.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-white/60">Loading proposals...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (filteredProposals.length === 0) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="glassmorphic p-8 rounded-full">
                <Inbox className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white">No proposals found</h3>
              <p className="text-white/60 max-w-md">
                Try adjusting your filters or create a new proposal.
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
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className={
                  statusFilter === filter.value
                    ? 'glassmorphic-button'
                    : 'glassmorphic hover:bg-white/10'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {CATEGORY_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={categoryFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(filter.value)}
                className={
                  categoryFilter === filter.value
                    ? 'glassmorphic-button'
                    : 'glassmorphic hover:bg-white/10'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {filteredProposals.length} {filteredProposals.length === 1 ? 'Proposal' : 'Proposals'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal, index) => (
            <ProposalCard key={proposal.id} proposal={proposal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

