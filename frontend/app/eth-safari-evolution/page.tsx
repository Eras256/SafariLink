'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { VirtualNetworking } from '@/components/hackathons/VirtualNetworking';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  Sparkles,
  Video,
  Award,
  BarChart3,
  Zap,
  Heart,
  Rocket,
  Star,
  Link as LinkIcon,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export default function EthSafariEvolutionPage() {
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  // Only use wagmi hooks after mount (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe hooks usage - only after mount
  // Hooks must be called unconditionally (React rules)
  // The WagmiProvider should be available via the layout providers
  // If WagmiProvider is not available, this will throw an error
  // which React will catch and display - we need to ensure the provider is available
  const { address: accountAddress } = useAccount();

  // Update address state after mount
  useEffect(() => {
    if (mounted) {
      setAddress(accountAddress);
    }
  }, [mounted, accountAddress]);

  if (!mounted) {
    // Return loading state or placeholder while mounting
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
  
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-40 px-3 sm:px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm mb-4"
          >
            🦁 ETH Safari Evolution Challenge 2025
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
          >
            <span className="gradient-text">Revolutionize ETH Safari</span>
            <br />
            <span className="text-white">With SafariLink</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto px-2"
          >
            The comprehensive platform that transforms virtual hackathons into immersive, 
            collaborative, and successful experiences for the African Web3 ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="#demo">
              <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
            <Link href="#bold">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Why This Is Bold
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
          >
            <span className="gradient-text">Virtual Hackathon Challenges</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                title: 'Social Disconnection',
                description: 'Virtual participants feel isolated, making networking and collaboration difficult.',
                icon: Users,
              },
              {
                title: 'Lack of Real-Time Feedback',
                description: 'Without immediate feedback from mentors and judges, projects fail to reach their full potential.',
                icon: MessageSquare,
              },
              {
                title: 'Limited Metrics',
                description: 'Organizers lack complete visibility into engagement, participation, and event success.',
                icon: BarChart3,
              },
            ].map((problem, index) => {
              const Icon = problem.icon;
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="glassmorphic p-5 sm:p-6 md:p-8 card-lift"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{problem.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base">{problem.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution - SafariLink for ETH Safari */}
      <section id="solution" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
          >
            <span className="gradient-text">SafariLink: The Solution</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                title: 'Virtual Networking Rooms',
                description: 'Themed virtual spaces where participants can meet, chat, and collaborate in real-time.',
                icon: Video,
                features: ['Track-based rooms', 'Real-time chat', 'Video rooms', 'Breakout sessions'],
              },
              {
                title: 'Multilingual AI Mentor',
                description: '24/7 AI assistant that responds in Swahili, English, and French, helping African participants.',
                icon: Sparkles,
                features: ['Swahili support', 'Instant responses', 'Code examples', 'Contextual guides'],
              },
              {
                title: 'Organizer Dashboard',
                description: 'Complete metrics: engagement, participation, projects, feedback, and ROI for sponsors.',
                icon: BarChart3,
                features: ['Real-time metrics', 'Engagement analytics', 'Sponsor ROI', 'Exportable reports'],
              },
              {
                title: 'Live Feedback System',
                description: 'Mentors and judges can provide immediate feedback during project development.',
                icon: MessageSquare,
                features: ['Real-time feedback', 'Rating system', 'Public comments', 'Push notifications'],
              },
              {
                title: 'Smart Team Matching',
                description: 'AI that connects participants based on complementary skills, timezone, and preferences.',
                icon: Users,
                features: ['Skill-based matching', 'Timezone compatibility', 'GitHub analysis', 'Match notifications'],
              },
              {
                title: 'Gamification & Engagement',
                description: 'Badges, leaderboards, daily challenges to keep participants active and motivated.',
                icon: Trophy,
                features: ['Badge system', 'Leaderboards', 'Daily challenges', 'NFT rewards'],
              },
            ].map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glassmorphic p-4 sm:p-5 md:p-6 card-lift"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{solution.title}</h3>
                  <p className="text-white/70 mb-3 sm:mb-4 text-xs sm:text-sm">{solution.description}</p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="text-white/60 text-xs sm:text-sm flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why This Is Bold */}
      <section id="bold" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm mb-4"
            >
              🚀 Why This Is Bold
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="gradient-text">Three World-First Innovations</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg md:text-xl mt-4 max-w-3xl mx-auto">
              SafariLink introduces groundbreaking features that have never been implemented in hackathon platforms before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                title: 'First Native Swahili Support',
                subtitle: 'For Hackathon Platforms',
                description: 'SafariLink is the first hackathon platform with native Swahili support in both UI and AI, breaking language barriers for millions of African developers and making Web3 truly accessible to the continent.',
                icon: Globe,
                gradient: 'from-blue-500 to-cyan-500',
                badge: 'World First',
                details: [
                  'Full UI translation in Swahili',
                  'AI mentor responds in Swahili',
                  'Context-aware for African markets',
                  'Optimized for low connectivity'
                ]
              },
              {
                title: 'First Blockchain-Powered',
                subtitle: 'Post-Hackathon Tracking',
                description: 'The first system to track hackathon projects on-chain after the event ends, creating a verifiable reputation system and connecting winners to long-term funding opportunities.',
                icon: LinkIcon,
                gradient: 'from-purple-500 to-pink-500',
                badge: 'World First',
                details: [
                  'On-chain project tracking',
                  'Verifiable reputation system',
                  'Soulbound NFT certificates',
                  'Automated funding pipeline'
                ]
              },
              {
                title: 'First Multilingual AI',
                subtitle: 'For Web3 Hackathons',
                description: 'The first AI mentor specifically designed for Web3 hackathons with native multilingual support, understanding blockchain context, Solidity, and African developer needs.',
                icon: Brain,
                gradient: 'from-green-500 to-emerald-500',
                badge: 'World First',
                details: [
                  'Web3-specific knowledge base',
                  'Multilingual AI (Swahili, English, French)',
                  'Context-aware for hackathons',
                  'Real-time code assistance'
                ]
              },
            ].map((innovation, index) => {
              const Icon = innovation.icon;
              return (
                <motion.div
                  key={innovation.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="glassmorphic p-5 sm:p-6 md:p-8 card-lift relative overflow-hidden group"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/50 rounded-full text-yellow-300 text-xs font-semibold">
                      {innovation.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${innovation.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 pr-16">
                    {innovation.title}
                  </h3>
                  <p className="text-blue-300 text-sm sm:text-base mb-3 font-medium">
                    {innovation.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/70 text-sm sm:text-base mb-4">
                    {innovation.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2 mt-4 pt-4 border-t border-white/10">
                    {innovation.details.map((detail) => (
                      <li key={detail} className="text-white/60 text-xs sm:text-sm flex items-start">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 sm:mt-10 md:mt-12 text-center"
          >
            <div className="glassmorphic p-4 sm:p-6 md:p-8 rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium">
                <span className="text-yellow-300 font-bold">These innovations</span> don&apos;t just improve ETH Safari—{' '}
                <span className="text-yellow-300 font-bold">they transform</span> how virtual hackathons work globally, 
                making Web3 accessible to millions of developers who were previously excluded.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section id="impact" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
          >
            <span className="gradient-text">Expected Impact</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[
              { metric: '+300%', label: 'Increase in Networking', icon: Users },
              { metric: '+250%', label: 'Improvement in Feedback', icon: MessageSquare },
              { metric: '+200%', label: 'Increase in Engagement', icon: TrendingUp },
              { metric: '+150%', label: 'Participant Satisfaction', icon: Heart },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glassmorphic p-5 sm:p-6 md:p-8 text-center card-lift"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.metric}</div>
                  <div className="text-white/70 text-xs sm:text-sm md:text-base">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section id="tech" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
          >
            <span className="gradient-text">Technical Implementation</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glassmorphic p-5 sm:p-6 md:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Technology Stack</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Next.js 15 + React Server Components',
                  'Real-time: WebSockets + Socket.io',
                  'AI: Claude Sonnet 4 (multilingual)',
                  'Blockchain: Foundry + Smart Contracts',
                  'PWA: Offline-first, 108KB',
                  'Video: WebRTC for virtual rooms',
                ].map((tech) => (
                  <li key={tech} className="text-white/70 text-sm sm:text-base flex items-center">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mr-2 flex-shrink-0" />
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glassmorphic p-5 sm:p-6 md:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Special Features</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Native Swahili support in UI and AI',
                  'Optimized for low connectivity',
                  'Human Passport integration',
                  'Soulbound NFTs for certificates',
                  'Advanced analytics dashboard',
                  'Complete API for integrations',
                ].map((feature) => (
                  <li key={feature} className="text-white/70 text-sm sm:text-base flex items-center">
                    <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
          >
            <span className="gradient-text">Live Demo</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassmorphic p-4 sm:p-5 md:p-6 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Virtual Networking - Demo</h3>
            </div>
            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
              Try the Virtual Networking Rooms in action. Join a room, chat in real-time 
              and collaborate with other participants using video and audio.
            </p>
            <div style={{ height: '400px', minHeight: '400px' }} className="sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden">
              <VirtualNetworking hackathonId="eth-safari-2025" userId={address} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassmorphic p-6 sm:p-8 md:p-10 lg:p-12 card-lift"
          >
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-400 mx-auto mb-4 sm:mb-5 md:mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Ready to Revolutionize ETH Safari?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
              SafariLink is specifically designed to enhance virtual hackathons 
              like ETH Safari, creating immersive and successful experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/hackathons" className="w-full sm:w-auto">
                <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
                  Explore Platform
                </Button>
              </Link>
              <Link href="/hackathons/eth-safari-2025" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Full Hackathon
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

