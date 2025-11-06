/**
 * Initialize Reown AppKit
 * This must be called before any component uses useAppKit hook
 */

import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, networks } from '@/config/web3';

// Set up metadata
const metadata = {
  name: 'SafariLink Platform',
  description: 'The Complete Web3 Hackathon Lifecycle Platform',
  url: 'https://safarilink.xyz', // origin must match your domain & subdomain
  icons: ['https://safarilink.xyz/icon.png'],
};

// Track initialization
let appKitInitialized = false;

// Initialize AppKit immediately on module load (client-side only)
// This MUST execute synchronously before any component renders
if (typeof window !== 'undefined') {
  try {
    if (!projectId) {
      console.warn('Project ID is not defined. AppKit will not be initialized.');
    } else if (!wagmiAdapter) {
      console.warn('WagmiAdapter is not initialized. AppKit will not be initialized.');
    } else if (!networks || networks.length === 0) {
      console.warn('Networks are not configured. AppKit will not be initialized.');
    } else {
      // Initialize AppKit synchronously
      createAppKit({
        adapters: [wagmiAdapter],
        projectId,
        networks: networks as any, // Type assertion needed for AppKitNetwork compatibility
        defaultNetwork: networks[0] as any,
        metadata: metadata,
        features: {
          analytics: true, // Optional - defaults to your Cloud configuration
        },
      });
      appKitInitialized = true;
      console.log('✅ AppKit initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing AppKit:', error);
    // Don't throw - let it fall through so the app can still render
  }
}

// Export function for manual initialization if needed
export function initializeAppKit() {
  if (appKitInitialized) {
    return;
  }

  if (typeof window === 'undefined') {
    // Server-side: skip initialization
    return;
  }

  if (!projectId) {
    console.warn('Project ID is not defined. AppKit will not be initialized.');
    return;
  }

  if (!wagmiAdapter) {
    console.warn('WagmiAdapter is not initialized. AppKit will not be initialized.');
    return;
  }

  if (!networks || networks.length === 0) {
    console.warn('Networks are not configured. AppKit will not be initialized.');
    return;
  }

  try {
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
  } catch (error) {
    console.error('❌ Error initializing AppKit:', error);
  }
}

