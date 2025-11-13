import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiUrl, getApiEndpoint } from '@/lib/api/config';
import { API_ENDPOINTS } from '@/lib/constants';

interface DashboardMetrics {
  totalParticipants: number;
  activeParticipants: number;
  totalProjects: number;
  submittedProjects: number;
  submissionRate: number;
  totalMessages: number;
  activeRooms: number;
  totalActiveInRooms: number;
  averageEngagement: number;
  countriesRepresented: number;
  totalVotes: number;
  totalComments: number;
  totalInteractions: number;
}

interface DashboardStats {
  participantsOverTime: Array<{ date: string; count: number }>;
  projectsByTrack: Array<{ track: string; count: number }>;
  engagementByHour: Array<{ hour: number; engagement: number }>;
  topCountries: Array<{ country: string; participants: number }>;
}

interface ProjectFeedback {
  id: string;
  name: string;
  votes: number;
  voteWeight: number;
  comments: number;
  engagementScore: number;
}

interface SponsorROI {
  name: string;
  investment: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  cpm: number;
  cpc: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  stats: DashboardStats;
  feedback: {
    topProjects: ProjectFeedback[];
    averageVotesPerProject: number;
    averageCommentsPerProject: number;
  };
  sponsors: {
    roi: SponsorROI[];
    totalInvestment: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
  };
}

interface RealtimeMetrics {
  timestamp: string;
  activeParticipants: number;
  recentMessages: number;
  recentProjects: number;
  totalParticipants: number;
}

interface UseDashboardMetricsOptions {
  hackathonId: string;
  userId?: string;
  walletAddress?: string;
  token?: string;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useDashboardMetrics({
  hackathonId,
  userId,
  walletAddress,
  token,
  enabled = true,
  refreshInterval = 30000, // 30 seconds
}: UseDashboardMetricsOptions) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!hackathonId || !enabled) return;

    try {
      let url = getApiEndpoint(API_ENDPOINTS.ORGANIZER.DASHBOARD(hackathonId));
      if (walletAddress) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('walletAddress', walletAddress);
        url = urlObj.toString();
      }

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(walletAddress && { 'X-Wallet-Address': walletAddress }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [hackathonId, walletAddress, token, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Set up periodic refresh
  useEffect(() => {
    if (!enabled) return;

    refreshIntervalRef.current = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [enabled, refreshInterval, fetchDashboardData]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enabled || !hackathonId || (!userId && !walletAddress)) return;

    const apiUrl = getApiUrl();
    const newSocket = io(apiUrl, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Dashboard WebSocket connected');
      setIsConnected(true);

      // Subscribe to dashboard updates
      newSocket.emit('dashboard:subscribe', {
        hackathonId,
        userId,
        walletAddress,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Dashboard WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (error: any) => {
      console.error('Dashboard WebSocket error:', error);
      setError(error.message || 'WebSocket error');
    });

    // Listen for dashboard metrics updates
    newSocket.on('dashboard:metrics', (metrics: RealtimeMetrics) => {
      setRealtimeMetrics(metrics);

      // Update data with real-time metrics
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            activeParticipants: metrics.activeParticipants,
            totalParticipants: metrics.totalParticipants,
            totalMessages: prev.metrics.totalMessages + metrics.recentMessages,
            totalProjects: prev.metrics.totalProjects + metrics.recentProjects,
          },
        };
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('dashboard:unsubscribe', { hackathonId });
        newSocket.close();
      }
      socketRef.current = null;
    };
  }, [enabled, hackathonId, userId, walletAddress, token]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    realtimeMetrics,
    loading,
    error,
    isConnected,
    refresh,
  };
}

