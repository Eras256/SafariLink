'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { ChainSwitcher } from '@/components/web3/ChainSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

