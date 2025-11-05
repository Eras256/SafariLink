'use client';

import { useSwitchChain, useAccount } from 'wagmi';
import { arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const chains = [arbitrumSepolia, baseSepolia, optimismSepolia];

export function ChainSwitcher() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

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

