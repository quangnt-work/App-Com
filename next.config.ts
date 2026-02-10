import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-url.supabase.co', // Thay bằng domain chứa ảnh/audio của bạn
      },
    ],
  },
};

export default nextConfig;
