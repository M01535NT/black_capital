import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeGuard } from "@/components/theme-guard";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com"),
  title: {
    default: "Black Capital — Inversión Inmobiliaria de Alta Gama en México",
    template: "%s | Black Capital",
  },
  description:
    "Plataforma de inversión inmobiliaria premium. Propiedades residenciales, comerciales e industriales con análisis financiero estructurado para family offices e inversores institucionales.",
  keywords: [
    "inversión inmobiliaria México",
    "propiedades de lujo",
    "bienes raíces corporativos",
    "family office",
    "activos inmobiliarios",
    "CDMX",
    "Monterrey",
    "Guadalajara",
    "Tijuana",
  ],
  authors: [{ name: "Black Capital" }],
  creator: "Black Capital",
  publisher: "Black Capital",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://blackcorporativo.com",
    siteName: "Black Capital",
    title: "Black Capital — Inversión Inmobiliaria de Alta Gama",
    description:
      "Propiedades residenciales, comerciales e industriales con análisis financiero estructurado para inversores institucionales.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Black Capital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Capital",
    description: "Plataforma de inversión inmobiliaria premium en México",
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
  alternates: { canonical: "https://blackcorporativo.com" },
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
