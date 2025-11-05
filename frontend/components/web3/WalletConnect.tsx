'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  
  // Use AppKit hook - it should be initialized by Providers component
  const { open } = useAppKit();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    open();
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <Button disabled className="glassmorphic-button">
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="glassmorphic px-3 py-1.5 rounded-full text-sm text-white">
          {truncateAddress(address)}
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="glassmorphic-button">
      Connect Wallet
    </Button>
  );
}

