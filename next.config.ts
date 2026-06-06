import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Configure SW cache to be offline-first
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      // Legal slug rename (Jun 2026) — permanent 301
      {
        source: "/legal/privacidad",
        destination: "/legal/aviso-privacidad",
        permanent: true,
      },
      {
        source: "/legal/terminos",
        destination: "/legal/terminos-condiciones",
        permanent: true,
      },
      // Canonical domain redirect (Jun 2026)
      {
        source: "/:path*",
        has: [{ type: "host", value: "black-corporativo.com" }],
        destination: "https://blackcorporativo.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  /* config options here */
};

export default withPWA(nextConfig);
