'use client';

// Force dynamic rendering to avoid SSR issues with Wagmi hooks in Navbar
export const dynamic = 'force-dynamic';

import { HeroSection } from '@/components/home/HeroSection';
import { ProblemStatement } from '@/components/home/ProblemStatement';
import { SolutionHighlights } from '@/components/home/SolutionHighlights';
import { WhyThisIsBold } from '@/components/home/WhyThisIsBold';
import { KeyFeatures } from '@/components/home/KeyFeatures';
import { HowItWorks } from '@/components/home/HowItWorks';
import { EcosystemPartners } from '@/components/home/EcosystemPartners';
import { Testimonials } from '@/components/home/Testimonials';
import { Stats } from '@/components/home/Stats';
import { CTASection } from '@/components/home/CTASection';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until mounted to avoid SSR issues with Wagmi hooks in Navbar
  if (!mounted) {
    return (
      <main className="min-h-screen relative">
        <div className="gradient-mesh" />
        <NeuralBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading...</div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <HeroSection />
      <ProblemStatement />
      <SolutionHighlights />
      <WhyThisIsBold />
      <KeyFeatures />
      <HowItWorks />
      <EcosystemPartners />
      <Testimonials />
      <Stats />
      <CTASection />
      <Footer />
    </main>
  );
}

