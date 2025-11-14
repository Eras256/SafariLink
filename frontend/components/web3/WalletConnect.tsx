'use client';

import { useAccount, useDisconnect, useConfig } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Inner component that uses wagmi hooks
// Only renders when provider is available
function WalletConnectInner() {
  // Verify that provider is available using useConfig
  // If not available, this will throw an error
  useConfig(); // This will verify that the provider is available
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [appKitReady, setAppKitReady] = useState(false);
  const [lastSyncedAddress, setLastSyncedAddress] = useState<string | null>(null);
  
  // Use AppKit hook - must be called unconditionally (React Hooks rule)
  // If AppKit is not initialized, this will throw an error at runtime
  // We'll handle this gracefully in the component logic
  const appKit = useAppKit();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Separate effect for AppKit readiness check
  useEffect(() => {
    if (!mounted) return;
    
    // Check if AppKit is ready after component mounts
    if (appKit && typeof appKit.open === 'function') {
      setAppKitReady(true);
      return;
    }
    
    // Retry after a short delay (only once)
    const timer = setTimeout(() => {
      // Try to access AppKit again
      if (appKit && typeof appKit.open === 'function') {
        setAppKitReady(true);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [mounted, appKit]); // Include appKit in dependencies

  // Sync Talent Protocol profile automatically when wallet connects
  useEffect(() => {
    const syncTalentProtocol = async () => {
      if (!address) {
        return;
      }

      try {
        // Use direct Next.js endpoint (without proxy/backend)
        const syncUrl = '/api/talent-protocol/sync-address';
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          console.warn('Failed to auto-sync Talent Protocol profile');
        } else {
          setLastSyncedAddress(address.toLowerCase());
        }
      } catch (error) {
        console.warn('Error auto-syncing Talent Protocol profile:', error);
      }
    };

    if (isConnected && address && lastSyncedAddress !== address.toLowerCase()) {
      syncTalentProtocol();
    }
  }, [isConnected, address, lastSyncedAddress]);

  const handleConnect = () => {
    if (appKit && appKit.open) {
      appKit.open();
    } else {
      console.error('AppKit is not initialized. Please refresh the page or check your configuration.');
      // Fallback: try to reload the page
      if (typeof window !== 'undefined' && !appKitReady) {
        console.warn('Attempting to reload page to initialize AppKit...');
        // window.location.reload();
      }
    }
  };

  // Show loading state until mounted and AppKit ready
  if (!mounted || !appKitReady) {
    return (
      <Button disabled className="glassmorphic-button text-xs sm:text-sm px-3 sm:px-4">
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="glassmorphic px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-white">
          {truncateAddress(address)}
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()} className="text-xs sm:text-sm">
          <span className="hidden sm:inline">Disconnect</span>
          <span className="sm:hidden">DC</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      className="glassmorphic-button text-xs sm:text-sm px-3 sm:px-4"
      disabled={!appKitReady}
    >
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </Button>
  );
}

// Wrapper component that waits for component to be mounted on client
// and for WagmiProvider to be available
export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    // Only render after component is mounted on client
    // This ensures the provider is available
    setMounted(true);
    
    // Wait a bit more to ensure provider is mounted
    // This is necessary during hydration
    const timer = setTimeout(() => {
      setProviderReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // On server or before mount, show loading state
  if (!mounted || !providerReady) {
    return (
      <Button disabled className="glassmorphic-button text-xs sm:text-sm px-3 sm:px-4">
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  // Render inner component that uses wagmi hooks
  // Provider must be available at this point
  return <WalletConnectInner />;
}
