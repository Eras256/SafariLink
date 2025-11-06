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
  Rocket
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
      <section className="relative min-h-screen flex items-center justify-center pt-32 md:pt-40 px-4">
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
            className="text-5xl md:text-7xl font-bold"
          >
            <span className="gradient-text">Revoluciona ETH Safari</span>
            <br />
            <span className="text-white">Con SafariLink</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
          >
            La plataforma integral que transforma hackathons virtuales en experiencias 
            inmersivas, colaborativas y exitosas para el ecosistema Web3 africano.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="#demo">
              <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
                Ver Demo
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explorar Features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Desafíos de Hackathons Virtuales</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Desconexión Social',
                description: 'Los participantes virtuales se sienten aislados, dificultando networking y colaboración.',
                icon: Users,
              },
              {
                title: 'Falta de Feedback en Tiempo Real',
                description: 'Sin retroalimentación inmediata de mentores y jueces, los proyectos no alcanzan su potencial.',
                icon: MessageSquare,
              },
              {
                title: 'Métricas Limitadas',
                description: 'Organizadores sin visibilidad completa de engagement, participación y éxito del evento.',
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
                  className="glassmorphic p-8 card-lift"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                  <p className="text-white/70">{problem.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution - SafariLink for ETH Safari */}
      <section id="solution" className="py-20 px-4 bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="gradient-text">SafariLink: La Solución</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Salas Virtuales de Networking',
                description: 'Espacios virtuales temáticos donde participantes pueden encontrarse, chatear y colaborar en tiempo real.',
                icon: Video,
                features: ['Salas por track', 'Chat en tiempo real', 'Video rooms', 'Breakout sessions'],
              },
              {
                title: 'AI Mentor Multilingüe',
                description: 'Asistente AI 24/7 que responde en Swahili, Inglés y Francés, ayudando a participantes africanos.',
                icon: Sparkles,
                features: ['Soporte Swahili', 'Respuestas instantáneas', 'Ejemplos de código', 'Guías contextuales'],
              },
              {
                title: 'Dashboard de Organizadores',
                description: 'Métricas completas: engagement, participación, proyectos, feedback y ROI para sponsors.',
                icon: BarChart3,
                features: ['Métricas en tiempo real', 'Analytics de engagement', 'ROI para sponsors', 'Reportes exportables'],
              },
              {
                title: 'Sistema de Feedback en Vivo',
                description: 'Mentores y jueces pueden dar feedback inmediato durante el desarrollo del proyecto.',
                icon: MessageSquare,
                features: ['Feedback en tiempo real', 'Sistema de ratings', 'Comentarios públicos', 'Notificaciones push'],
              },
              {
                title: 'Team Matching Inteligente',
                description: 'AI que conecta participantes basado en skills complementarios, timezone y preferencias.',
                icon: Users,
                features: ['Matching por skills', 'Compatibilidad de timezone', 'Análisis de GitHub', 'Notificaciones de match'],
              },
              {
                title: 'Gamificación y Engagement',
                description: 'Badges, leaderboards, challenges diarios para mantener participantes activos y motivados.',
                icon: Trophy,
                features: ['Sistema de badges', 'Leaderboards', 'Daily challenges', 'Recompensas NFT'],
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
                  className="glassmorphic p-6 card-lift"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{solution.title}</h3>
                  <p className="text-white/70 mb-4 text-sm">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="text-white/60 text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
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

      {/* Impact Metrics */}
      <section id="impact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Impacto Esperado</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: '+300%', label: 'Incremento en Networking', icon: Users },
              { metric: '+250%', label: 'Mejora en Feedback', icon: MessageSquare },
              { metric: '+200%', label: 'Aumento en Engagement', icon: TrendingUp },
              { metric: '+150%', label: 'Satisfacción de Participantes', icon: Heart },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glassmorphic p-8 text-center card-lift"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.metric}</div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section id="tech" className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Implementación Técnica</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glassmorphic p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Stack Tecnológico</h3>
              <ul className="space-y-3">
                {[
                  'Next.js 15 + React Server Components',
                  'Real-time: WebSockets + Socket.io',
                  'AI: Claude Sonnet 4 (multilingüe)',
                  'Blockchain: Foundry + Smart Contracts',
                  'PWA: Offline-first, 108KB',
                  'Video: WebRTC para salas virtuales',
                ].map((tech) => (
                  <li key={tech} className="text-white/70 flex items-center">
                    <Zap className="w-4 h-4 text-blue-400 mr-2" />
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
              className="glassmorphic p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Características Especiales</h3>
              <ul className="space-y-3">
                {[
                  'Soporte Swahili nativo en UI y AI',
                  'Optimizado para baja conectividad',
                  'Integración con Human Passport',
                  'NFTs Soulbound para certificados',
                  'Dashboard de analytics avanzado',
                  'API completa para integraciones',
                ].map((feature) => (
                  <li key={feature} className="text-white/70 flex items-center">
                    <Rocket className="w-4 h-4 text-purple-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 px-4 bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Demo en Vivo</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassmorphic p-6 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-semibold text-white">Virtual Networking - Demo</h3>
            </div>
            <p className="text-white/70 mb-6">
              Prueba las Salas Virtuales de Networking en acción. Únete a una sala, chatea en tiempo real 
              y colabora con otros participantes usando video y audio.
            </p>
            <div style={{ height: '600px', minHeight: '600px' }} className="rounded-lg overflow-hidden">
              <VirtualNetworking hackathonId="eth-safari-2025" userId={address} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassmorphic p-12 card-lift"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Listo para Revolucionar ETH Safari?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              SafariLink está diseñado específicamente para mejorar hackathons virtuales 
              como ETH Safari, creando experiencias inmersivas y exitosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hackathons">
                <Button size="lg" className="glassmorphic-button w-full sm:w-auto">
                  Explorar Plataforma
                </Button>
              </Link>
              <Link href="/hackathons/eth-safari-2025">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver Hackathon Completo
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

