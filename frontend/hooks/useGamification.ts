import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '@/lib/api/config';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  badgeType: string;
  points: number;
  earned: boolean;
  earnedAt: string | null;
  nftTokenId: string | null;
}

interface LeaderboardEntry {
  id: string;
  rank: number | null;
  totalScore: number;
  badgeCount: number;
  projectCount: number;
  challengeCount: number;
  user: {
    id: string;
    username: string | null;
    avatar: string | null;
    walletAddress: string;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  challengeType: string;
  points: number;
  startDate: string;
  endDate: string;
  completed?: boolean;
}

interface UserStats {
  score: number;
  rank: number | null;
  badgeCount: number;
  projectCount: number;
  challengeCount: number;
  totalScore: number;
}

interface UseGamificationOptions {
  hackathonId: string;
  userId?: string;
  enabled?: boolean;
}

export function useGamification({
  hackathonId,
  userId,
  enabled = true,
}: UseGamificationOptions) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch badges
  const fetchBadges = useCallback(async () => {
    if (!hackathonId || !userId) return;

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/gamification/hackathon/${hackathonId}/badges`,
        {
          headers: userId ? { 
            'x-user-id': userId,
            'x-wallet-address': userId, // Fallback
          } : {},
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (err: any) {
      console.error('Error fetching badges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hackathonId, userId]);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    if (!hackathonId) return;

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/gamification/hackathon/${hackathonId}/leaderboard?limit=100`
      );

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.entries || []);
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  // Fetch challenges
  const fetchChallenges = useCallback(async () => {
    if (!hackathonId) return;

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/gamification/hackathon/${hackathonId}/challenges`,
        {
          headers: userId ? { 
            'x-user-id': userId,
            'x-wallet-address': userId, // Fallback
          } : {},
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
      }
    } catch (err: any) {
      console.error('Error fetching challenges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hackathonId, userId]);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    if (!hackathonId || !userId) return;

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/gamification/hackathon/${hackathonId}/stats`,
        {
          headers: { 
            'x-user-id': userId,
            'x-wallet-address': userId, // Fallback
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hackathonId, userId]);

  // Complete challenge
  const completeChallenge = useCallback(
    async (challengeId: string) => {
      if (!hackathonId || !userId) {
        throw new Error('User ID and hackathon ID required');
      }

      try {
        const apiUrl = getApiUrl();
        const response = await fetch(
          `${apiUrl}/api/gamification/hackathon/${hackathonId}/challenge/${challengeId}/complete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
              'x-wallet-address': userId, // Fallback
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to complete challenge');
        }

        const data = await response.json();

        // Refresh data
        await Promise.all([
          fetchChallenges(),
          fetchUserStats(),
          fetchBadges(),
          fetchLeaderboard(),
        ]);

        return data.userChallenge;
      } catch (err: any) {
        console.error('Error completing challenge:', err);
        throw err;
      }
    },
    [hackathonId, userId, fetchChallenges, fetchUserStats, fetchBadges, fetchLeaderboard]
  );

  // Check badges (trigger badge check)
  const checkBadges = useCallback(async () => {
    if (!hackathonId || !userId) {
      throw new Error('User ID and hackathon ID required');
    }

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/gamification/hackathon/${hackathonId}/check-badges`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
            'x-wallet-address': userId, // Fallback
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check badges');
      }

      const data = await response.json();

      // Refresh data
      await Promise.all([fetchBadges(), fetchUserStats(), fetchLeaderboard()]);

      return data;
    } catch (err: any) {
      console.error('Error checking badges:', err);
      throw err;
    }
  }, [hackathonId, userId, fetchBadges, fetchUserStats, fetchLeaderboard]);

  // Load all data
  useEffect(() => {
    if (!enabled || !hackathonId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchBadges(),
          fetchLeaderboard(),
          fetchChallenges(),
          userId && fetchUserStats(),
        ]);
      } catch (err) {
        console.error('Error loading gamification data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [enabled, hackathonId, userId, fetchBadges, fetchLeaderboard, fetchChallenges, fetchUserStats]);

  return {
    badges,
    leaderboard,
    challenges,
    userStats,
    loading,
    error,
    completeChallenge,
    checkBadges,
    refresh: async () => {
      await Promise.all([
        fetchBadges(),
        fetchLeaderboard(),
        fetchChallenges(),
        userId && fetchUserStats(),
      ]);
    },
  };
}

