'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Award, 
  Clock, 
  Globe,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface DashboardMetrics {
  totalParticipants: number;
  activeParticipants: number;
  totalProjects: number;
  submittedProjects: number;
  totalMessages: number;
  activeRooms: number;
  averageEngagement: number;
  countriesRepresented: number;
}

interface DashboardStats {
  participantsOverTime: Array<{ date: string; count: number }>;
  projectsByTrack: Array<{ track: string; count: number }>;
  engagementByHour: Array<{ hour: number; engagement: number }>;
  topCountries: Array<{ country: string; participants: number }>;
}

interface OrganizerDashboardProps {
  hackathonId: string;
}

export function OrganizerDashboard({ hackathonId }: OrganizerDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from API
    setTimeout(() => {
      setMetrics({
        totalParticipants: 1247,
        activeParticipants: 892,
        totalProjects: 156,
        submittedProjects: 89,
        totalMessages: 5420,
        activeRooms: 12,
        averageEngagement: 87,
        countriesRepresented: 34,
      });

      setStats({
        participantsOverTime: [
          { date: 'Day 1', count: 450 },
          { date: 'Day 2', count: 780 },
          { date: 'Day 3', count: 892 },
        ],
        projectsByTrack: [
          { track: 'DeFi', count: 45 },
          { track: 'NFT', count: 32 },
          { track: 'AI & Web3', count: 28 },
          { track: 'Infrastructure', count: 21 },
        ],
        engagementByHour: [
          { hour: 0, engagement: 45 },
          { hour: 6, engagement: 32 },
          { hour: 12, engagement: 89 },
          { hour: 18, engagement: 92 },
        ],
        topCountries: [
          { country: 'Kenya', participants: 234 },
          { country: 'Nigeria', participants: 189 },
          { country: 'South Africa', participants: 156 },
          { country: 'Ghana', participants: 98 },
        ],
      });

      setLoading(false);
    }, 1000);
  }, [hackathonId]);

  if (loading || !metrics || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Participants',
      value: metrics.totalParticipants.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Now',
      value: metrics.activeParticipants.toLocaleString(),
      change: '+23%',
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Projects Submitted',
      value: `${metrics.submittedProjects}/${metrics.totalProjects}`,
      change: '+18%',
      icon: Award,
      color: 'purple',
    },
    {
      title: 'Engagement Rate',
      value: `${metrics.averageEngagement}%`,
      change: '+8%',
      icon: TrendingUp,
      color: 'orange',
    },
    {
      title: 'Messages Sent',
      value: metrics.totalMessages.toLocaleString(),
      change: '+45%',
      icon: MessageSquare,
      color: 'pink',
    },
    {
      title: 'Active Rooms',
      value: metrics.activeRooms.toString(),
      change: '+2',
      icon: Globe,
      color: 'cyan',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphic p-6 card-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${card.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${card.color}-400`} />
                </div>
                <span className="text-green-400 text-sm font-medium">{card.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-white/60 text-sm">{card.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participants Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphic p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Participants Over Time</h3>
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            {stats.participantsOverTime.map((point, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-20 text-white/60 text-sm">{point.date}</div>
                <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(point.count / 1000) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="bg-blue-500 h-full"
                  />
                </div>
                <div className="w-16 text-white text-sm text-right">{point.count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects by Track */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphic p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Projects by Track</h3>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div className="space-y-3">
            {stats.projectsByTrack.map((track, i) => (
              <div key={track.track} className="flex items-center gap-4">
                <div className="w-24 text-white/60 text-sm">{track.track}</div>
                <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(track.count / 50) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="bg-purple-500 h-full"
                  />
                </div>
                <div className="w-12 text-white text-sm text-right">{track.count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Top Countries</h3>
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-3">
            {stats.topCountries.map((country, i) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-white">{country.country}</span>
                </div>
                <span className="text-white/60">{country.participants} participants</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engagement by Hour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Engagement by Hour</h3>
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div className="space-y-2">
            {stats.engagementByHour.map((hour, i) => (
              <div key={hour.hour} className="flex items-center gap-4">
                <div className="w-16 text-white/60 text-sm">{hour.hour}:00</div>
                <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hour.engagement}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="bg-orange-500 h-full"
                  />
                </div>
                <div className="w-12 text-white text-sm text-right">{hour.engagement}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

