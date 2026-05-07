import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 빌드 시 TypeScript/ESLint 에러 무시 (시연용 빠른 배포)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
