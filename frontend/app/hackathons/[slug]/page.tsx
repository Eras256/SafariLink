'use client';

// Force dynamic rendering to avoid SSR issues with Wagmi hooks
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { VirtualNetworking } from '@/components/hackathons/VirtualNetworking';
import { RealTimeFeedback } from '@/components/hackathons/RealTimeFeedback';
import { Gamification } from '@/components/hackathons/Gamification';
import { OrganizerDashboard } from '@/components/hackathons/OrganizerDashboard';
import { AIMentor } from '@/components/hackathons/AIMentor';
import { TeamMatching } from '@/components/hackathons/TeamMatching';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Trophy, Code, MessageSquare, Video, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { findMockHackathonBySlug } from '@/lib/mockHackathons';

interface Hackathon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  bannerImage?: string;
  logoImage?: string;
  organizerName: string;
  organizerWallet?: string;
  eventStart: string;
  eventEnd: string;
  locationType: 'IN_PERSON' | 'HYBRID' | 'ONLINE';
  location?: string;
  chains: string[];
  totalPrizePool: number;
  currency: string;
  participantCount: number;
  projectCount: number;
  status: string;
  tags: string[];
}

// Inner component that uses wagmi hooks - must be inside WagmiProvider
// This component is only rendered after mount to avoid SSR issues
interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

function HackathonContentInner({ slug }: { slug: string }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'networking' | 'mentor' | 'projects' | 'feedback' | 'leaderboard' | 'team-matching'>('overview');
  const [isOrganizer, setIsOrganizer] = useState(false);

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

  // Fetch projects for hackathon
  const fetchProjects = async (hackathonId: string) => {
    setLoadingProjects(true);
    try {
      const { getApiEndpoint } = await import('@/lib/api/config');
      const { API_ENDPOINTS } = await import('@/lib/constants');
      const response = await fetch(getApiEndpoint(API_ENDPOINTS.HACKATHONS.PROJECTS(hackathonId)));
      
      if (response.ok) {
        const data = await response.json();
        const projectsList = data.projects || [];
        setProjects(projectsList);
        
        // Auto-select first project if available
        if (projectsList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    const fetchHackathon = async () => {
      // Try to fetch from API, but fallback to mock data if backend is unavailable
      const { getApiEndpoint } = await import('@/lib/api/config');
      const { API_ENDPOINTS } = await import('@/lib/constants');
      let controller: AbortController | null = null;
      let timeoutId: number | null = null;

      try {
        if (typeof AbortController !== 'undefined') {
          controller = new AbortController();
          timeoutId = window.setTimeout(() => {
            if (controller) {
              controller.abort();
            }
          }, 5000); // 5 second timeout
        }

        try {
          const fetchOptions: RequestInit = controller
            ? { signal: controller.signal }
            : {};

          const response = await fetch(
            getApiEndpoint(API_ENDPOINTS.HACKATHONS.DETAIL(slug)),
            fetchOptions
          );

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (response && response.ok) {
            try {
              const data = await response.json();
              const hackathonData = data.hackathon || data;
              setHackathon(hackathonData);
              
              // Check if current user is organizer
              if (address && hackathonData.organizerWallet) {
                setIsOrganizer(
                  hackathonData.organizerWallet.toLowerCase() === address.toLowerCase()
                );
              }
              
              setLoading(false);
              
              // Fetch projects for this hackathon
              if (hackathonData.id) {
                fetchProjects(hackathonData.id);
              }
              
              return; // Successfully fetched from API
            } catch (parseError) {
              // JSON parse error - use fallback
              console.warn('Failed to parse hackathon response, using fallback data');
            }
          }
        } catch (fetchError: unknown) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // Network error or timeout - use fallback data silently
          // Don't log these errors as they're expected when backend is unavailable
          // The ErrorSuppressor component will handle suppressing these errors
        }
      } catch (error: unknown) {
        // Any other error - use fallback
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Silently handle errors - use fallback data
        // Don't log these errors as they're expected when backend is unavailable
      }

      // Fallback to mock data (works without backend)
      // Try to find the hackathon by slug in mock data
      const mockHackathon = findMockHackathonBySlug(slug);
      
      if (mockHackathon) {
        // Convert MockHackathon to Hackathon format
        const fallbackHackathon: Hackathon = {
          id: mockHackathon.id,
          slug: mockHackathon.slug,
          name: mockHackathon.name,
          tagline: mockHackathon.tagline,
          description: mockHackathon.description,
          bannerImage: mockHackathon.bannerImage,
          logoImage: mockHackathon.logoImage,
          organizerName: mockHackathon.organizerName,
          organizerWallet: mockHackathon.organizerWallet,
          eventStart: mockHackathon.eventStart,
          eventEnd: mockHackathon.eventEnd,
          locationType: mockHackathon.locationType,
          location: mockHackathon.location,
          chains: mockHackathon.chains,
          totalPrizePool: mockHackathon.totalPrizePool,
          currency: mockHackathon.currency,
          participantCount: mockHackathon.participantCount,
          projectCount: mockHackathon.projectCount,
          status: mockHackathon.status,
          tags: mockHackathon.tags,
        };
        setHackathon(fallbackHackathon);
        setLoading(false);
        
        // Fetch projects for this hackathon
        if (mockHackathon.id) {
          fetchProjects(mockHackathon.id);
        }
      } else {
        // If hackathon not found in mock data, use a generic fallback
        const fallbackHackathon: Hackathon = {
          id: '1',
          slug: slug,
          name: 'Hackathon',
          tagline: 'Unleash Innovation. Empower Africa. Build the Future.',
          description: 'Virtual hackathon for Web3 builders',
          locationType: 'ONLINE' as 'IN_PERSON' | 'HYBRID' | 'ONLINE',
          chains: ['arbitrum', 'base', 'optimism'],
          totalPrizePool: 12500,
          currency: 'USDC',
          participantCount: 0,
          projectCount: 0,
          status: 'ONGOING',
          tags: ['Web3', 'DeFi', 'NFT', 'AI'],
          organizerName: 'Hackathon Team',
          organizerWallet: '',
          eventStart: new Date().toISOString(),
          eventEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setHackathon(fallbackHackathon);
        setLoading(false);
      }
    };

    if (slug) {
      fetchHackathon();
    }
  }, [slug, address]);

  // Update organizer status when address changes
  useEffect(() => {
    if (hackathon && address) {
      setIsOrganizer(
        hackathon.organizerWallet?.toLowerCase() === address.toLowerCase()
      );
    } else {
      setIsOrganizer(false);
    }
  }, [hackathon, address]);

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading hackathon...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!hackathon) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Hackathon not found</div>
        </div>
        <Footer />
      </main>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Code },
    { id: 'networking', label: 'Networking', icon: Video },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
    { id: 'team-matching', label: 'Team Matching', icon: Users },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-14 md:pb-16 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <OptimizedImage
              src={hackathon.bannerImage}
              alt={hackathon.name}
              fill
              objectFit="cover"
              containerClassName="w-full h-full"
              fallbackText={hackathon.name.charAt(0)}
              type="hackathon"
              contextData={{ name: hackathon.name, tagline: hackathon.tagline }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1.5 sm:mb-2">{hackathon.name}</h1>
              {hackathon.tagline && (
                <p className="text-base sm:text-lg md:text-xl text-white/80">{hackathon.tagline}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="glassmorphic p-3 sm:p-4 rounded-lg text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-white">{hackathon.participantCount.toLocaleString()}</div>
              <div className="text-white/60 text-xs sm:text-sm">Participants</div>
            </div>
            <div className="glassmorphic p-3 sm:p-4 rounded-lg text-center">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-white">{hackathon.projectCount}</div>
              <div className="text-white/60 text-xs sm:text-sm">Projects</div>
            </div>
            <div className="glassmorphic p-3 sm:p-4 rounded-lg text-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-white">${hackathon.totalPrizePool.toLocaleString()}</div>
              <div className="text-white/60 text-xs sm:text-sm">Prize Pool</div>
            </div>
            <div className="glassmorphic p-3 sm:p-4 rounded-lg text-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-white">{hackathon.locationType}</div>
              <div className="text-white/60 text-xs sm:text-sm">Location</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-white/10 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm ${
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
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-white/80">{hackathon.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glassmorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-white/80">
                        {new Date(hackathon.eventStart).toLocaleDateString()} -{' '}
                        {new Date(hackathon.eventEnd).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <span className="text-white/80">{hackathon.locationType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">{hackathon.chains.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'networking' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Virtual Networking</h2>
                <p className="text-white/80 mb-6">
                  Únete a salas de networking por track, chatea en tiempo real y colabora con otros participantes.
                </p>
                <div style={{ height: '600px', minHeight: '600px' }}>
                  <VirtualNetworking hackathonId={hackathon.id} userId={address} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mentor' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">AI Mentor</h2>
                <p className="text-white/80 mb-6">
                  Asistente AI 24/7 que responde en Swahili, Inglés y Francés. Obtén ayuda con desarrollo Web3,
                  ejemplos de código y guías contextuales.
                </p>
                <div style={{ height: '700px', minHeight: '700px' }}>
                  <AIMentor
                    hackathonId={hackathon.id}
                    userId={address}
                    context={{
                      hackathonName: hackathon.name,
                      chains: hackathon.chains,
                      techStack: hackathon.tags,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team-matching' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Team Matching Inteligente</h2>
                <p className="text-white/80 mb-6">
                  AI que conecta participantes basado en skills complementarios, timezone y preferencias.
                  Análisis de GitHub incluido.
                </p>
                <TeamMatching hackathonId={hackathon.id} userId={address} />
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Projects</h2>
                <p className="text-white/80">Projects section coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Real-Time Feedback</h2>
                <p className="text-white/80 mb-6">
                  Mentors and judges can provide immediate feedback during project development.
                  Comments are public and update in real-time.
                </p>
                
                {/* Project Selector */}
                {loadingProjects ? (
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <p className="text-white/60 text-sm">Loading projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Select a project to view its feedback:
                    </label>
                    <select
                      value={selectedProjectId || ''}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.status})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>No hay proyectos disponibles aún.</strong> Los proyectos aparecerán aquí una vez que los participantes los envíen.
                    </p>
                  </div>
                )}

                {hackathon && selectedProjectId ? (
                  <div style={{ height: '600px', minHeight: '600px' }}>
                    <RealTimeFeedback
                      hackathonId={hackathon.id}
                      projectId={selectedProjectId}
                      userId={address}
                      userRole="PARTICIPANT"
                    />
                  </div>
                ) : hackathon && !selectedProjectId && projects.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <p className="text-white/60">
                      Selecciona un proyecto o espera a que se envíen proyectos para ver feedback.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
                <Gamification hackathonId={hackathon.id} userId={address} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Organizer Dashboard (if organizer) */}
      {isOrganizer && hackathon && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <OrganizerDashboard hackathonId={hackathon.id} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

// Error Boundary to catch rendering errors
class HackathonErrorBoundary extends Component<
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
    console.error('Error in HackathonDetailPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Main component that handles provider availability
export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
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
        <div className="text-white/60">Error loading hackathon. Please refresh the page.</div>
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
    <HackathonErrorBoundary fallback={fallback}>
      <HackathonContentInner slug={slug} />
    </HackathonErrorBoundary>
  );
}

