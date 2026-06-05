import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeGuard } from "@/components/theme-guard";
import "./globals.css";

/**
 * Font stack
 * -----------
 * Body:    Inter (400 / 500 / 600)  — neutral, high-legibility sans.
 * Display: Space Grotesk (500 / 600 / 700) — modern geometric grotesque with
 *          a slightly aggressive, brutalist character. Used for all
 *          headings, eyebrows, and the navbar / nav links. Pairs with
 *          Inter without competing.
 * Mono:    JetBrains Mono (400 / 500) — used for stat counters and any
 *          numeric data. Tabular-nums for stable column alignment.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com"),
  title: {
    default: "Black Capital | Plataforma Inmobiliaria de Alta Gama",
    template: "%s | Black Capital",
  },
  description: "Plataforma digital inmobiliaria de alta gama especializada en propiedades residenciales, comerciales e industriales en México. Análisis financiero estructurado para inversores institucionales y HNWI.",
  keywords: [
    "inmobiliaria de lujo",
    "propiedades premium",
    "bienes raíces corporativos",
    "naves industriales",
    "inversión inmobiliaria",
    "México",
    "CDMX",
    "Monterrey",
    "Guadalajara",
  ],
  authors: [{ name: "Black Capital" }],
  creator: "Black Capital",
  publisher: "Black Capital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com",
    siteName: "Black Capital",
    title: "Black Capital | Plataforma Inmobiliaria de Alta Gama",
    description: "Propiedades residenciales, comerciales e industriales con análisis financiero estructurado para inversores institucionales.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Black Capital - Plataforma Inmobiliaria Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Capital",
    description: "Plataforma inmobiliaria de alta gama en México",
    images: ["/og-image.jpg"],
    creator: "@black_corp",
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com",
  },
};

import { PostHogProvider } from "@/providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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
        <noscript>
          <style>{`
            /* When JS is off, suppress framer-motion's hidden initial state
               (opacity:0) so the hero and animated sections stay visible. */
            [style*="opacity: 0"] { opacity: 1 !important; }
            [style*="transform: translate"] { transform: none !important; }
          `}</style>
        </noscript>
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
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
