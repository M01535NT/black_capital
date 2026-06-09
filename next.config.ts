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
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://*.posthog.com https://*.i.posthog.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://res.cloudinary.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.i.posthog.com https://api.resend.com https://vitals.vercel-insights.com",
              "media-src 'self' https://*.supabase.co",
              "frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
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
        destination: "https://blackmx.vercel.app/:path*",
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
