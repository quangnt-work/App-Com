import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      '@tiptap/react',
      '@tiptap/starter-kit',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aqgrrysauxpogiffljer.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/ai/shadowing', destination: '/student/ai/shadowing' },
      { source: '/ai/shadowing/:path*', destination: '/student/ai/shadowing/:path*' },
      { source: '/ai/roleplay', destination: '/student/ai/roleplay' },
      { source: '/ai/roleplay/:path*', destination: '/student/ai/roleplay/:path*' },
      { source: '/student/ai/immersive/shadowing', destination: '/student/ai/shadowing' },
      { source: '/student/ai/immersive/shadowing/:path*', destination: '/student/ai/shadowing/:path*' },
      { source: '/student/ai/immersive/roleplay', destination: '/student/ai/roleplay' },
      { source: '/student/ai/immersive/roleplay/:path*', destination: '/student/ai/roleplay/:path*' },
    ];
  },
};

export default nextConfig;
