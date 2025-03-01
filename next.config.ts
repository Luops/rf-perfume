import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {}, // Pode ser removido se não tiver outros experimentos
  images: {
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "http2.mlstatic.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ieuyxhqdvesyzcwoppcm.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "acdn.mitiendanube.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pixsector.com",
        port: ""
      }
    ],
  },
};

export default nextConfig;
