/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: process.env.NODE_ENV === 'production', // Only register in production
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in development
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      // Exclude all API routes from service worker
      urlPattern: /^https?:\/\/.*\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheableResponse: {
          statuses: [0, 200],
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      // Exclude external API calls (backend on port 4000, AI service on port 8000)
      urlPattern: /^http:\/\/localhost:(4000|8000)\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheableResponse: {
          statuses: [0, 200],
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    domains: ['localhost', 'safarilink.xyz', 'api.safarilink.xyz'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = withPWA(nextConfig);

