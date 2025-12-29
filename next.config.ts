import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['images.unsplash.com', 'i.pravatar.cc', 'ui-avatars.com'],
  },
};

export default nextConfig;
