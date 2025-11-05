import { HeroSection } from '@/components/home/HeroSection';
import { ProblemStatement } from '@/components/home/ProblemStatement';
import { SolutionHighlights } from '@/components/home/SolutionHighlights';
import { KeyFeatures } from '@/components/home/KeyFeatures';
import { HowItWorks } from '@/components/home/HowItWorks';
import { EcosystemPartners } from '@/components/home/EcosystemPartners';
import { Testimonials } from '@/components/home/Testimonials';
import { Stats } from '@/components/home/Stats';
import { CTASection } from '@/components/home/CTASection';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh" />
      <NeuralBackground />
      <Navbar />
      <HeroSection />
      <ProblemStatement />
      <SolutionHighlights />
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

