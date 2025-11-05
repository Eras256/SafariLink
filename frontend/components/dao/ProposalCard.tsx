'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Vote, CheckCircle, XCircle, Clock, User, Calendar, TrendingUp } from 'lucide-react';
import { Proposal } from '@/app/dao/page';
import { truncateAddress } from '@/lib/utils';

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
}

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

export function ProposalCard({ proposal, index }: ProposalCardProps) {
  const statusColor = STATUS_COLORS[proposal.status] || STATUS_COLORS.draft;
  const statusLabel = STATUS_LABELS[proposal.status] || proposal.status;
  const categoryColor = CATEGORY_COLORS[proposal.category] || CATEGORY_COLORS.governance;
  const categoryLabel = CATEGORY_LABELS[proposal.category] || proposal.category;

  const isActive = proposal.status === 'active';
  const totalVotingPower = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const votesForPercent =
    totalVotingPower > 0 ? (proposal.votesFor / totalVotingPower) * 100 : 0;
  const votesAgainstPercent =
    totalVotingPower > 0 ? (proposal.votesAgainst / totalVotingPower) * 100 : 0;
  const quorumPercent = (totalVotingPower / proposal.quorum) * 100;

  const isPassing = proposal.votesFor > proposal.votesAgainst;
  const hasQuorum = totalVotingPower >= proposal.quorum;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/dao/proposals/${proposal.slug}`}>
        <div className="glassmorphic p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                  {categoryLabel}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{proposal.title}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 mb-4 line-clamp-3 flex-1">{proposal.description}</p>

          {/* Voting Progress */}
          {isActive && (
            <div className="mb-4 space-y-3">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Quorum Progress</span>
                  <span>{quorumPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 glassmorphic rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(quorumPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Vote Breakdown */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-white/60">For</span>
                  </div>
                  <div className="text-sm font-bold text-green-300">
                    {(proposal.votesFor / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-white/40">{votesForPercent.toFixed(1)}%</div>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-1 mb-1">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-white/60">Against</span>
                  </div>
                  <div className="text-sm font-bold text-red-300">
                    {(proposal.votesAgainst / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-white/40">{votesAgainstPercent.toFixed(1)}%</div>
                </div>
                <div className="p-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div className="flex items-center gap-1 mb-1">
                    <Vote className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-white/60">Abstain</span>
                  </div>
                  <div className="text-sm font-bold text-gray-300">
                    {(proposal.votesAbstain / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-white/40">
                    {totalVotingPower > 0
                      ? ((proposal.votesAbstain / totalVotingPower) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 p-2 glassmorphic rounded-lg">
                {hasQuorum ? (
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Quorum Met</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      Needs {(proposal.quorum - totalVotingPower) / 1000000}M more tokens
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results for non-active proposals */}
          {!isActive && (
            <div className="mb-4">
              <div className="flex items-center justify-between p-3 glassmorphic rounded-lg">
                <div className="flex items-center gap-2">
                  {proposal.status === 'passed' || proposal.status === 'executed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm text-white/80">
                    {proposal.status === 'passed' || proposal.status === 'executed'
                      ? 'Proposal Passed'
                      : 'Proposal Rejected'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
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
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/60">
                {proposal.proposer.username || truncateAddress(proposal.proposer.walletAddress)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {isActive
                ? `Ends ${new Date(proposal.endDate).toLocaleDateString()}`
                : new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

