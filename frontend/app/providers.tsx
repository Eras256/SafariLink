'use client';

import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, networks } from '@/config/web3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode, useEffect, useRef } from 'react';
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
  url: 'https://safarilink.xyz',
  icons: ['https://safarilink.xyz/icon.png'],
};

// Initialize AppKit synchronously on module load (client-side only)
// This MUST execute before any component renders
let appKitInitialized = false;

if (typeof window !== 'undefined') {
  try {
    if (projectId && wagmiAdapter && networks && networks.length > 0) {
      createAppKit({
        adapters: [wagmiAdapter],
        projectId,
        networks: networks,
        defaultNetwork: networks[0],
        metadata: metadata,
        features: {
          analytics: true,
        },
      });
      appKitInitialized = true;
      console.log('✅ AppKit initialized successfully');
    } else {
      console.warn('⚠️ AppKit initialization skipped - missing configuration');
    }
  } catch (error) {
    console.error('❌ Error initializing AppKit:', error);
  }
}

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

