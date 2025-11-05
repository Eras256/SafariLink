'use client';

import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HackathonsFiltersProps {
  filters: {
    search: string;
    status: string;
    locationType: string;
    chain: string;
    sortBy: string;
  };
  onFiltersChange: (filters: any) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REGISTRATION_OPEN', label: 'Registration Open' },
  { value: 'REGISTRATION_CLOSED', label: 'Registration Closed' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'JUDGING', label: 'Judging' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'IN_PERSON', label: 'In Person' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONLINE', label: 'Online' },
];

const CHAIN_OPTIONS = [
  { value: '', label: 'All Chains' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'base', label: 'Base' },
  { value: 'optimism', label: 'Optimism' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'prize', label: 'Highest Prize' },
  { value: 'start', label: 'Starting Soon' },
  { value: 'name', label: 'Name A-Z' },
];

export function HackathonsFilters({ filters, onFiltersChange }: HackathonsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      locationType: '',
      chain: '',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.locationType ||
    filters.chain ||
    filters.sortBy !== 'newest';

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search hackathons by name, tagline, or tags..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 glassmorphic rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="glassmorphic hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500 rounded-full text-xs">
                {[
                  filters.status,
                  filters.locationType,
                  filters.chain,
                  filters.sortBy !== 'newest' ? 'sort' : '',
                ]
                  .filter(Boolean).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-white/60 hover:text-white">
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glassmorphic p-6 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-4 py-2 glassmorphic rounded-lg text-white bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Type Filter */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                <select
                  value={filters.locationType}
                  onChange={(e) => updateFilter('locationType', e.target.value)}
                  className="w-full px-4 py-2 glassmorphic rounded-lg text-white bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {LOCATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chain Filter */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Blockchain</label>
                <select
                  value={filters.chain}
                  onChange={(e) => updateFilter('chain', e.target.value)}
                  className="w-full px-4 py-2 glassmorphic rounded-lg text-white bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {CHAIN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-4 py-2 glassmorphic rounded-lg text-white bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <span className="px-3 py-1 glassmorphic rounded-full text-sm text-white/80 flex items-center gap-2">
                Status: {STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}
                <button
                  onClick={() => updateFilter('status', '')}
                  className="hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.locationType && (
              <span className="px-3 py-1 glassmorphic rounded-full text-sm text-white/80 flex items-center gap-2">
                Location: {LOCATION_OPTIONS.find((l) => l.value === filters.locationType)?.label}
                <button
                  onClick={() => updateFilter('locationType', '')}
                  className="hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.chain && (
              <span className="px-3 py-1 glassmorphic rounded-full text-sm text-white/80 flex items-center gap-2">
                Chain: {CHAIN_OPTIONS.find((c) => c.value === filters.chain)?.label}
                <button
                  onClick={() => updateFilter('chain', '')}
                  className="hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.sortBy !== 'newest' && (
              <span className="px-3 py-1 glassmorphic rounded-full text-sm text-white/80 flex items-center gap-2">
                Sort: {SORT_OPTIONS.find((s) => s.value === filters.sortBy)?.label}
                <button
                  onClick={() => updateFilter('sortBy', 'newest')}
                  className="hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

