'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Project } from '@/app/projects/page';
import { findMockProjectBySlug } from '@/lib/mockProjects';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { 
  Trophy, 
  Star, 
  Calendar, 
  User, 
  ExternalLink, 
  Github, 
  Video, 
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-300',
  SUBMITTED: 'bg-blue-500/20 text-blue-300',
  UNDER_REVIEW: 'bg-yellow-500/20 text-yellow-300',
  APPROVED: 'bg-green-500/20 text-green-300',
  WINNER: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300',
  REJECTED: 'bg-red-500/20 text-red-300',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  WINNER: 'Winner',
  REJECTED: 'Rejected',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  DRAFT: <Clock className="w-4 h-4" />,
  SUBMITTED: <Clock className="w-4 h-4" />,
  UNDER_REVIEW: <Clock className="w-4 h-4" />,
  APPROVED: <CheckCircle className="w-4 h-4" />,
  WINNER: <Trophy className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Try to fetch from API first
        const { getApiEndpoint } = await import('@/lib/api/config');
        const { API_ENDPOINTS } = await import('@/lib/constants');
        const response = await fetch(getApiEndpoint(API_ENDPOINTS.PROJECTS.DETAIL(slug)));

        if (response.ok) {
          const data = await response.json();
          setProject(data.project || data);
        } else {
          // Fallback to mock data
          const mockProject = findMockProjectBySlug(slug);
          if (mockProject) {
            setProject(mockProject);
          } else {
            // If no mock project found, redirect to projects page
            router.push('/projects');
          }
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockProject = findMockProjectBySlug(slug);
        if (mockProject) {
          setProject(mockProject);
        } else {
          router.push('/projects');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading project...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 mb-4">Project not found</div>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const statusColor = STATUS_COLORS[project.status] || STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[project.status] || project.status;
  const statusIcon = STATUS_ICONS[project.status] || <Clock className="w-4 h-4" />;

  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <Link href="/projects">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Header */}
      <section className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Cover Image */}
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden">
            <OptimizedImage
              src={project.coverImage}
              alt={project.name}
              fill
              objectFit="cover"
              containerClassName="w-full h-full rounded-xl sm:rounded-2xl"
              fallbackText={project.name.charAt(0)}
              className="rounded-xl sm:rounded-2xl"
              type="project"
              contextData={{
                name: project.name,
                tagline: project.tagline,
                techStack: project.techStack,
                description: project.description,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Status and Rank Overlay */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-start justify-between">
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 ${statusColor} backdrop-blur-sm`}>
                {statusIcon}
                {statusLabel}
              </div>
              {project.rank && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-400 bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-bold">#{project.rank}</span>
                </div>
              )}
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                {project.name}
              </h1>
              {project.tagline && (
                <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl">
                  {project.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">About</h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-lg text-xs sm:text-sm text-white/90 border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.demoUrl || project.githubUrl || project.videoUrl) && (
                <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Links</h2>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-white border border-blue-500/50 transition"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white border border-white/20 transition"
                      >
                        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">GitHub</span>
                      </a>
                    )}
                    {project.videoUrl && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white border border-red-500/50 transition"
                      >
                        <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Video</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Stats Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Project Stats</h3>
                <div className="space-y-3 sm:space-y-4">
                  {project.finalScore && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/70">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                        <span className="text-sm sm:text-base">Final Score</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-white">
                        {project.finalScore.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {project.submittedAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Submitted</span>
                      </div>
                      <span className="text-sm sm:text-base text-white">
                        {new Date(project.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.prizeWon && (
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                      <span className="text-sm sm:text-base text-white/70">Prize Won</span>
                      <span className="text-lg sm:text-xl font-bold text-yellow-400">
                        ${project.prizeWon.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Creator</h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {project.creator.username?.charAt(0).toUpperCase() || project.creator.walletAddress.charAt(2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-white truncate">
                      {project.creator.username || truncateAddress(project.creator.walletAddress)}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 truncate">
                      {truncateAddress(project.creator.walletAddress)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hackathon Card */}
              <div className="glassmorphic p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Hackathon</h3>
                <Link href={`/hackathons/${project.hackathon.id}`}>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {project.hackathon.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-white truncate">
                        {project.hackathon.name}
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

