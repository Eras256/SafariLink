'use client';

import { useSwitchChain, useAccount } from 'wagmi';
import { arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const chains = [arbitrumSepolia, baseSepolia, optimismSepolia];

/**
 * Internal component that uses Wagmi hooks
 * This component is only rendered when mounted and WagmiProvider is available
 */
function ChainSwitcherContent() {
  const [isOpen, setIsOpen] = useState(false);
  
  // These hooks are only called when this component is rendered,
  // which happens after mount and when WagmiProvider is available
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="glassmorphic"
      >
        {chain?.name ?? 'Select Chain'}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-20 glassmorphic p-2 min-w-[200px]">
            {chains.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  switchChain({ chainId: c.id });
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5 transition text-white/80 hover:text-white text-sm"
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Main ChainSwitcher component
 * Handles mounting state and only renders ChainSwitcherContent when ready
 */
export function ChainSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    // Only set mounted to true after component has mounted on client
    setMounted(true);
    
    // Add a small delay to ensure WagmiProvider is fully mounted
    // This prevents the "useConfig must be used within WagmiProvider" error
    const timer = setTimeout(() => {
      setProviderReady(true);
    }, 100); // Small delay to ensure provider is ready

    return () => clearTimeout(timer);
  }, []);

  // Show loading state until mounted and provider is ready (client-side only)
  if (!mounted || !providerReady) {
    return (
      <Button variant="outline" size="sm" className="glassmorphic" disabled>
        Select Chain
      </Button>
    );
  }

  // Only render ChainSwitcherContent after mount and provider is ready
  return <ChainSwitcherContent />;
}
