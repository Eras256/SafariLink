'use client';

// Force dynamic rendering to avoid SSR issues with Wagmi hooks
export const dynamic = 'force-dynamic';

import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { TalentProtocolBadge } from '@/components/profile/TalentProtocolBadge';
import { useTalentProtocol } from '@/hooks/useTalentProtocol';
import { NFTCertificates } from '@/components/hackathons/NFTCertificates';

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
  const [syncSuccess, setSyncSuccess] = useState(false);
  const {
    profile: talentProfile,
    loading: talentLoading,
    hasProfile: hasTalentProfile,
    syncProfile: syncTalentProfile,
    error: talentError,
  } = useTalentProtocol();

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
        // Usar el sistema embebido de configuración de API
        const { getApiEndpoint } = await import('@/lib/api/config');
        const { API_ENDPOINTS } = await import('@/lib/constants');
        
        // Fetch all hackathons and filter by organizer
        const endpoint = getApiEndpoint(`${API_ENDPOINTS.HACKATHONS.LIST}?limit=100`);
        const response = await fetch(endpoint);
        
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
        } else if (response.status === 503) {
          // Backend no disponible - silenciosamente usar stats vacíos
          setStats({
            totalHackathons: 0,
            activeHackathons: 0,
            totalParticipants: 0,
            totalProjects: 0,
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
      } catch (error: any) {
        // Solo loggear errores que no sean 503 (backend no disponible)
        if (!error.message?.includes('503') && !error.message?.includes('Service Unavailable')) {
          console.error('Error fetching hackathons:', error);
        }
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
            <h1 className="text-2xl font-bold text-white">Connect your wallet</h1>
            <p className="text-white/60">You need to connect your wallet to access the organizer dashboard</p>
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
              Organizer Dashboard
            </h1>
            <p className="text-white/60 text-lg">
              Manage your hackathons and view real-time metrics
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Talent Protocol Identity</h2>
                <p className="text-white/60 text-sm">
                  Sync your on-chain reputation to boost your builder score.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  setSyncSuccess(false);
                  try {
                    await syncTalentProfile();
                    setSyncSuccess(true);
                    // Clear success message after 5 seconds
                    setTimeout(() => setSyncSuccess(false), 5000);
                  } catch (error) {
                    // Error is handled by the hook
                  }
                }}
                className="border-white/20 text-white hover:bg-white/10"
                disabled={talentLoading || !address}
              >
                {talentLoading ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>

            {syncSuccess && hasTalentProfile && (
              <div className="mb-4 glassmorphic p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-sm">
                    Talent Protocol profile synced successfully
                  </p>
                </div>
              </div>
            )}

            {talentError && !talentError.includes('Backend not') && !talentError.includes('Proxy error') && (
              <div className="mb-4 glassmorphic p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                <p className="text-red-400 text-sm font-semibold mb-2">
                  {talentError}
                </p>
                <div className="text-red-300/70 text-xs space-y-1">
                  <p>To sync your Talent Protocol profile:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                    <li>Make sure you have created a profile on <a href="https://app.talentprotocol.com" target="_blank" rel="noopener noreferrer" className="underline">Talent Protocol</a></li>
                    <li>Use the same wallet address you&apos;re using here</li>
                    <li>Verify that your profile is complete and published</li>
                    <li>If you just created your profile, wait a few minutes and try again.</li>
                  </ul>
                  <p className="mt-2">
                    <a href="https://app.talentprotocol.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                      Go to Talent Protocol →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {talentLoading ? (
              <div className="glassmorphic p-4 sm:p-5 rounded-lg border border-white/10 animate-pulse h-32" />
            ) : hasTalentProfile ? (
              <TalentProtocolBadge profile={talentProfile} />
            ) : (
              <div className="glassmorphic p-4 sm:p-5 md:p-6 rounded-lg border border-dashed border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">TP</span>
                      </div>
                      <h3 className="text-white font-semibold text-base">Connect your Talent Protocol profile</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Create or connect your Talent Protocol profile to showcase your achievements, supporters, and on-chain reputation. 
                      This will automatically increase your builder score.
                    </p>
                    <ul className="text-white/60 text-xs space-y-1 mb-4">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        Showcase your achievements and milestones
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        Increase your builder score
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        Verified on-chain reputation
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-shrink-0">
                    <a
                      href="https://www.talentprotocol.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span>Go to Talent Protocol</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <Button
                      variant="outline"
                      onClick={() => {
                        void syncTalentProfile();
                      }}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-sm"
                      disabled={talentLoading || !address}
                    >
                      {talentLoading ? 'Syncing...' : 'Sync after connecting'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white/60">Loading dashboard...</div>
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
                      <h3 className="text-white/60 text-sm">Active</h3>
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
                      <h3 className="text-white/60 text-sm">Participants</h3>
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
                      <h3 className="text-white/60 text-sm">Projects</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">{(stats?.totalProjects || 0).toLocaleString()}</div>
                  </motion.div>
                </div>

              {/* NFT Certificates */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Mis Certificados NFT</h2>
                <NFTCertificates userId={address} />
              </div>

              {/* Hackathons List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">My Hackathons</h2>
                
                {hackathons.length === 0 ? (
                  <div className="glassmorphic p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">You don&apos;t have any hackathons yet</h3>
                    <p className="text-white/60 mb-6">
                      Create your first hackathon to start managing events
                    </p>
                    <Link href="/hackathons">
                      <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        Explore Hackathons
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
                            View Dashboard
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
        <div className="text-white/60">Error loading dashboard. Please refresh the page.</div>
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
          <div className="text-white/60">Loading...</div>
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

