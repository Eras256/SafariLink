'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Zap, Target, TrendingUp, Flame, Crown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';

interface GamificationProps {
  hackathonId: string;
  userId?: string;
}

export function Gamification({ hackathonId, userId }: GamificationProps) {
  const {
    badges,
    leaderboard,
    challenges,
    userStats,
    loading,
    error,
    completeChallenge,
    checkBadges,
    refresh,
  } = useGamification({
    hackathonId,
    userId,
    enabled: !!hackathonId,
  });

  const [completingChallenge, setCompletingChallenge] = useState<string | null>(null);

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      setCompletingChallenge(challengeId);
      await completeChallenge(challengeId);
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      alert(error.message || 'Error completing challenge');
    } finally {
      setCompletingChallenge(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'border-gray-400 bg-gray-400/20';
      case 'RARE':
        return 'border-blue-400 bg-blue-400/20';
      case 'EPIC':
        return 'border-purple-400 bg-purple-400/20';
      case 'LEGENDARY':
        return 'border-yellow-400 bg-yellow-400/20';
      default:
        return 'border-gray-400 bg-gray-400/20';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'Common';
      case 'RARE':
        return 'Rare';
      case 'EPIC':
        return 'Epic';
      case 'LEGENDARY':
        return 'Legendary';
      default:
        return rarity;
    }
  };

  if (loading && !badges.length && !leaderboard.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Loading gamification...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-400">Error: {error}</div>
        <Button onClick={refresh} className="glassmorphic-button">
          Retry
        </Button>
      </div>
    );
  }

  const earnedBadges = badges.filter((b) => b.earned);
  const dailyChallenge = challenges.find((c) => !c.completed);

  return (
    <div className="w-full space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6 card-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-semibold">Your Score</h3>
            </div>
            <button
              onClick={refresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-white/60" />
            </button>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {userStats?.totalScore.toLocaleString() || 0}
          </div>
          <div className="text-white/60 text-sm">
            {userStats?.rank ? `Rank #${userStats.rank}` : 'No ranking yet'}
          </div>
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
            {earnedBadges.length}/{badges.length}
          </div>
            <div className="text-white/60 text-sm">Keep it up!</div>
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
            {badges.length > 0
              ? Math.round((earnedBadges.length / badges.length) * 100)
              : 0}%
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Flame className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="text-white font-semibold">{dailyChallenge.title}</h3>
                <p className="text-white/70 text-sm">{dailyChallenge.description}</p>
                <p className="text-white/50 text-xs mt-1">
                  Valid until: {format(new Date(dailyChallenge.endDate), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">+{dailyChallenge.points}</div>
                <div className="text-white/60 text-xs">puntos</div>
              </div>
              <Button
                onClick={() => handleCompleteChallenge(dailyChallenge.id)}
                disabled={dailyChallenge.completed || completingChallenge === dailyChallenge.id}
                className={
                  dailyChallenge.completed
                    ? 'bg-green-500/20'
                    : 'glassmorphic-button'
                }
              >
                {completingChallenge === dailyChallenge.id
                  ? 'Completing...'
                  : dailyChallenge.completed
                  ? 'Completed ✓'
                  : 'Complete Challenge'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* All Challenges */}
      {challenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-semibold text-white">Available Challenges</h3>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`glassmorphic p-4 rounded-lg flex items-center justify-between ${
                  challenge.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">{challenge.title}</h4>
                    {challenge.completed && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{challenge.description}</p>
                  <p className="text-white/50 text-xs mt-1">
                    {format(new Date(challenge.startDate), 'dd/MM')} -{' '}
                    {format(new Date(challenge.endDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-400">+{challenge.points}</div>
                    <div className="text-white/60 text-xs">points</div>
                  </div>
                  {!challenge.completed && (
                    <Button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      disabled={completingChallenge === challenge.id}
                      size="sm"
                      className="glassmorphic-button"
                    >
                      {completingChallenge === challenge.id ? 'Completando...' : 'Completar'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glassmorphic p-4 rounded-lg flex items-center justify-between ${
                  entry.user.id === userId ? 'border-2 border-blue-500/50' : ''
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
                      <span className="text-white font-semibold">
                        {entry.user.username || entry.user.walletAddress.slice(0, 6) + '...'}
                      </span>
                      {entry.user.id === userId && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          Tú
                        </span>
                      )}
                    </div>
                    <div className="text-white/60 text-sm">
                      {entry.badgeCount} badges • {entry.projectCount} proyectos •{' '}
                      {entry.challengeCount} desafíos
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {entry.totalScore.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-xs">puntos</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-white/60">
              No hay participantes en el leaderboard aún
            </div>
          )}
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
          {badges.length > 0 ? (
            badges.map((badge, index) => (
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
                  <div className="text-3xl">{badge.icon || '🏆'}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold">{badge.name}</h4>
                      {badge.earned && (
                        <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          Ganado
                        </div>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{badge.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          badge.rarity === 'COMMON'
                            ? 'bg-gray-500/20 text-gray-300'
                            : badge.rarity === 'RARE'
                            ? 'bg-blue-500/20 text-blue-300'
                            : badge.rarity === 'EPIC'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {getRarityLabel(badge.rarity)}
                      </span>
                      <span className="text-white/40 text-xs">+{badge.points} pts</span>
                      {badge.nftTokenId && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          NFT #{badge.nftTokenId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {badge.earned && badge.earnedAt && (
                  <div className="text-white/40 text-xs">
                    Ganado {format(new Date(badge.earnedAt), 'dd/MM/yyyy')}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-white/60">
              No hay badges disponibles aún
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
