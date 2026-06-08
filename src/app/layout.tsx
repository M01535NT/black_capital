import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeGuard } from "@/components/theme-guard";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // 200 unused, 800 only in LeadMagnet (likely orphan)
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inmobiliaria Premium en Tijuana | Casas, Comercial e Industrial | Black Capital",
    template: "%s | Black Capital",
  },
  description:
    "Encuentra casas residenciales, centros comerciales y naves industriales en Tijuana. Análisis financiero estructurado para familias, empresarios e inversionistas en Baja California.",
  keywords: [
    "inmobiliaria Tijuana",
    "casas en Tijuana",
    "centros comerciales Tijuana",
    "naves industriales Tijuana",
    "bienes raíces Tijuana",
    "fraccionamientos privados",
    "inversión inmobiliaria",
    "Baja California",
  ],
  authors: [{ name: "Black Capital" }],
  creator: "Black Capital",
  publisher: "Black Capital",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: "Black Capital",
    title: "Inmobiliaria Premium en Tijuana | Black Capital",
    description:
      "Casas residenciales, centros comerciales y naves industriales en Tijuana con análisis financiero estructurado.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria Premium en Tijuana | Black Capital",
    description: "Casas, centros comerciales y naves industriales en Tijuana, Baja California.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
};

import { PostHogProvider } from "@/providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Black Capital" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  if (!path.startsWith('/admin')) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-black text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ThemeGuard />
          <PostHogProvider>
            {children}
            <Toaster position="top-right" theme="dark" />
          </PostHogProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
