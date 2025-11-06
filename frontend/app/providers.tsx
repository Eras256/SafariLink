'use client';

import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, networks } from '@/config/web3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode, useEffect, useState } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Set up metadata
const metadata = {
  name: 'SafariLink Platform',
  description: 'The Complete Web3 Hackathon Lifecycle Platform',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://safarilink.xyz',
  icons: ['https://safarilink.xyz/icon.png'],
};

// Track initialization state
let appKitInitialized = false;

// Initialize AppKit function - must be called before any component uses useAppKit
function initializeAppKitOnce() {
  if (appKitInitialized) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false; // Server-side: skip
  }

  try {
    if (!projectId) {
      console.warn('⚠️ AppKit: Project ID not configured');
      return false;
    }

    if (!wagmiAdapter) {
      console.warn('⚠️ AppKit: WagmiAdapter not configured');
      return false;
    }

    if (!networks || networks.length === 0) {
      console.warn('⚠️ AppKit: Networks not configured');
      return false;
    }

    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: networks as any, // Type assertion needed for AppKitNetwork compatibility
      defaultNetwork: networks[0] as any,
      metadata: metadata,
      features: {
        analytics: true,
      },
    });
    
    appKitInitialized = true;
    console.log('✅ AppKit initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing AppKit:', error);
    return false;
  }
}

// Initialize AppKit on module load (client-side only)
// Delay initialization significantly to avoid SSR issues and COOP checks during page load
// This prevents Base Account SDK COOP checks from interfering with initial page render
if (typeof window !== 'undefined') {
  // Use a longer delay to ensure page is fully loaded before initializing AppKit
  // This prevents Base Account SDK COOP checks from causing 500 errors during SSR
  setTimeout(() => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        // Try to initialize AppKit, but catch any errors (e.g., COOP checks)
        try {
          initializeAppKitOnce();
        } catch (error) {
          // Silently handle initialization errors - AppKit will be initialized later if needed
          if (process.env.NODE_ENV === 'development') {
            console.warn('AppKit initialization delayed due to error:', error);
          }
        }
      });
    } else {
      try {
        initializeAppKitOnce();
      } catch (error) {
        // Silently handle initialization errors
        if (process.env.NODE_ENV === 'development') {
          console.warn('AppKit initialization delayed due to error:', error);
        }
      }
    }
  }, 500); // Longer delay to ensure page is fully loaded and avoid COOP check errors
}

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize AppKit on mount (client-side only) - MUST happen before any component uses useAppKit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to initialize AppKit, but handle errors gracefully
      try {
        initializeAppKitOnce();
      } catch (error) {
        // Handle initialization errors gracefully - AppKit might fail due to COOP checks
        if (process.env.NODE_ENV === 'development') {
          console.warn('AppKit initialization error in useEffect:', error);
        }
      }
      // Set initialized after a microtask to ensure AppKit is ready
      setTimeout(() => {
        setIsInitialized(true);
      }, 0);
    } else {
      // Server-side: mark as initialized to render children
      setIsInitialized(true);
    }
  }, []);

  // Server-side: render without provider (hooks will not be called on server)
  // Components with 'use client' won't execute hooks during SSR
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  // Client-side: wagmiAdapter and wagmiConfig MUST be available immediately
  // They are created synchronously when the module is imported
  // If they're not available, there's a configuration problem
  const wagmiConfig = wagmiAdapter?.wagmiConfig;
  
  if (!wagmiAdapter || !wagmiConfig) {
    console.error('❌ WagmiAdapter or WagmiConfig not available');
    console.error('This indicates a configuration problem. Please check:', {
      hasAdapter: !!wagmiAdapter,
      hasConfig: !!wagmiConfig,
      projectId: projectId ? 'set' : 'missing',
      networks: networks?.length || 0,
    });
    // Return children without provider - components will show errors
    // This should never happen if the configuration is correct
    return <>{children}</>;
  }

  // Get initial state from cookies for SSR hydration
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies);

  // ALWAYS render WagmiProvider when on client-side with valid config
  // This ensures hooks can be used unconditionally in client components
  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

