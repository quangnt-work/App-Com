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
    ],
  },
};

export default nextConfig;
