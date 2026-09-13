/** @type {import('next').NextConfig} */
const RAW_BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/+$/, '');

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/media/:path*',
        destination: `${RAW_BACKEND}/api/v1/media/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${RAW_BACKEND}/api/v1/media/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
