import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sepolia, arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';

// Get projectId from https://dashboard.reown.com
// Fallback para desarrollo - usar variable de entorno en producción
// Limpiar el projectId de espacios y saltos de línea (común en Vercel)
const cleanProjectId = (id: string | undefined): string => {
  if (!id) return '';
  return id.trim().replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '');
};

export const projectId = cleanProjectId(
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 
  process.env.NEXT_PUBLIC_PROJECT_ID
) || ''; // Must be provided via environment variable

if (!projectId) {
  console.warn('Project ID is not defined. Some wallet features may not work correctly.');
}

export const networks = [sepolia, arbitrumSepolia, baseSepolia, optimismSepolia];

// Lazy initialization of WagmiAdapter to avoid SSR issues and COOP checks
let _wagmiAdapter: WagmiAdapter | null = null;

function createWagmiAdapter(): WagmiAdapter {
  if (_wagmiAdapter) {
    return _wagmiAdapter;
  }

  // Only create adapter on client-side to avoid SSR issues
  if (typeof window === 'undefined') {
    // Server-side: create a minimal adapter that won't cause COOP checks
    // This will be replaced on client-side
    _wagmiAdapter = new WagmiAdapter({
      storage: createStorage({
        storage: cookieStorage,
      }),
      ssr: true,
      projectId,
      networks,
    });
  } else {
    // Client-side: create adapter with error handling for COOP checks
    try {
      _wagmiAdapter = new WagmiAdapter({
        storage: createStorage({
          storage: cookieStorage,
        }),
        ssr: false, // Disable SSR for client-side adapter to avoid COOP checks
        projectId,
        networks,
      });
    } catch (error) {
      // If adapter creation fails (e.g., due to COOP checks), create a fallback
      console.warn('Failed to create WagmiAdapter, retrying with SSR enabled:', error);
      _wagmiAdapter = new WagmiAdapter({
        storage: createStorage({
          storage: cookieStorage,
        }),
        ssr: true,
        projectId,
        networks,
      });
    }
  }

  return _wagmiAdapter;
}

// Export getter for wagmiAdapter - lazy initialization
export const wagmiAdapter = (() => {
  // Create adapter immediately but with proper error handling
  return createWagmiAdapter();
})();

export const config = wagmiAdapter.wagmiConfig;

