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
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Trophy, Code, MessageSquare, Video, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Hackathon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  bannerImage?: string;
  logoImage?: string;
  organizerName: string;
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
function HackathonContentInner({ slug }: { slug: string }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'networking' | 'mentor' | 'projects' | 'leaderboard'>('overview');
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

  useEffect(() => {
    const fetchHackathon = async () => {
      // Try to fetch from API, but fallback to mock data if backend is unavailable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
            `${apiUrl}/api/hackathons/${slug}`,
            fetchOptions
          );

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (response && response.ok) {
            try {
              const data = await response.json();
              setHackathon(data.hackathon || data);
              setLoading(false);
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
      setHackathon({
        id: '1',
        slug: slug,
        name: 'ETH Safari 2025',
        tagline: 'Unleash Innovation. Empower Africa. Build the Future.',
        description: 'Virtual hackathon for Web3 builders in Africa',
        locationType: 'ONLINE',
        chains: ['arbitrum', 'base', 'optimism'],
        totalPrizePool: 12500,
        currency: 'USDC',
        participantCount: 1247,
        projectCount: 156,
        status: 'ONGOING',
        tags: ['Web3', 'DeFi', 'NFT', 'AI'],
        organizerName: 'ETH Safari Team',
        eventStart: new Date().toISOString(),
        eventEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setLoading(false);
    };

    if (slug) {
      fetchHackathon();
    }
  }, [slug]);

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
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
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
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{hackathon.name}</h1>
              {hackathon.tagline && (
                <p className="text-xl text-white/80">{hackathon.tagline}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glassmorphic p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{hackathon.participantCount.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Participants</div>
            </div>
            <div className="glassmorphic p-4 rounded-lg text-center">
              <Code className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{hackathon.projectCount}</div>
              <div className="text-white/60 text-sm">Projects</div>
            </div>
            <div className="glassmorphic p-4 rounded-lg text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${hackathon.totalPrizePool.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Prize Pool</div>
            </div>
            <div className="glassmorphic p-4 rounded-lg text-center">
              <MapPin className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{hackathon.locationType}</div>
              <div className="text-white/60 text-sm">Location</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10">
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

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="glassmorphic p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Projects</h2>
                <p className="text-white/80">Projects section coming soon...</p>
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
      {isOrganizer && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="glassmorphic p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Organizer Dashboard</h2>
              <OrganizerDashboard hackathonId={hackathon.id} />
            </div>
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

