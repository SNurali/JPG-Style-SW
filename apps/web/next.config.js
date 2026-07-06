/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Linting runs as its own dedicated CI job (`npm run lint` at the repo
    // root, ESLint 9 flat config). Next's built-in build-time ESLint step
    // uses a legacy CLIEngine-style integration that isn't compatible with
    // flat config, so skip it here to avoid double-linting/build breakage.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/images/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://smartwash_api:3011/api/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'http://smartwash_api:3011/images/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
