'use client';

import { motion } from 'framer-motion';
import { User, TrendingUp, FileText, Vote, Wallet } from 'lucide-react';
import { DaoMember } from '@/app/dao/page';
import { truncateAddress } from '@/lib/utils';

interface DaoMembersProps {
  members: DaoMember[];
  loading: boolean;
}

export function DaoMembers({ members, loading }: DaoMembersProps) {
  if (loading) {
    return (
      <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-white/60">Loading members...</div>
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-white/60">No members found</p>
          </div>
        </div>
      </section>
    );
  }

  // Sort members by voting power (descending)
  const sortedMembers = [...members].sort((a, b) => b.votingPower - a.votingPower);

  return (
    <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            DAO Members
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            {members.length} active member{members.length !== 1 ? 's' : ''} in the DAO
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {sortedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glassmorphic p-4 sm:p-5 md:p-6 rounded-xl h-full flex flex-col">
                {/* Member Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl flex-shrink-0">
                    {member.username?.charAt(0).toUpperCase() || member.walletAddress.charAt(2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 truncate">
                      {member.username || truncateAddress(member.walletAddress)}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 truncate">
                      {truncateAddress(member.walletAddress)}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {index + 1}
                      </div>
                    </div>
                  )}
                </div>

                {/* Voting Power */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-white/70">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Voting Power</span>
                    </div>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                      {member.votingPower}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 glassmorphic rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${member.votingPower}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 sm:space-y-3 flex-1">
                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Token Balance</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {(member.tokenBalance / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Proposals Created</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {member.proposalsCreated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                      <Vote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Proposals Voted</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {member.proposalsVoted}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

