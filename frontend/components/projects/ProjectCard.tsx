'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Trophy, Star, Calendar, User } from 'lucide-react';
import { Project } from '@/app/projects/page';
import { truncateAddress } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProjectCardProps {
  project: Project;
  index: number;
}

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

export function ProjectCard({ project, index }: ProjectCardProps) {
  const statusColor = STATUS_COLORS[project.status] || STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[project.status] || project.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="glassmorphic p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <OptimizedImage
              src={project.coverImage}
              alt={project.name}
              fill
              objectFit="cover"
              containerClassName="w-full h-48 rounded-lg"
              fallbackText={project.name.charAt(0)}
              className="rounded-lg"
              type="project"
              contextData={{
                name: project.name,
                tagline: project.tagline,
                techStack: project.techStack,
                description: project.description,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {statusLabel}
            </span>
            {project.rank && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">#{project.rank}</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.name}</h3>
            {project.tagline && (
              <p className="text-sm text-white/70 mb-3 line-clamp-2">{project.tagline}</p>
            )}
            <p className="text-sm text-white/60 mb-4 line-clamp-3">{project.description}</p>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
              {project.finalScore && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">{project.finalScore.toFixed(1)}</span>
                </div>
              )}
              {project.submittedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.submittedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Prize Info */}
            {project.prizeWon && (
              <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-300">Prize Won</span>
                  <span className="text-lg font-bold text-yellow-300">
                    ${project.prizeWon.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Hackathon */}
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-1">Hackathon</div>
              <div className="text-sm text-white/80 font-medium">{project.hackathon.name}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/60">
                {project.creator.username || truncateAddress(project.creator.walletAddress)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 glassmorphic rounded-lg hover:bg-white/10 transition"
                >
                  <Github className="w-4 h-4 text-white/60" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 glassmorphic rounded-lg hover:bg-white/10 transition"
                >
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

