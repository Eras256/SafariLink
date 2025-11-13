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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">S</span>
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold gradient-text hidden xs:inline">SafariLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
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
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <ChainSwitcher />
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white/80 hover:text-white p-1.5 sm:p-2 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 sm:py-4 space-y-2 sm:space-y-3 border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/hackathons"
              className="block text-white/80 hover:text-white transition py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hackathons
            </Link>
            <Link
              href="/eth-safari-evolution"
              className="block text-white/80 hover:text-white transition relative py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative">
                🦁 ETH Safari Evolution
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </span>
            </Link>
            <Link
              href="/projects"
              className="block text-white/80 hover:text-white transition py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/grants"
              className="block text-white/80 hover:text-white transition py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Grants
            </Link>
            <Link
              href="/learn"
              className="block text-white/80 hover:text-white transition py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              href="/dao"
              className="block text-white/80 hover:text-white transition py-1.5 sm:py-2 text-sm sm:text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              DAO
            </Link>
            {mounted && address && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-white transition relative py-1.5 sm:py-2 text-sm sm:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                <span>Dashboard</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              </Link>
            )}
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-white/10">
              <div className="px-1">
                <ChainSwitcher />
              </div>
              <div className="px-1">
                <WalletConnect />
              </div>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">S</span>
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold gradient-text hidden xs:inline">SafariLink</span>
            </Link>
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
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
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <ChainSwitcher />
              <WalletConnect />
            </div>
            <button
              className="lg:hidden text-white/80 hover:text-white p-1.5 sm:p-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return <NavbarContentInner mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />;
}

