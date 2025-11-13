'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, Wallet } from 'lucide-react';

interface TreasuryTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  date: string;
  from?: string;
  to?: string;
}

interface DaoTreasuryProps {
  loading: boolean;
}

const mockTransactions: TreasuryTransaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 500000,
    currency: 'USD',
    description: 'Hackathon prize pool funding',
    date: '2024-11-01T10:00:00Z',
    from: 'Treasury Reserve',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 45000,
    currency: 'USD',
    description: 'Grant program allocation - DeFi Yield Optimizer',
    date: '2024-11-15T14:00:00Z',
    to: '0x1234567890123456789012345678901234567890',
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 70000,
    currency: 'USD',
    description: 'Grant program allocation - AfriNFT Marketplace',
    date: '2024-11-18T16:00:00Z',
    to: '0x2345678901234567890123456789012345678901',
  },
  {
    id: '4',
    type: 'deposit',
    amount: 200000,
    currency: 'USD',
    description: 'Community grant program funding',
    date: '2024-11-05T09:00:00Z',
    from: 'Treasury Reserve',
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: 50000,
    currency: 'USD',
    description: 'Platform infrastructure upgrade',
    date: '2024-10-20T11:00:00Z',
    to: 'Infrastructure Team',
  },
  {
    id: '6',
    type: 'deposit',
    amount: 100000,
    currency: 'USD',
    description: 'Sponsorship revenue',
    date: '2024-10-15T08:00:00Z',
    from: 'Base Ecosystem',
  },
];

const mockTreasuryStats = {
  totalBalance: 2500000,
  availableBalance: 2100000,
  allocatedBalance: 400000,
  totalDeposits: 800000,
  totalWithdrawals: 165000,
  currency: 'USD',
};

export function DaoTreasury({ loading }: DaoTreasuryProps) {
  if (loading) {
    return (
      <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-white/60">Loading treasury...</div>
          </div>
        </div>
      </section>
    );
  }

  const transactions = mockTransactions;
  const stats = mockTreasuryStats;

  return (
    <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Treasury
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Manage and track DAO treasury funds
          </p>
        </div>

        {/* Treasury Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glassmorphic p-4 sm:p-5 md:p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm text-white/70">Total Balance</span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
              ${(stats.totalBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-xs sm:text-sm text-white/60">{stats.currency}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glassmorphic p-4 sm:p-5 md:p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm text-white/70">Available</span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300 mb-1">
              ${(stats.availableBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-xs sm:text-sm text-white/60">Ready to allocate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glassmorphic p-4 sm:p-5 md:p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white/70">Allocated</span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1">
              ${(stats.allocatedBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-xs sm:text-sm text-white/60">In active grants</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glassmorphic p-4 sm:p-5 md:p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-xs sm:text-sm text-white/70">Total Withdrawn</span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-300 mb-1">
              ${(stats.totalWithdrawals / 1000).toFixed(0)}K
            </div>
            <div className="text-xs sm:text-sm text-white/60">This quarter</div>
          </motion.div>
        </div>

        {/* Transactions */}
        <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Recent Transactions</h3>
          <div className="space-y-3 sm:space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`p-2 sm:p-2.5 rounded-lg flex-shrink-0 ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-500/20' 
                        : transaction.type === 'withdrawal'
                        ? 'bg-red-500/20'
                        : 'bg-blue-500/20'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      ) : transaction.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs sm:text-sm font-medium px-2 py-0.5 rounded ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-500/20 text-green-300' 
                            : transaction.type === 'withdrawal'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-white mb-1">
                        {transaction.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
                        {transaction.from && (
                          <span>From: {transaction.from}</span>
                        )}
                        {transaction.to && (
                          <span>To: {transaction.to.length > 20 ? `${transaction.to.slice(0, 20)}...` : transaction.to}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
                      transaction.type === 'deposit' 
                        ? 'text-green-300' 
                        : 'text-red-300'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${(transaction.amount / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs sm:text-sm text-white/60">{transaction.currency}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

