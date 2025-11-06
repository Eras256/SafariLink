'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Zap, Target, TrendingUp, Flame, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  badges: number;
  projects: number;
  avatar?: string;
}

interface GamificationProps {
  hackathonId: string;
  userId?: string;
}

export function Gamification({ hackathonId, userId }: GamificationProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState<{
    title: string;
    description: string;
    points: number;
    completed: boolean;
  } | null>(null);

  useEffect(() => {
    // Mock data - in production, fetch from API
    setBadges([
      {
        id: '1',
        name: 'First Project',
        description: 'Submit your first project',
        icon: '🎯',
        earned: true,
        earnedAt: new Date(Date.now() - 86400000),
        rarity: 'common',
      },
      {
        id: '2',
        name: 'Team Player',
        description: 'Join a team of 3+ members',
        icon: '👥',
        earned: true,
        earnedAt: new Date(Date.now() - 43200000),
        rarity: 'common',
      },
      {
        id: '3',
        name: 'Code Master',
        description: 'Deploy a smart contract',
        icon: '💻',
        earned: false,
        rarity: 'rare',
      },
      {
        id: '4',
        name: 'Feedback Hero',
        description: 'Give feedback to 10 projects',
        icon: '💬',
        earned: false,
        rarity: 'rare',
      },
      {
        id: '5',
        name: 'Networking Pro',
        description: 'Join 5 networking rooms',
        icon: '🌐',
        earned: false,
        rarity: 'epic',
      },
      {
        id: '6',
        name: 'Hackathon Champion',
        description: 'Win first place',
        icon: '🏆',
        earned: false,
        rarity: 'legendary',
      },
    ]);

    setLeaderboard([
      { rank: 1, userId: 'user1', username: 'Alice', score: 2450, badges: 12, projects: 3 },
      { rank: 2, userId: 'user2', username: 'Bob', score: 2180, badges: 10, projects: 2 },
      { rank: 3, userId: 'user3', username: 'Charlie', score: 1950, badges: 9, projects: 2 },
      { rank: 4, userId: userId || 'you', username: 'You', score: 1820, badges: 8, projects: 1 },
      { rank: 5, userId: 'user5', username: 'David', score: 1650, badges: 7, projects: 1 },
    ]);

    setUserScore(1820);
    setUserRank(4);

    setDailyChallenge({
      title: 'Share Your Progress',
      description: 'Post an update about your project progress',
      points: 50,
      completed: false,
    });
  }, [hackathonId, userId]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-400 bg-gray-400/20';
      case 'rare':
        return 'border-blue-400 bg-blue-400/20';
      case 'epic':
        return 'border-purple-400 bg-purple-400/20';
      case 'legendary':
        return 'border-yellow-400 bg-yellow-400/20';
      default:
        return 'border-gray-400 bg-gray-400/20';
    }
  };

  const handleCompleteChallenge = () => {
    if (dailyChallenge && !dailyChallenge.completed) {
      setDailyChallenge({ ...dailyChallenge, completed: true });
      setUserScore((prev) => prev + dailyChallenge.points);
      // In production: Update via API
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6 card-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-white font-semibold">Your Score</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{userScore.toLocaleString()}</div>
          <div className="text-white/60 text-sm">Rank #{userRank}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphic p-6 card-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-white font-semibold">Badges Earned</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {badges.filter((b) => b.earned).length}/{badges.length}
          </div>
          <div className="text-white/60 text-sm">Keep going!</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphic p-6 card-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-white font-semibold">Progress</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {Math.round((badges.filter((b) => b.earned).length / badges.length) * 100)}%
          </div>
          <div className="text-white/60 text-sm">Complete all badges</div>
        </motion.div>
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6 border-2 border-orange-500/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="text-white font-semibold">{dailyChallenge.title}</h3>
                <p className="text-white/70 text-sm">{dailyChallenge.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">+{dailyChallenge.points}</div>
                <div className="text-white/60 text-xs">points</div>
              </div>
              <Button
                onClick={handleCompleteChallenge}
                disabled={dailyChallenge.completed}
                className={dailyChallenge.completed ? 'bg-green-500/20' : 'glassmorphic-button'}
              >
                {dailyChallenge.completed ? 'Completed ✓' : 'Complete Challenge'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphic p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-semibold text-white">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glassmorphic p-4 rounded-lg flex items-center justify-between ${
                entry.userId === userId ? 'border-2 border-blue-500/50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-400 text-black'
                      : entry.rank === 2
                      ? 'bg-gray-300 text-black'
                      : entry.rank === 3
                      ? 'bg-orange-400 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {entry.rank === 1 ? <Crown className="w-5 h-5" /> : entry.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{entry.username}</span>
                    {entry.userId === userId && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">
                    {entry.badges} badges • {entry.projects} projects
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{entry.score.toLocaleString()}</div>
                <div className="text-white/60 text-xs">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphic p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-semibold text-white">Badges</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`glassmorphic p-4 rounded-lg border-2 ${
                badge.earned ? getRarityColor(badge.rarity) : 'border-white/10 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{badge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">{badge.name}</h4>
                    {badge.earned && (
                      <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        Earned
                      </div>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{badge.description}</p>
                </div>
              </div>
              {badge.earned && badge.earnedAt && (
                <div className="text-white/40 text-xs">
                  Earned {badge.earnedAt.toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

