'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Award, 
  Clock, 
  Globe,
  BarChart3,
  Activity,
  Zap,
  DollarSign,
  Target,
  Eye,
  MousePointerClick,
  UserCheck,
  FileText,
  Heart,
  ThumbsUp,
  MapPin,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingDown,
  Percent,
  Calendar,
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useAccount } from 'wagmi';
import { format } from 'date-fns';
import { PrizeDistribution } from './PrizeDistribution';

interface OrganizerDashboardProps {
  hackathonId: string;
}

export function OrganizerDashboard({ hackathonId }: OrganizerDashboardProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'sponsors' | 'feedback'>('overview');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data, realtimeMetrics, loading, error, isConnected, refresh } = useDashboardMetrics({
    hackathonId,
    walletAddress: address,
    enabled: !!hackathonId && !!address,
    refreshInterval: 30000,
  });

  useEffect(() => {
    if (realtimeMetrics) {
      setLastUpdate(new Date(realtimeMetrics.timestamp));
    }
  }, [realtimeMetrics]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-400">Error: {error}</div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">No hay datos disponibles</div>
      </div>
    );
  }

  const { metrics, stats, feedback, sponsors } = data;

  // Calculate percentage changes (mock for now, can be enhanced with historical data)
  const calculateChange = (current: number, previous: number = current * 0.9) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const metricCards = [
    {
      title: 'Total Participantes',
      value: metrics.totalParticipants.toLocaleString(),
      change: `+${calculateChange(metrics.totalParticipants).toFixed(1)}%`,
      icon: Users,
      color: 'blue',
      description: `${metrics.activeParticipants} activos ahora`,
    },
    {
      title: 'Participantes Activos',
      value: metrics.activeParticipants.toLocaleString(),
      change: `+${calculateChange(metrics.activeParticipants).toFixed(1)}%`,
      icon: Activity,
      color: 'green',
      description: 'Última hora',
      isRealtime: true,
    },
    {
      title: 'Proyectos Enviados',
      value: `${metrics.submittedProjects}/${metrics.totalProjects}`,
      change: `${metrics.submissionRate.toFixed(1)}% tasa`,
      icon: Award,
      color: 'purple',
      description: `${metrics.totalProjects} totales`,
    },
    {
      title: 'Tasa de Engagement',
      value: `${metrics.averageEngagement.toFixed(1)}%`,
      change: `+${calculateChange(metrics.averageEngagement).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'orange',
      description: `${metrics.totalInteractions} interacciones`,
    },
    {
      title: 'Mensajes Enviados',
      value: metrics.totalMessages.toLocaleString(),
      change: `+${calculateChange(metrics.totalMessages).toFixed(1)}%`,
      icon: MessageSquare,
      color: 'pink',
      description: `${metrics.activeRooms} salas activas`,
    },
    {
      title: 'Salas Activas',
      value: metrics.activeRooms.toString(),
      change: `${metrics.totalActiveInRooms} usuarios`,
      icon: Globe,
      color: 'cyan',
      description: 'En networking',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp },
    { id: 'sponsors', label: 'ROI Sponsors', icon: DollarSign },
    { id: 'feedback', label: 'Feedback', icon: Heart },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Dashboard de Organizadores</h2>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Tiempo Real</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">Desconectado</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-white/60 text-sm">
              Actualizado: {format(lastUpdate, 'HH:mm:ss')}
            </span>
          )}
          <button
            onClick={refresh}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-blue-500/20 text-blue-400',
            green: 'bg-green-500/20 text-green-400',
            purple: 'bg-purple-500/20 text-purple-400',
            orange: 'bg-orange-500/20 text-orange-400',
            pink: 'bg-pink-500/20 text-pink-400',
            cyan: 'bg-cyan-500/20 text-cyan-400',
          };

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphic p-6 card-lift relative overflow-hidden"
            >
              {card.isRealtime && isConnected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[card.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-green-400 text-sm font-medium">{card.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-white/60 text-sm mb-1">{card.title}</div>
              <div className="text-white/40 text-xs">{card.description}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Participants Over Time */}
            <div className="glassmorphic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Participantes en el Tiempo</h3>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-2">
                {stats.participantsOverTime.map((point, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-white/60 text-sm">
                      {format(new Date(point.date), 'dd/MM')}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(point.count / Math.max(...stats.participantsOverTime.map(p => p.count))) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-blue-500 h-full"
                      />
                    </div>
                    <div className="w-16 text-white text-sm text-right">{point.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects by Track */}
            <div className="glassmorphic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Proyectos por Track</h3>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-3">
                {stats.projectsByTrack.map((track, i) => (
                  <div key={track.track} className="flex items-center gap-4">
                    <div className="w-32 text-white/60 text-sm truncate">{track.track}</div>
                    <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(track.count / Math.max(...stats.projectsByTrack.map(t => t.count), 1)) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-purple-500 h-full"
                      />
                    </div>
                    <div className="w-12 text-white text-sm text-right">{track.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="glassmorphic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Top Países</h3>
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-3">
                {stats.topCountries.slice(0, 5).map((country, i) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-white">{country.country}</span>
                    </div>
                    <span className="text-white/60">{country.participants} participantes</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement by Hour */}
            <div className="glassmorphic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Engagement por Hora</h3>
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div className="space-y-2">
                {stats.engagementByHour
                  .filter((h) => h.engagement > 0)
                  .slice(-12)
                  .map((hour, i) => (
                    <div key={hour.hour} className="flex items-center gap-4">
                      <div className="w-16 text-white/60 text-sm">{hour.hour}:00</div>
                      <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(hour.engagement / Math.max(...stats.engagementByHour.map(h => h.engagement), 1)) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="bg-orange-500 h-full"
                        />
                      </div>
                      <div className="w-12 text-white text-sm text-right">{hour.engagement}</div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'engagement' && (
          <motion.div
            key="engagement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ThumbsUp className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">Votos Totales</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{metrics.totalVotes.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Peso total: {metrics.totalVotes}</div>
              </div>

              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <h4 className="text-lg font-semibold text-white">Comentarios</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{metrics.totalComments.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Promedio: {feedback.averageCommentsPerProject.toFixed(1)} por proyecto</div>
              </div>

              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-semibold text-white">Interacciones</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{metrics.totalInteractions.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Engagement: {metrics.averageEngagement.toFixed(1)}%</div>
              </div>
            </div>

            {/* Engagement by Hour Chart */}
            <div className="glassmorphic p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Engagement por Hora (Últimas 24h)</h3>
              <div className="h-64 flex items-end gap-2">
                {stats.engagementByHour.map((hour) => {
                  const maxEngagement = Math.max(...stats.engagementByHour.map(h => h.engagement), 1);
                  const height = (hour.engagement / maxEngagement) * 100;
                  return (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t"
                        style={{ minHeight: '4px' }}
                      />
                      <span className="text-white/40 text-xs">{hour.hour}h</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sponsors' && (
          <motion.div
            key="sponsors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sponsor ROI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glassmorphic p-6">
                <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">${sponsors.totalInvestment.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Inversión Total</div>
              </div>
              <div className="glassmorphic p-6">
                <Eye className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{sponsors.totalImpressions.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Impresiones</div>
              </div>
              <div className="glassmorphic p-6">
                <MousePointerClick className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{sponsors.totalClicks.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Clics</div>
              </div>
              <div className="glassmorphic p-6">
                <UserCheck className="w-6 h-6 text-orange-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{sponsors.totalConversions.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Conversiones</div>
              </div>
            </div>

            {/* Sponsor ROI Table */}
            <div className="glassmorphic p-6">
              <h3 className="text-xl font-semibold text-white mb-4">ROI por Sponsor</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Sponsor</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">Inversión</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">Impresiones</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">Clics</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">Conversiones</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">ROI</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">CPM</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">CPC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.roi.length > 0 ? (
                      sponsors.roi.map((sponsor, i) => (
                        <motion.tr
                          key={sponsor.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-3 px-4 text-white font-medium">{sponsor.name}</td>
                          <td className="py-3 px-4 text-right text-white">${sponsor.investment.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-white/80">{sponsor.impressions.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-white/80">{sponsor.clicks.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-white/80">{sponsor.conversions.toLocaleString()}</td>
                          <td className={`py-3 px-4 text-right font-semibold ${sponsor.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {sponsor.roi >= 0 ? '+' : ''}{sponsor.roi.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right text-white/60">${sponsor.cpm.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-white/60">${sponsor.cpc.toFixed(2)}</td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-white/60">
                          No hay sponsors registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Feedback Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ThumbsUp className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">Votos Promedio</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{feedback.averageVotesPerProject.toFixed(1)}</div>
                <div className="text-white/60 text-sm">Por proyecto</div>
              </div>

              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <h4 className="text-lg font-semibold text-white">Comentarios Promedio</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{feedback.averageCommentsPerProject.toFixed(1)}</div>
                <div className="text-white/60 text-sm">Por proyecto</div>
              </div>

              <div className="glassmorphic p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-semibold text-white">Top Proyectos</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{feedback.topProjects.length}</div>
                <div className="text-white/60 text-sm">Con más engagement</div>
              </div>
            </div>

            {/* Top Projects by Feedback */}
            <div className="glassmorphic p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Top Proyectos por Engagement</h3>
              <div className="space-y-3">
                {feedback.topProjects.length > 0 ? (
                  feedback.topProjects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 font-bold">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{project.name}</div>
                          <div className="text-white/60 text-sm">
                            {project.votes} votos • {project.comments} comentarios
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-white font-semibold">{project.engagementScore.toFixed(1)}</div>
                          <div className="text-white/60 text-xs">Score</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{project.voteWeight}</div>
                          <div className="text-white/60 text-xs">Peso</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">No hay proyectos con feedback aún</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
