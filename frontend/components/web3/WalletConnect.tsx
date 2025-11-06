'use client';

import { useAccount, useDisconnect, useConfig } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Componente interno que usa los hooks de wagmi
// Solo se renderiza cuando el provider está disponible
function WalletConnectInner() {
  // Verificar que el provider esté disponible usando useConfig
  // Si no está disponible, esto lanzará un error
  useConfig(); // Esto verificará que el provider esté disponible
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [appKitReady, setAppKitReady] = useState(false);
  
  // Use AppKit hook - must be called unconditionally
  // If AppKit is not initialized, this will throw an error
  let appKit: ReturnType<typeof useAppKit> | null = null;
  let appKitError: Error | null = null;
  
  try {
    appKit = useAppKit();
  } catch (error) {
    appKitError = error as Error;
    // Silently catch - we'll handle this in the component logic
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Separate effect for AppKit readiness check
  useEffect(() => {
    if (!mounted) return;
    
    // Check if AppKit is ready after component mounts
    if (appKit && !appKitError && typeof appKit.open === 'function') {
      setAppKitReady(true);
      return;
    }
    
    // Retry after a short delay (only once)
    const timer = setTimeout(() => {
      try {
        // Try to access AppKit again
        if (appKit && typeof appKit.open === 'function') {
          setAppKitReady(true);
        }
      } catch {
        // Still not ready - will show loading state
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [mounted]); // Only depend on mounted, not on appKit/appKitError to avoid loops

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
  if (!mounted || (!appKitReady && appKitError)) {
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
    <Button 
      onClick={handleConnect} 
      className="glassmorphic-button"
      disabled={!appKitReady}
    >
      Connect Wallet
    </Button>
  );
}

// Componente wrapper que espera a que el componente esté montado en el cliente
// y que el WagmiProvider esté disponible
export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    // Solo renderizar después de que el componente esté montado en el cliente
    // Esto asegura que el provider esté disponible
    setMounted(true);
    
    // Esperar un poco más para asegurarse de que el provider esté montado
    // Esto es necesario durante la hidratación
    const timer = setTimeout(() => {
      setProviderReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // En el servidor o antes del mount, mostrar estado de carga
  if (!mounted || !providerReady) {
    return (
      <Button disabled className="glassmorphic-button">
        Loading...
      </Button>
    );
  }

  // Renderizar el componente interno que usa los hooks de wagmi
  // El provider debe estar disponible en este punto
  return <WalletConnectInner />;
}
