import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';

// Get projectId from https://dashboard.reown.com
// Fallback para desarrollo - usar variable de entorno en producción
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 
  process.env.NEXT_PUBLIC_PROJECT_ID || 
  'your_reown_project_id_here'; // Fallback para desarrollo

if (!projectId) {
  console.warn('Project ID is not defined. Some wallet features may not work correctly.');
}

export const networks = [arbitrumSepolia, baseSepolia, optimismSepolia];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

