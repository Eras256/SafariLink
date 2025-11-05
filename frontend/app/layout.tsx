import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SafariLink Platform - The Complete Web3 Hackathon Lifecycle',
  description: 'From First Hack to Global Funding – Optimized for Africa & Emerging Markets',
  keywords: ['Web3', 'Hackathon', 'Blockchain', 'DeFi', 'NFT', 'DAO'],
  authors: [{ name: 'SafariLink Team' }],
  openGraph: {
    title: 'SafariLink Platform',
    description: 'The Complete Web3 Hackathon Lifecycle Platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafariLink Platform',
    description: 'The Complete Web3 Hackathon Lifecycle Platform',
  },
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}

