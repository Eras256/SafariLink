'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { DaoHero } from '@/components/dao/DaoHero';
import { DaoStats } from '@/components/dao/DaoStats';
import { ProposalsList } from '@/components/dao/ProposalsList';
import { DaoTabs } from '@/components/dao/DaoTabs';

export interface Proposal {
  id: string;
  slug: string;
  title: string;
  description: string;
  proposer: {
    id: string;
    walletAddress: string;
    username?: string;
    avatar?: string;
  };
  category: 'governance' | 'treasury' | 'technical' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  startDate: string;
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  executed?: boolean;
  executionDate?: string;
  createdAt: string;
}

export interface DaoMember {
  id: string;
  walletAddress: string;
  username?: string;
  avatar?: string;
  tokenBalance: number;
  votingPower: number;
  proposalsCreated: number;
  proposalsVoted: number;
}

export default function DaoPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<DaoMember[]>([]);
  const [activeTab, setActiveTab] = useState<'proposals' | 'members' | 'treasury'>('proposals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Reemplazar con llamada real a la API
    const mockProposals: Proposal[] = [
      {
        id: '1',
        slug: 'increase-hackathon-prize-pool',
        title: 'Increase Hackathon Prize Pool Allocation',
        description: 'Proposal to increase the prize pool allocation for Q1 2025 hackathons from $500K to $750K to attract more builders and support larger events.',
        proposer: {
          id: '1',
          walletAddress: '0x1234567890123456789012345678901234567890',
          username: 'dao_governor',
        },
        category: 'treasury',
        status: 'active',
        startDate: '2024-11-01T00:00:00Z',
        endDate: '2024-11-15T23:59:59Z',
        votesFor: 1250000,
        votesAgainst: 320000,
        votesAbstain: 50000,
        totalVotes: 1620000,
        quorum: 1500000,
        createdAt: '2024-10-28T10:00:00Z',
      },
      {
        id: '2',
        slug: 'add-optimism-mainnet',
        title: 'Add Optimism Mainnet Support',
        description: 'Expand platform support to include Optimism mainnet in addition to existing testnets. This will enable real-world deployments and production use cases.',
        proposer: {
          id: '2',
          walletAddress: '0x2345678901234567890123456789012345678901',
          username: 'chain_advocate',
        },
        category: 'technical',
        status: 'passed',
        startDate: '2024-10-15T00:00:00Z',
        endDate: '2024-10-30T23:59:59Z',
        votesFor: 2100000,
        votesAgainst: 150000,
        votesAbstain: 30000,
        totalVotes: 2280000,
        quorum: 2000000,
        executed: true,
        executionDate: '2024-11-01T12:00:00Z',
        createdAt: '2024-10-10T09:00:00Z',
      },
      {
        id: '3',
        slug: 'community-grant-program',
        title: 'Launch Community Grant Program',
        description: 'Establish a $200K community grant program to support ecosystem projects and builder initiatives in Africa and emerging markets.',
        proposer: {
          id: '3',
          walletAddress: '0x3456789012345678901234567890123456789012',
          username: 'community_builder',
        },
        category: 'community',
        status: 'active',
        startDate: '2024-11-05T00:00:00Z',
        endDate: '2024-11-20T23:59:59Z',
        votesFor: 890000,
        votesAgainst: 210000,
        votesAbstain: 100000,
        totalVotes: 1200000,
        quorum: 1500000,
        createdAt: '2024-11-01T14:00:00Z',
      },
      {
        id: '4',
        slug: 'update-governance-parameters',
        title: 'Update Governance Parameters',
        description: 'Adjust voting quorum from 1.5M tokens to 1.2M tokens and reduce proposal voting period from 14 days to 10 days to improve governance efficiency.',
        proposer: {
          id: '4',
          walletAddress: '0x4567890123456789012345678901234567890123',
          username: 'governance_optimizer',
        },
        category: 'governance',
        status: 'draft',
        startDate: '2024-11-10T00:00:00Z',
        endDate: '2024-11-24T23:59:59Z',
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        totalVotes: 0,
        quorum: 1500000,
        createdAt: '2024-11-08T11:00:00Z',
      },
      {
        id: '5',
        slug: 'expand-ai-services',
        title: 'Expand AI Services Budget',
        description: 'Increase AI services budget by $50K to support enhanced mentor bot capabilities and improved plagiarism detection algorithms.',
        proposer: {
          id: '5',
          walletAddress: '0x5678901234567890123456789012345678901234',
          username: 'ai_advocate',
        },
        category: 'treasury',
        status: 'rejected',
        startDate: '2024-10-01T00:00:00Z',
        endDate: '2024-10-15T23:59:59Z',
        votesFor: 600000,
        votesAgainst: 1800000,
        votesAbstain: 200000,
        totalVotes: 2600000,
        quorum: 1500000,
        createdAt: '2024-09-28T15:00:00Z',
      },
    ];

    const mockMembers: DaoMember[] = [
      {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        username: 'dao_governor',
        tokenBalance: 2500000,
        votingPower: 12.5,
        proposalsCreated: 5,
        proposalsVoted: 18,
      },
      {
        id: '2',
        walletAddress: '0x2345678901234567890123456789012345678901',
        username: 'chain_advocate',
        tokenBalance: 1800000,
        votingPower: 9.0,
        proposalsCreated: 3,
        proposalsVoted: 15,
      },
      {
        id: '3',
        walletAddress: '0x3456789012345678901234567890123456789012',
        username: 'community_builder',
        tokenBalance: 1500000,
        votingPower: 7.5,
        proposalsCreated: 7,
        proposalsVoted: 22,
      },
      {
        id: '4',
        walletAddress: '0x4567890123456789012345678901234567890123',
        username: 'governance_optimizer',
        tokenBalance: 1200000,
        votingPower: 6.0,
        proposalsCreated: 2,
        proposalsVoted: 12,
      },
      {
        id: '5',
        walletAddress: '0x5678901234567890123456789012345678901234',
        username: 'ai_advocate',
        tokenBalance: 1000000,
        votingPower: 5.0,
        proposalsCreated: 4,
        proposalsVoted: 10,
      },
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <DaoHero />
      <DaoStats />
      <DaoTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'proposals' && <ProposalsList proposals={proposals} loading={loading} />}
      {activeTab === 'members' && (
        <div className="px-4 py-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <p className="text-white/60">Members section coming soon...</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'treasury' && (
        <div className="px-4 py-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <p className="text-white/60">Treasury section coming soon...</p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}

