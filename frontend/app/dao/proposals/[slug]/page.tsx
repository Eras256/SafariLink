'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Proposal } from '@/app/dao/page';
import { findMockProposalBySlug } from '@/lib/mockProposals';
import { 
  Vote, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  ArrowLeft,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  active: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  passed: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  executed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  passed: 'Passed',
  rejected: 'Rejected',
  executed: 'Executed',
};

const CATEGORY_COLORS: Record<string, string> = {
  governance: 'bg-purple-500/20 text-purple-300',
  treasury: 'bg-green-500/20 text-green-300',
  technical: 'bg-blue-500/20 text-blue-300',
  community: 'bg-pink-500/20 text-pink-300',
};

const CATEGORY_LABELS: Record<string, string> = {
  governance: 'Governance',
  treasury: 'Treasury',
  technical: 'Technical',
  community: 'Community',
};

export default function ProposalPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Try to fetch from API first
        const { getApiEndpoint } = await import('@/lib/api/config');
        const { API_ENDPOINTS } = await import('@/lib/constants');
        const response = await fetch(getApiEndpoint(API_ENDPOINTS.DAO.PROPOSAL(slug)));

        if (response.ok) {
          const data = await response.json();
          setProposal(data.proposal || data);
        } else {
          // Fallback to mock data
          const mockProposal = findMockProposalBySlug(slug);
          if (mockProposal) {
            setProposal(mockProposal);
          } else {
            // If no mock proposal found, redirect to dao page
            router.push('/dao');
          }
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockProposal = findMockProposalBySlug(slug);
        if (mockProposal) {
          setProposal(mockProposal);
        } else {
          router.push('/dao');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading proposal...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!proposal) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 mb-4">Proposal not found</div>
            <Link href="/dao">
              <Button>Back to DAO</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const statusColor = STATUS_COLORS[proposal.status] || STATUS_COLORS.draft;
  const statusLabel = STATUS_LABELS[proposal.status] || proposal.status;
  const categoryColor = CATEGORY_COLORS[proposal.category] || CATEGORY_COLORS.governance;
  const categoryLabel = CATEGORY_LABELS[proposal.category] || proposal.category;

  const isActive = proposal.status === 'active';
  const totalVotingPower = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const votesForPercent = totalVotingPower > 0 ? (proposal.votesFor / totalVotingPower) * 100 : 0;
  const votesAgainstPercent = totalVotingPower > 0 ? (proposal.votesAgainst / totalVotingPower) * 100 : 0;
  const votesAbstainPercent = totalVotingPower > 0 ? (proposal.votesAbstain / totalVotingPower) * 100 : 0;
  const quorumPercent = (totalVotingPower / proposal.quorum) * 100;

  const isPassing = proposal.votesFor > proposal.votesAgainst;
  const hasQuorum = totalVotingPower >= proposal.quorum;

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <Link href="/dao">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DAO
            </Button>
          </Link>
        </div>
      </div>

      {/* Proposal Content */}
      <section className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${categoryColor}`}>
                {categoryLabel}
              </span>
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-white/70">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  {proposal.proposer.username || truncateAddress(proposal.proposer.walletAddress)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  {isActive ? (
                    <>Ends {new Date(proposal.endDate).toLocaleDateString()}</>
                  ) : (
                    <>Created {new Date(proposal.createdAt).toLocaleDateString()}</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  Proposal Description
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line">
                  {proposal.description}
                </p>
              </div>

              {/* Voting Section */}
              {isActive && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
                    Voting
                  </h2>
                  
                  {/* Quorum Progress */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between text-sm sm:text-base text-white/70 mb-2">
                      <span>Quorum Progress</span>
                      <span className="font-semibold text-white">{quorumPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 sm:h-3 glassmorphic rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(quorumPercent, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 mt-1">
                      {totalVotingPower.toLocaleString()} / {proposal.quorum.toLocaleString()} tokens
                    </div>
                  </div>

                  {/* Vote Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">For</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-green-300 mb-1">
                        {(proposal.votesFor / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-white/60">{votesForPercent.toFixed(1)}%</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">Against</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-red-300 mb-1">
                        {(proposal.votesAgainst / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-white/60">{votesAgainstPercent.toFixed(1)}%</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">Abstain</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-300 mb-1">
                        {(proposal.votesAbstain / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-white/60">{votesAbstainPercent.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 glassmorphic rounded-lg">
                    {hasQuorum ? (
                      <div className="flex items-center gap-2 sm:gap-3 text-green-300">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-sm sm:text-base font-semibold">Quorum Met</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3 text-yellow-300">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-sm sm:text-base font-semibold">
                          Needs {(proposal.quorum - totalVotingPower) / 1000000}M more tokens
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results for non-active proposals */}
              {!isActive && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    Voting Results
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-5 glassmorphic rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {proposal.status === 'passed' || proposal.status === 'executed' ? (
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                          )}
                          <span className="text-lg sm:text-xl font-bold text-white">
                            {proposal.status === 'passed' || proposal.status === 'executed'
                              ? 'Proposal Passed'
                              : 'Proposal Rejected'}
                          </span>
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          {isPassing ? (
                            <span className="text-green-300">
                              {(proposal.votesFor / 1000000).toFixed(2)}M For
                            </span>
                          ) : (
                            <span className="text-red-300">
                              {(proposal.votesAgainst / 1000000).toFixed(2)}M Against
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="text-sm text-white/70 mb-1">For</div>
                          <div className="text-lg font-bold text-green-300">
                            {(proposal.votesFor / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-white/60">{votesForPercent.toFixed(1)}%</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="text-sm text-white/70 mb-1">Against</div>
                          <div className="text-lg font-bold text-red-300">
                            {(proposal.votesAgainst / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-white/60">{votesAgainstPercent.toFixed(1)}%</div>
                        </div>
                        <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                          <div className="text-sm text-white/70 mb-1">Abstain</div>
                          <div className="text-lg font-bold text-gray-300">
                            {(proposal.votesAbstain / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-white/60">{votesAbstainPercent.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                    {proposal.executed && proposal.executionDate && (
                      <div className="p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center gap-2 text-purple-300">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Executed on {new Date(proposal.executionDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Proposal Info Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Proposal Info</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Status</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Category</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${categoryColor}`}>
                      {categoryLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-sm sm:text-base text-white/70">Quorum</span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {(proposal.quorum / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Timeline</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Created</span>
                    <span className="text-sm sm:text-base text-white">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Started</span>
                    <span className="text-sm sm:text-base text-white">
                      {new Date(proposal.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/70">Ends</span>
                    <span className="text-sm sm:text-base text-white">
                      {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {proposal.executionDate && (
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-sm sm:text-base text-white/70">Executed</span>
                      <span className="text-sm sm:text-base text-white">
                        {new Date(proposal.executionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Proposer Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Proposer</h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    {proposal.proposer.username?.charAt(0).toUpperCase() || proposal.proposer.walletAddress.charAt(2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base sm:text-lg font-semibold text-white truncate">
                      {proposal.proposer.username || truncateAddress(proposal.proposer.walletAddress)}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 truncate">
                      {truncateAddress(proposal.proposer.walletAddress)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

