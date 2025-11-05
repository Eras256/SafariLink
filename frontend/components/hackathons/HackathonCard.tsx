'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Building2,
  Zap,
} from 'lucide-react';
import { Hackathon } from '@/app/hackathons/page';
import { truncateAddress } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface HackathonCardProps {
  hackathon: Hackathon;
  index: number;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  PUBLISHED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  REGISTRATION_OPEN: 'bg-green-500/20 text-green-300 border-green-500/30',
  REGISTRATION_CLOSED: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  ONGOING: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  JUDGING: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  COMPLETED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  REGISTRATION_OPEN: 'Registration Open',
  REGISTRATION_CLOSED: 'Registration Closed',
  ONGOING: 'Ongoing',
  JUDGING: 'Judging',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const LOCATION_ICONS: Record<string, any> = {
  IN_PERSON: Building2,
  HYBRID: Zap,
  ONLINE: Globe,
};

const LOCATION_LABELS: Record<string, string> = {
  IN_PERSON: 'In Person',
  HYBRID: 'Hybrid',
  ONLINE: 'Online',
};

export function HackathonCard({ hackathon, index }: HackathonCardProps) {
  const statusColor = STATUS_COLORS[hackathon.status] || STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[hackathon.status] || hackathon.status;
  const LocationIcon = LOCATION_ICONS[hackathon.locationType] || Globe;
  const locationLabel = LOCATION_LABELS[hackathon.locationType] || hackathon.locationType;

  const getStatusText = () => {
    const now = new Date();
    const regStart = new Date(hackathon.registrationStart);
    const regEnd = new Date(hackathon.registrationEnd);
    const eventStart = new Date(hackathon.eventStart);
    const eventEnd = new Date(hackathon.eventEnd);

    if (now < regStart) return 'Registration starts soon';
    if (now >= regStart && now <= regEnd && hackathon.status === 'REGISTRATION_OPEN')
      return 'Registration Open';
    if (now > regEnd && now < eventStart) return 'Event starting soon';
    if (now >= eventStart && now <= eventEnd) return 'Hackathon in progress';
    if (now > eventEnd) return 'Event ended';
    return statusLabel;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrize = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/hackathons/${hackathon.slug}`}>
        <div className="glassmorphic p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {/* Banner Image */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group/image">
            <OptimizedImage
              src={hackathon.bannerImage}
              alt={hackathon.name}
              fill
              objectFit="cover"
              containerClassName="w-full h-48 rounded-lg"
              fallbackText={hackathon.name.charAt(0)}
              className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              type="hackathon"
              contextData={{
                name: hackathon.name,
                tagline: hackathon.tagline,
                tags: hackathon.tags,
                chains: hackathon.chains,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 pointer-events-none">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {hackathon.name}
            </h3>
            {hackathon.tagline && (
              <p className="text-sm text-white/70 line-clamp-1">{hackathon.tagline}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 mb-4 line-clamp-3 flex-1">{hackathon.description}</p>

          {/* Prize Pool */}
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-300">Total Prize Pool</span>
              </div>
              <span className="text-2xl font-bold text-yellow-300">
                {formatPrize(hackathon.totalPrizePool)}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <LocationIcon className="w-4 h-4 text-white/50" />
              <span>{locationLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Calendar className="w-4 h-4 text-white/50" />
              <span>{formatDate(hackathon.eventStart)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Users className="w-4 h-4 text-white/50" />
              <span>
                {hackathon.participantCount}
                {hackathon.maxParticipants ? ` / ${hackathon.maxParticipants}` : ''} participants
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Trophy className="w-4 h-4 text-white/50" />
              <span>{hackathon.projectCount} projects</span>
            </div>
          </div>

          {/* Chains */}
          {hackathon.chains && hackathon.chains.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {hackathon.chains.map((chain, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10 capitalize"
                  >
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {hackathon.tags && hackathon.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {hackathon.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-500/10 rounded-md text-xs text-purple-300 border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
                {hackathon.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10">
                    +{hackathon.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">{hackathon.organizerName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

