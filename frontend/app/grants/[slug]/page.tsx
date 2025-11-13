'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Grant } from '@/app/grants/page';
import { findMockGrantByProjectSlug } from '@/lib/mockGrants';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { 
  Award, 
  Calendar, 
  User, 
  ExternalLink, 
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Target,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-300',
  SUBMITTED: 'bg-blue-500/20 text-blue-300',
  UNDER_REVIEW: 'bg-yellow-500/20 text-yellow-300',
  APPROVED: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300',
  REJECTED: 'bg-red-500/20 text-red-300',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  DRAFT: <Clock className="w-4 h-4" />,
  SUBMITTED: <Clock className="w-4 h-4" />,
  UNDER_REVIEW: <Clock className="w-4 h-4" />,
  APPROVED: <CheckCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

export default function GrantPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrant = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Try to fetch from API first
        const { getApiEndpoint } = await import('@/lib/api/config');
        const { API_ENDPOINTS } = await import('@/lib/constants');
        const response = await fetch(getApiEndpoint(API_ENDPOINTS.GRANTS.PROJECT(slug)));

        if (response.ok) {
          const data = await response.json();
          setGrant(data.grant || data);
        } else {
          // Fallback to mock data
          const mockGrant = findMockGrantByProjectSlug(slug);
          if (mockGrant) {
            setGrant(mockGrant);
          } else {
            // If no mock grant found, redirect to grants page
            router.push('/grants');
          }
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockGrant = findMockGrantByProjectSlug(slug);
        if (mockGrant) {
          setGrant(mockGrant);
        } else {
          router.push('/grants');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrant();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading grant...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!grant) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 mb-4">Grant not found</div>
            <Link href="/grants">
              <Button>Back to Grants</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const statusColor = STATUS_COLORS[grant.status] || STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[grant.status] || grant.status;
  const statusIcon = STATUS_ICONS[grant.status] || <Clock className="w-4 h-4" />;

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <Link href="/grants">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grants
            </Button>
          </Link>
        </div>
      </div>

      {/* Grant Header */}
      <section className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Project Image */}
              <div className="relative w-full sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0">
                <OptimizedImage
                  src={grant.project.coverImage}
                  alt={grant.project.name}
                  fill
                  objectFit="cover"
                  containerClassName="w-full h-48 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg"
                  fallbackText={grant.project.name.charAt(0)}
                  className="rounded-lg"
                  type="grant"
                  contextData={{
                    project: {
                      name: grant.project.name,
                    },
                    grantProgram: grant.grantProgram,
                  }}
                />
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                  {grant.project.name}
                </h1>
                {grant.project.tagline && (
                  <p className="text-base sm:text-lg text-white/80 mb-3 sm:mb-4">
                    {grant.project.tagline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* Grant Program Badge */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                    <span className="text-sm sm:text-base font-semibold text-purple-200">
                      {grant.grantProgram}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusColor}`}>
                    {statusIcon}
                    {statusLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Proposal */}
              <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  Proposal
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line">
                  {grant.proposal}
                </p>
              </div>

              {/* Milestones */}
              {grant.milestones && grant.milestones.length > 0 && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                    Milestones ({grant.milestones.length})
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {grant.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-xs sm:text-sm">
                              {idx + 1}
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">
                              {milestone.title}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-sm sm:text-base font-bold text-white">
                              ${milestone.amount.toLocaleString()}
                            </div>
                            <div className="text-xs sm:text-sm text-white/60">
                              {new Date(milestone.deadline).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-white/70 ml-8 sm:ml-9">
                          {milestone.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              {grant.budget && grant.budget.length > 0 && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                    Budget Breakdown
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {grant.budget.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex-1">
                          <div className="text-sm sm:text-base font-semibold text-white mb-1">
                            {item.category}
                          </div>
                          <div className="text-xs sm:text-sm text-white/60">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white ml-4">
                          ${item.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Amounts Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Grant Amounts</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 text-white/70">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Requested</span>
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white">
                      ${grant.amountRequested.toLocaleString()}
                    </span>
                  </div>
                  {grant.amountApproved && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-300">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Approved</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-green-300">
                        ${grant.amountApproved.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Timeline</h3>
                <div className="space-y-3 sm:space-y-4">
                  {grant.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-white/70">Created</span>
                      <span className="text-sm sm:text-base text-white">
                        {new Date(grant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {grant.submittedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-white/70">Submitted</span>
                      <span className="text-sm sm:text-base text-white">
                        {new Date(grant.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {grant.decidedAt && (
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-sm sm:text-base text-white/70">Decided</span>
                      <span className="text-sm sm:text-base text-white">
                        {new Date(grant.decidedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Applicant</h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {grant.user.username?.charAt(0).toUpperCase() || grant.user.walletAddress.charAt(2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-white truncate">
                      {grant.user.username || truncateAddress(grant.user.walletAddress)}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 truncate">
                      {truncateAddress(grant.user.walletAddress)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Project</h3>
                <Link href={`/projects/${grant.project.slug}`}>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {grant.project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-white truncate">
                        {grant.project.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">View Project</div>
                    </div>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  </div>
                </Link>
              </div>

              {/* Hackathon Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Hackathon</h3>
                <Link href={`/hackathons/${grant.project.hackathon.id}`}>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {grant.project.hackathon.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-white truncate">
                        {grant.project.hackathon.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">View Hackathon</div>
                    </div>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

