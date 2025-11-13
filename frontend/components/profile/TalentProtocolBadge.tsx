'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Users, Coins, TrendingUp, ExternalLink, Github, Twitter, Linkedin, Globe, MapPin, Award, Calendar, Tag } from 'lucide-react';
import { TalentProtocolProfile } from '@/lib/talent-protocol/talentProtocol';
import { useState } from 'react';

interface TalentProtocolBadgeProps {
  profile: TalentProtocolProfile | null;
  compact?: boolean;
}

export function TalentProtocolBadge({ profile, compact = false }: TalentProtocolBadgeProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  if (!profile) {
    return null;
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-full"
      >
        {profile.verified && (
          <CheckCircle2 className="w-3 h-3 text-purple-300" />
        )}
        <span className="text-xs font-medium text-purple-300">Talent Protocol</span>
      </motion.div>
    );
  }

  const milestonesToShow = showAllMilestones 
    ? (profile.milestones || []) 
    : (profile.milestones || []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphic p-4 sm:p-5 rounded-lg border border-purple-500/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TP</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">
              Talent Protocol
            </h3>
            {profile.verified && (
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Verified</span>
              </div>
            )}
          </div>
        </div>
        {profile.username && (
          <span className="text-xs text-white/60">@{profile.username}</span>
        )}
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="mb-3">
          <p className={`text-white/70 text-xs sm:text-sm ${showFullBio ? '' : 'line-clamp-3'}`}>
            {profile.bio}
          </p>
          {profile.bio.length > 150 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-xs text-purple-300 hover:text-purple-200 mt-1 transition-colors"
            >
              {showFullBio ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      )}

      {/* Location and Website */}
      {(profile.location || profile.website) && (
        <div className="flex items-center gap-3 mb-3 text-xs text-white/60">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <a
              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-purple-300 transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span className="truncate max-w-[150px]">Website</span>
            </a>
          )}
        </div>
      )}

      {/* Builder Score Level Badge */}
      {profile.builderScoreLevel && (
        <div className="mb-3 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs text-white/60">Builder Score</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white font-bold text-lg">
                  {profile.builderScore?.toFixed(0) || 0}
                </span>
                <span className="text-purple-300 font-semibold text-sm">
                  Level {profile.builderScoreLevel.level}: {profile.builderScoreLevel.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Links - Always show section if any social exists */}
      {(profile.twitter || profile.github || profile.linkedin) && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 font-medium">Redes Sociales Conectadas en Talent Protocol</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {profile.twitter && (
              <a
                href={profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter.replace('@', '').replace('https://twitter.com/', '').replace('https://x.com/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
                title={`Ver perfil de Twitter`}
              >
                <Twitter className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white/80 font-medium">Twitter</span>
                <ExternalLink className="w-3 h-3 text-white/40 ml-auto" />
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github.replace('github.com/', '').replace('https://github.com/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
                title={`Ver perfil de GitHub`}
              >
                <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white/80 font-medium">GitHub</span>
                <ExternalLink className="w-3 h-3 text-white/40 ml-auto" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin.replace('linkedin.com/in/', '').replace('https://linkedin.com/in/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
                title={`Ver perfil de LinkedIn`}
              >
                <Linkedin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white/80 font-medium">LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-white/40 ml-auto" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Creator Stats */}
      {profile.creatorStats && (
        <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 font-medium">Creator Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {profile.creatorStats.earnings !== undefined && (
              <div>
                <span className="text-xs text-white/60">Earnings</span>
                <div className="text-white font-semibold text-sm">
                  ${profile.creatorStats.earnings.toLocaleString()}
                </div>
              </div>
            )}
            {profile.creatorStats.collectors !== undefined && (
              <div>
                <span className="text-xs text-white/60">Collectors</span>
                <div className="text-white font-semibold text-sm">
                  {profile.creatorStats.collectors}
                </div>
              </div>
            )}
            {profile.creatorStats.zoraCreatorCoin && (
              <div className="col-span-2">
                <span className="text-xs text-white/60">Zora Creator Coin</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white font-semibold text-sm">
                    {profile.creatorStats.zoraCreatorCoin.symbol}
                  </span>
                  {profile.creatorStats.zoraCreatorCoin.price && (
                    <span className="text-white/60 text-xs">
                      ${profile.creatorStats.zoraCreatorCoin.price.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Token Information */}
      {(profile.tokenSymbol || profile.tokenName || profile.tokenPrice) && (
        <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60">Token Information</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {profile.tokenName && (
              <div>
                <span className="text-white/60">Nombre: </span>
                <span className="text-white">{profile.tokenName}</span>
              </div>
            )}
            {profile.tokenSymbol && (
              <div>
                <span className="text-white/60">Símbolo: </span>
                <span className="text-white font-semibold">{profile.tokenSymbol}</span>
              </div>
            )}
            {profile.tokenPrice && (
              <div>
                <span className="text-white/60">Precio: </span>
                <span className="text-white">${parseFloat(profile.tokenPrice).toFixed(4)}</span>
              </div>
            )}
            {profile.totalSupply && (
              <div>
                <span className="text-white/60">Supply: </span>
                <span className="text-white">{parseFloat(profile.totalSupply).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60">Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-purple-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {profile.milestones && profile.milestones.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Logros y Milestones</span>
            </div>
            {profile.milestones.length > 3 && (
              <button
                onClick={() => setShowAllMilestones(!showAllMilestones)}
                className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
              >
                {showAllMilestones ? 'Ver menos' : `Ver todos (${profile.milestones.length})`}
              </button>
            )}
          </div>
          <div className="space-y-2">
            {milestonesToShow.map((milestone) => (
              <div
                key={milestone.id}
                className="p-2 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-xs">{milestone.title}</span>
                      {milestone.verified && (
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-white/60 text-xs mb-1">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(milestone.date).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                      <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-300">
                        {milestone.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/10">
        {profile.supporterCount !== undefined && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3 h-3 text-purple-400" />
              <span className="text-white font-semibold text-sm">
                {profile.supporterCount}
              </span>
            </div>
            <span className="text-xs text-white/60">Supporters</span>
          </div>
        )}

        {profile.tokenBalance && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="w-3 h-3 text-purple-400" />
              <span className="text-white font-semibold text-sm">
                {parseFloat(profile.tokenBalance).toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-white/60">$TAL</span>
          </div>
        )}

        {profile.totalRaised && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span className="text-white font-semibold text-sm">
                ${parseFloat(profile.totalRaised).toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-white/60">Raised</span>
          </div>
        )}
      </div>

      {/* Optional Link to Talent Protocol Profile (less prominent) */}
      {profile.id && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <a
            href={`https://talentprotocol.com/${profile.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-purple-300 transition-colors"
          >
            <span>Ver en Talent Protocol</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

