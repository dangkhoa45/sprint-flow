import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
