/** @type {import('next').NextConfig} */
const nextConfig = {
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
