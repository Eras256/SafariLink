'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { DaoHero } from '@/components/dao/DaoHero';
import { DaoStats } from '@/components/dao/DaoStats';
import { ProposalsList } from '@/components/dao/ProposalsList';
import { DaoTabs } from '@/components/dao/DaoTabs';
import { DaoMembers } from '@/components/dao/DaoMembers';
import { DaoTreasury } from '@/components/dao/DaoTreasury';
import { mockProposals } from '@/lib/mockProposals';

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
      {activeTab === 'members' && <DaoMembers members={members} loading={loading} />}
      {activeTab === 'treasury' && <DaoTreasury loading={loading} />}
      <Footer />
    </main>
  );
}

