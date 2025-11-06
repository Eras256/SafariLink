'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { ChainSwitcher } from '@/components/web3/ChainSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3 } from 'lucide-react';
import { useAccount } from 'wagmi';

// Inner component that uses wagmi hooks - must be inside WagmiProvider
function NavbarContentInner({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Hooks must be called unconditionally (React rules)
  // WagmiProvider is always available on client-side via layout providers
  const { address: accountAddress } = useAccount();

  // Update address state
  useEffect(() => {
    if (accountAddress) {
      setAddress(accountAddress);
    } else {
      setAddress(undefined);
    }
  }, [accountAddress]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphic border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">SafariLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/hackathons" className="text-white/80 hover:text-white transition">
              Hackathons
            </Link>
            <Link href="/eth-safari-evolution" className="text-white/80 hover:text-white transition relative group">
              <span className="relative">
                🦁 ETH Safari
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </span>
            </Link>
            <Link href="/projects" className="text-white/80 hover:text-white transition">
              Projects
            </Link>
            <Link href="/grants" className="text-white/80 hover:text-white transition">
              Grants
            </Link>
            <Link href="/learn" className="text-white/80 hover:text-white transition">
              Learn
            </Link>
            <Link href="/dao" className="text-white/80 hover:text-white transition">
              DAO
            </Link>
            {mounted && address && (
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-white/80 hover:text-white transition relative group"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ChainSwitcher />
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10">
            <Link
              href="/hackathons"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hackathons
            </Link>
            <Link
              href="/eth-safari-evolution"
              className="block text-white/80 hover:text-white transition relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative">
                🦁 ETH Safari Evolution
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </span>
            </Link>
            <Link
              href="/projects"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/grants"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Grants
            </Link>
            <Link
              href="/learn"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              href="/dao"
              className="block text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              DAO
            </Link>
            {mounted && address && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-white transition relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              </Link>
            )}
            <div className="pt-4 space-y-2 border-t border-white/10">
              <ChainSwitcher />
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the inner component after mount to ensure WagmiProvider is available
  if (!mounted) {
    // Return navbar without dashboard link during SSR
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glassmorphic border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold gradient-text">SafariLink</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/hackathons" className="text-white/80 hover:text-white transition">
                Hackathons
              </Link>
              <Link href="/eth-safari-evolution" className="text-white/80 hover:text-white transition relative group">
                <span className="relative">
                  🦁 ETH Safari
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                </span>
              </Link>
              <Link href="/projects" className="text-white/80 hover:text-white transition">
                Projects
              </Link>
              <Link href="/grants" className="text-white/80 hover:text-white transition">
                Grants
              </Link>
              <Link href="/learn" className="text-white/80 hover:text-white transition">
                Learn
              </Link>
              <Link href="/dao" className="text-white/80 hover:text-white transition">
                DAO
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <ChainSwitcher />
              <WalletConnect />
            </div>
            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return <NavbarContentInner mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />;
}

