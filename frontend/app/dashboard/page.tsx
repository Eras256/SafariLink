'use client';

// Force dynamic rendering to avoid SSR issues with Wagmi hooks
export const dynamic = 'force-dynamic';

import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Award, 
  Calendar, 
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  MapPin,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';

interface Hackathon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  bannerImage?: string;
  logoImage?: string;
  organizerName: string;
  organizerWallet: string;
  eventStart: string;
  eventEnd: string;
  locationType: 'IN_PERSON' | 'HYBRID' | 'ONLINE';
  location?: string;
  chains: string[];
  totalPrizePool: number;
  currency: string;
  status: string;
  tags: string[];
  participantCount?: number;
  projectCount?: number;
}

interface DashboardStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalProjects: number;
}

// Inner component that uses wagmi hooks - must be inside WagmiProvider
// This component is only rendered after mount to avoid SSR issues
function DashboardContentInner() {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Hooks must be called unconditionally (React rules)
  // WagmiProvider is always available on client-side via layout providers
  const { address: accountAddress } = useAccount();

  // Update address state
  useEffect(() => {
    if (accountAddress) {
      setAddress(accountAddress);
    } else {
      setAddress(undefined);
    }
  }, [accountAddress]);

  useEffect(() => {
    const fetchHackathons = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        // Fetch all hackathons and filter by organizer
        const response = await fetch(`${apiUrl}/api/hackathons?limit=100`);
        
        if (response.ok) {
          const data = await response.json();
          const allHackathons = data.hackathons || [];
          
          // Filter hackathons where user is organizer
          const organizerHackathons = allHackathons.filter((h: Hackathon) => 
            h.organizerWallet?.toLowerCase() === address.toLowerCase()
          );

          setHackathons(organizerHackathons);

          // Calculate stats (always set stats, even if empty)
          const activeHackathons = organizerHackathons.filter((h: Hackathon) => 
            ['ONGOING', 'REGISTRATION_OPEN', 'JUDGING'].includes(h.status)
          ).length;

          const totalParticipants = organizerHackathons.reduce((sum: number, h: Hackathon) => 
            sum + (h.participantCount || 0), 0
          );

          const totalProjects = organizerHackathons.reduce((sum: number, h: Hackathon) => 
            sum + (h.projectCount || 0), 0
          );

          setStats({
            totalHackathons: organizerHackathons.length,
            activeHackathons,
            totalParticipants,
            totalProjects,
          });
        } else {
          // Set empty stats if no hackathons found
          setStats({
            totalHackathons: 0,
            activeHackathons: 0,
            totalParticipants: 0,
            totalProjects: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        // Set empty stats on error
        setStats({
          totalHackathons: 0,
          activeHackathons: 0,
          totalParticipants: 0,
          totalProjects: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchHackathons();
    } else {
      // Set empty stats if no address
      setStats({
        totalHackathons: 0,
        activeHackathons: 0,
        totalParticipants: 0,
        totalProjects: 0,
      });
      setLoading(false);
    }
  }, [address]);

  if (!address) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-white/40 mx-auto" />
            <h1 className="text-2xl font-bold text-white">Conecta tu wallet</h1>
            <p className="text-white/60">Necesitas conectar tu wallet para acceder al dashboard de organizadores</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Dashboard de Organizadores
            </h1>
            <p className="text-white/60 text-lg">
              Gestiona tus hackathons y visualiza métricas en tiempo real
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white/60">Cargando dashboard...</div>
            </div>
          ) : (
            <>
              {/* Stats Cards - Always show, even if all zeros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glassmorphic p-6 card-lift"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      <h3 className="text-white/60 text-sm">Total Hackathons</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">{(stats?.totalHackathons || 0)}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glassmorphic p-6 card-lift"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-6 h-6 text-green-400" />
                      <h3 className="text-white/60 text-sm">Activos</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">{(stats?.activeHackathons || 0)}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glassmorphic p-6 card-lift"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-6 h-6 text-purple-400" />
                      <h3 className="text-white/60 text-sm">Participantes</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">{(stats?.totalParticipants || 0).toLocaleString()}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glassmorphic p-6 card-lift"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-6 h-6 text-orange-400" />
                      <h3 className="text-white/60 text-sm">Proyectos</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">{(stats?.totalProjects || 0).toLocaleString()}</div>
                  </motion.div>
                </div>

              {/* Hackathons List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Mis Hackathons</h2>
                
                {hackathons.length === 0 ? (
                  <div className="glassmorphic p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No tienes hackathons aún</h3>
                    <p className="text-white/60 mb-6">
                      Crea tu primer hackathon para comenzar a gestionar eventos
                    </p>
                    <Link href="/hackathons">
                      <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        Explorar Hackathons
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathons.map((hackathon, index) => (
                      <motion.div
                        key={hackathon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glassmorphic p-6 card-lift group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                              {hackathon.name}
                            </h3>
                            {hackathon.tagline && (
                              <p className="text-white/60 text-sm">{hackathon.tagline}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hackathon.status === 'ONGOING' 
                              ? 'bg-green-500/20 text-green-400'
                              : hackathon.status === 'REGISTRATION_OPEN'
                              ? 'bg-blue-500/20 text-blue-400'
                              : hackathon.status === 'JUDGING'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {hackathon.status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(hackathon.eventStart), 'dd MMM')} - {format(new Date(hackathon.eventEnd), 'dd MMM yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{hackathon.locationType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Trophy className="w-4 h-4" />
                            <span>${hackathon.totalPrizePool.toLocaleString()} {hackathon.currency}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-white/60">
                              <Users className="w-4 h-4" />
                              <span>{hackathon.participantCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/60">
                              <Award className="w-4 h-4" />
                              <span>{hackathon.projectCount || 0}</span>
                            </div>
                          </div>
                          <Link 
                            href={`/hackathons/${hackathon.slug}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                          >
                            Ver Dashboard
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Error Boundary to catch rendering errors
class DashboardErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in DashboardPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Main component that handles provider availability
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fallback = (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/60">Error cargando dashboard. Por favor recarga la página.</div>
      </div>
      <Footer />
    </main>
  );

  // Show loading state until mounted
  if (!mounted) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Cargando...</div>
        </div>
        <Footer />
      </main>
    );
  }

  // Render content component with error boundary - WagmiProvider is available via layout
  return (
    <DashboardErrorBoundary fallback={fallback}>
      <DashboardContentInner />
    </DashboardErrorBoundary>
  );
}

