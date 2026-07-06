/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Linting runs as its own dedicated CI job (`npm run lint` at the repo
    // root, ESLint 9 flat config). Next's built-in build-time ESLint step
    // uses a legacy CLIEngine-style integration that isn't compatible with
    // flat config, so skip it here to avoid double-linting/build breakage.
    ignoreDuringBuilds: true,
  },
  basePath: '/admin',
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:4001/api/:path*' }];
  },
};
module.exports = nextConfig;
