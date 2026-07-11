import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Deployed on Vercel: default output keeps next/image optimization + OG image
  // generation (both matter for SEO), while static pages are still statically
  // generated and CDN-served. We intentionally do NOT force `output: "export"`.
  experimental: {
    optimizePackageImports: ["motion", "lucide-react", "lenis"],
  },
};

export default nextConfig;
