'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar, User, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Grant } from '@/app/grants/page';
import { truncateAddress } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface GrantCardProps {
  grant: Grant;
  index: number;
}

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

const STATUS_ICONS: Record<string, any> = {
  DRAFT: Clock,
  SUBMITTED: Clock,
  UNDER_REVIEW: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
};

export function GrantCard({ grant, index }: GrantCardProps) {
  const statusColor = STATUS_COLORS[grant.status] || STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[grant.status] || grant.status;
  const StatusIcon = STATUS_ICONS[grant.status] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/grants/${grant.id}`}>
        <div className="glassmorphic p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Project Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <OptimizedImage
                src={grant.project.coverImage}
                alt={grant.project.name}
                fill
                objectFit="cover"
                containerClassName="w-20 h-20 rounded-lg"
                fallbackText={grant.project.name.charAt(0)}
                className="rounded-lg"
                type="grant"
                contextData={{
                  project: {
                    name: grant.project.name,
                    techStack: grant.project.techStack,
                  },
                  grantProgram: grant.grantProgram,
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{grant.project.name}</h3>
              {grant.project.tagline && (
                <p className="text-sm text-white/60 line-clamp-1">{grant.project.tagline}</p>
              )}
              <div className="text-xs text-white/40 mt-1">{grant.project.hackathon.name}</div>
            </div>
          </div>

          {/* Grant Program Badge */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
              <Award className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold text-purple-200">{grant.grantProgram}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusColor}`}>
              <StatusIcon className="w-3 h-3" />
              {statusLabel}
            </span>
            {grant.decidedAt && (
              <span className="text-xs text-white/50">
                Decided {new Date(grant.decidedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Proposal Preview */}
          <p className="text-sm text-white/70 mb-4 line-clamp-3 flex-1">{grant.proposal}</p>

          {/* Amounts */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between p-3 glassmorphic rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/60">Requested</span>
              </div>
              <span className="text-lg font-bold text-white">
                ${grant.amountRequested.toLocaleString()}
              </span>
            </div>
            {grant.amountApproved && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Approved</span>
                </div>
                <span className="text-lg font-bold text-green-300">
                  ${grant.amountApproved.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Milestones Preview */}
          {grant.milestones && grant.milestones.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-2">Milestones ({grant.milestones.length})</div>
              <div className="space-y-1">
                {grant.milestones.slice(0, 2).map((milestone, idx) => (
                  <div key={idx} className="text-xs text-white/60 line-clamp-1">
                    • {milestone.title}
                  </div>
                ))}
                {grant.milestones.length > 2 && (
                  <div className="text-xs text-white/40">+{grant.milestones.length - 2} more</div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/60">
                {grant.user.username || truncateAddress(grant.user.walletAddress)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {new Date(grant.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

