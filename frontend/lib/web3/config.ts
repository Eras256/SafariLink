import { createConfig, http } from 'wagmi';
import { cookieStorage, createStorage } from 'wagmi';
import { arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Reown Cloud Project ID
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

const metadata = {
  name: 'SafariLink Platform',
  description: 'The Complete Web3 Hackathon Lifecycle Platform',
  url: 'https://safarilink.xyz',
  icons: ['https://safarilink.xyz/icon.png'],
};

const chains = [arbitrumSepolia, baseSepolia, optimismSepolia] as const;

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ projectId, metadata }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
});

