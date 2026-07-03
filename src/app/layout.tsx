import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Archivo, Public_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeGuard } from "@/components/theme-guard";
import "./globals.css";

// Display / headings — heavy geometric grotesque (uppercase, tight tracking).
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Body / UI — humanist sans with excellent legibility at small sizes.
const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inmobiliaria en Tijuana | Residencial, Comercial e Industrial | Black Capital",
    template: "%s | Black Capital",
  },
  description:
    "Compra, venta y renta de inmuebles residenciales, comerciales e industriales en Tijuana.",
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
    title: "Inmobiliaria en Tijuana | Black Capital",
    description:
      "Inmuebles residenciales, comerciales e industriales en Tijuana con revisión de precio, zona y documentos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmobiliaria en Tijuana | Black Capital",
    description: "Casas, locales, oficinas, naves y bodegas en Tijuana.",
    // La imagen la aporta el opengraph-image.tsx (convención de Next); evitamos
    // apuntar a un JPG estático que estaba vacío y rompía el preview en X/Twitter.
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
        className={`${archivo.variable} ${publicSans.variable} antialiased min-h-screen flex flex-col bg-black text-white`}
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
