'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  UserPlus,
  X,
  Check,
  Github,
  Clock,
  MapPin,
  Code,
  Star,
  AlertCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { io, Socket } from 'socket.io-client';

interface TeamMatchingProfile {
  id: string;
  userId: string;
  hackathonId: string;
  skills: string[];
  skillLevels?: { [key: string]: string };
  lookingFor: string[];
  preferredRole?: string;
  teamSize?: { min: number; max: number; preferred: number };
  availability?: string;
  availableHours?: { start: string; end: string; timezone: string };
  bio?: string;
  experience?: string;
  interests?: string[];
  githubUsername?: string;
  githubUrl?: string;
  githubData?: any;
  isActive: boolean;
  isLookingForTeam: boolean;
  user?: {
    id: string;
    username?: string;
    avatar?: string;
    timezone?: string;
    bio?: string;
    location?: string;
  };
}

interface TeamMatch {
  id: string;
  senderId: string;
  receiverId: string;
  hackathonId: string;
  matchScore: number;
  skillScore: number;
  timezoneScore: number;
  githubScore?: number;
  aiReasoning?: string;
  strengths: string[];
  considerations: string[];
  status: 'PENDING' | 'MUTUAL_INTEREST' | 'NOT_INTERESTED' | 'EXPIRED';
  senderAction?: 'INTERESTED' | 'NOT_INTERESTED';
  receiverAction?: 'INTERESTED' | 'NOT_INTERESTED';
  createdAt: string;
  sender?: {
    id: string;
    username?: string;
    avatar?: string;
    timezone?: string;
  };
  receiver?: {
    id: string;
    username?: string;
    avatar?: string;
    timezone?: string;
  };
  candidate?: TeamMatchingProfile;
  scores?: {
    total: number;
    skill: number;
    timezone: number;
    github: number;
  };
  aiAnalysis?: {
    reasoning: string;
    strengths: string[];
    considerations: string[];
    compatibilityScore: number;
  };
}

interface TeamMatchingProps {
  hackathonId: string;
  userId?: string;
}

export function TeamMatching({ hackathonId, userId }: TeamMatchingProps) {
  const { address } = useAccount();
  const [profile, setProfile] = useState<TeamMatchingProfile | null>(null);
  const [matches, setMatches] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'matches' | 'my-matches'>('profile');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    skills: [] as string[],
    skillLevels: {} as { [key: string]: string },
    lookingFor: [] as string[],
    preferredRole: 'flexible' as 'leader' | 'member' | 'flexible',
    teamSize: { min: 2, max: 5, preferred: 4 },
    availability: 'full-time' as 'full-time' | 'part-time' | 'weekend',
    availableHours: { start: '09:00', end: '18:00', timezone: 'UTC+0' },
    bio: '',
    experience: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    interests: [] as string[],
    githubUrl: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Initialize WebSocket connection
  useEffect(() => {
    if (!address) return;

    const newSocket = io(apiUrl.replace('http', 'ws'), {
      auth: {
        token: address, // In production, use JWT token
        userId: address,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected for team matching');
    });

    newSocket.on('team-match:mutual-interest', (data) => {
      setNotifications((prev) => [...prev, data]);
      // Refresh matches
      fetchUserMatches();
    });

    newSocket.on('team-match:new', (data) => {
      setNotifications((prev) => [...prev, data]);
      // Refresh matches
      fetchUserMatches();
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [address]);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-matching/hackathons/${hackathonId}/profile`, {
        headers: {
          Authorization: `Bearer ${address}`, // In production, use JWT token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        if (data.profile) {
          setFormData({
            skills: data.profile.skills || [],
            skillLevels: data.profile.skillLevels || {},
            lookingFor: data.profile.lookingFor || [],
            preferredRole: data.profile.preferredRole || 'flexible',
            teamSize: data.profile.teamSize || { min: 2, max: 5, preferred: 4 },
            availability: data.profile.availability || 'full-time',
            availableHours: data.profile.availableHours || { start: '09:00', end: '18:00', timezone: 'UTC+0' },
            bio: data.profile.bio || '',
            experience: data.profile.experience || 'intermediate',
            interests: data.profile.interests || [],
            githubUrl: data.profile.githubUrl || '',
          });
        }
      } else if (response.status === 404) {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user matches
  const fetchUserMatches = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-matching/hackathons/${hackathonId}/my-matches`, {
        headers: {
          Authorization: `Bearer ${address}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  // Find matches
  const findMatches = async () => {
    setSearching(true);
    try {
      const response = await fetch(`${apiUrl}/api/team-matching/hackathons/${hackathonId}/matches?limit=10`, {
        headers: {
          Authorization: `Bearer ${address}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
        setActiveTab('matches');
      }
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setSearching(false);
    }
  };

  // Save profile
  const saveProfile = async () => {
    try {
      const method = profile ? 'PUT' : 'POST';
      const response = await fetch(`${apiUrl}/api/team-matching/hackathons/${hackathonId}/profile`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${address}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setShowProfileForm(false);
        // Auto-find matches after creating profile
        if (!profile) {
          setTimeout(() => findMatches(), 1000);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Respond to match
  const respondToMatch = async (matchId: string, action: 'INTERESTED' | 'NOT_INTERESTED') => {
    try {
      const response = await fetch(`${apiUrl}/api/team-matching/matches/${matchId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${address}`,
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update match in state
        setMatches((prev) =>
          prev.map((match) => (match.id === matchId ? data.match : match))
        );
        // Refresh matches
        fetchUserMatches();
      }
    } catch (error) {
      console.error('Error responding to match:', error);
    }
  };

  useEffect(() => {
    if (hackathonId && address) {
      fetchProfile();
      fetchUserMatches();
    }
  }, [hackathonId, address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              <p className="text-green-300">{notification.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Matching Inteligente</h2>
          <p className="text-white/60">
            Encuentra compañeros de equipo basado en skills complementarios, timezone y preferencias
          </p>
        </div>
        {profile && (
          <Button
            onClick={findMatches}
            disabled={searching}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Buscar Matches
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'matches'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Matches Encontrados
        </button>
        <button
          onClick={() => setActiveTab('my-matches')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'my-matches'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Mis Matches
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {!profile ? (
              <div className="glassmorphic p-6 rounded-lg text-center">
                <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Crea tu perfil de Team Matching
                </h3>
                <p className="text-white/60 mb-6">
                  Completa tu perfil para encontrar compañeros de equipo ideales
                </p>
                <Button onClick={() => setShowProfileForm(true)} className="bg-blue-500 hover:bg-blue-600">
                  Crear Perfil
                </Button>
              </div>
            ) : (
              <div className="glassmorphic p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Mi Perfil</h3>
                  <Button
                    onClick={() => setShowProfileForm(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Editar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-2">Busco</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.lookingFor?.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-2">Rol Preferido</h4>
                    <p className="text-white">{profile.preferredRole || 'Flexible'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-2">Disponibilidad</h4>
                    <p className="text-white">{profile.availability || 'No especificada'}</p>
                  </div>

                  {profile.bio && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-white/60 mb-2">Bio</h4>
                      <p className="text-white/80">{profile.bio}</p>
                    </div>
                  )}

                  {profile.githubUsername && (
                    <div>
                      <h4 className="text-sm font-medium text-white/60 mb-2">GitHub</h4>
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                      >
                        <Github className="w-4 h-4" />
                        {profile.githubUsername}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Form */}
            {showProfileForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphic p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {profile ? 'Editar Perfil' : 'Crear Perfil'}
                  </h3>
                  <button
                    onClick={() => setShowProfileForm(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Skills (separados por comas)
                    </label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Ej: Solidity, React, Node.js, DeFi"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Busco (separados por comas)
                    </label>
                    <input
                      type="text"
                      value={formData.lookingFor.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lookingFor: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Ej: frontend, backend, smart-contracts, design"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Rol Preferido
                      </label>
                      <select
                        value={formData.preferredRole}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredRole: e.target.value as 'leader' | 'member' | 'flexible',
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="flexible">Flexible</option>
                        <option value="leader">Líder</option>
                        <option value="member">Miembro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Disponibilidad
                      </label>
                      <select
                        value={formData.availability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: e.target.value as 'full-time' | 'part-time' | 'weekend',
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="full-time">Tiempo Completo</option>
                        <option value="part-time">Tiempo Parcial</option>
                        <option value="weekend">Fin de Semana</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      GitHub URL (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      placeholder="Cuéntanos sobre ti..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={saveProfile} className="bg-blue-500 hover:bg-blue-600">
                      Guardar
                    </Button>
                    <Button
                      onClick={() => setShowProfileForm(false)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="glassmorphic p-8 rounded-lg text-center">
                <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No se encontraron matches. Haz clic en "Buscar Matches" para encontrar compañeros.</p>
              </div>
            ) : (
              matches.map((match) => {
                const candidate = match.candidate || (match.senderId === address ? match.receiver : match.sender);
                const isSender = match.senderId === address;
                const userAction = isSender ? match.senderAction : match.receiverAction;

                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glassmorphic p-6 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {candidate?.user?.avatar ? (
                          <img
                            src={candidate.user.avatar}
                            alt={candidate.user.username || 'User'}
                            className="w-16 h-16 rounded-full"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {candidate?.user?.username || 'Usuario'}
                          </h4>
                          <p className="text-white/60 text-sm">
                            Compatibilidad: {(match.matchScore * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {(match.matchScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-1">Skills</div>
                        <div className="text-lg font-semibold text-blue-400">
                          {(match.skillScore * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-1">Timezone</div>
                        <div className="text-lg font-semibold text-green-400">
                          {(match.timezoneScore * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-1">GitHub</div>
                        <div className="text-lg font-semibold text-purple-400">
                          {match.githubScore ? `${(match.githubScore * 100).toFixed(0)}%` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    {match.aiReasoning && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <h5 className="text-sm font-semibold text-blue-300">Análisis AI</h5>
                        </div>
                        <p className="text-white/80 text-sm">{match.aiReasoning}</p>
                      </div>
                    )}

                    {/* Strengths */}
                    {match.strengths && match.strengths.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-white/80 mb-2">Fortalezas</h5>
                        <div className="flex flex-wrap gap-2">
                          {match.strengths.map((strength, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Candidate Info */}
                    {candidate && (
                      <div className="space-y-2 mb-4">
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-white/80 mb-2">Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.slice(0, 5).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {candidate.user?.timezone && (
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <MapPin className="w-4 h-4" />
                            {candidate.user.timezone}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {match.status === 'PENDING' && !userAction && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => respondToMatch(match.id, 'INTERESTED')}
                          className="bg-green-500 hover:bg-green-600 flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Interesado
                        </Button>
                        <Button
                          onClick={() => respondToMatch(match.id, 'NOT_INTERESTED')}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          No Interesado
                        </Button>
                      </div>
                    )}

                    {match.status === 'MUTUAL_INTEREST' && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-300">
                          <Check className="w-5 h-5" />
                          <span className="font-semibold">¡Interés Mutuo!</span>
                        </div>
                        <p className="text-white/80 text-sm mt-2">
                          Ambos están interesados. Pueden formar un equipo.
                        </p>
                      </div>
                    )}

                    {userAction === 'NOT_INTERESTED' && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 text-sm">Has marcado este match como no interesado</p>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'my-matches' && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="glassmorphic p-8 rounded-lg text-center">
                <MessageSquare className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No tienes matches aún. Busca matches para encontrar compañeros.</p>
              </div>
            ) : (
              matches.map((match) => {
                const otherUser = match.senderId === address ? match.receiver : match.sender;
                return (
                  <div key={match.id} className="glassmorphic p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {otherUser?.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.username || 'User'}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium">{otherUser?.username || 'Usuario'}</h4>
                          <p className="text-white/60 text-sm">
                            {match.status === 'MUTUAL_INTEREST' ? 'Interés Mutuo' : 'Pendiente'}
                          </p>
                        </div>
                      </div>
                      <div className="text-yellow-400">
                        <Star className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

