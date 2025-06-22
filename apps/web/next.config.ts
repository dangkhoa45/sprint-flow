import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  distDir: '.next',
  cleanDistDir: true,
  poweredByHeader: false,
  trailingSlash: false,
  output: 'standalone',
};

export default nextConfig;
