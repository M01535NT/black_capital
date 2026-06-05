import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeGuard } from "@/components/theme-guard";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com"),
  title: {
    default: "Black Corporativo | Boutique Inmobiliaria de Alta Gama",
    template: "%s | Black Corporativo",
  },
  description: "Plataforma digital inmobiliaria de alta gama especializada en propiedades de lujo, comerciales e industriales en México. Análisis financiero estructurado para inversores institucionales y HNWI.",
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
  authors: [{ name: "Black Corporativo" }],
  creator: "Black Corporativo",
  publisher: "Black Corporativo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com",
    siteName: "Black Corporativo",
    title: "Black Corporativo | Boutique Inmobiliaria de Alta Gama",
    description: "Propiedades de lujo, comerciales e industriales con análisis financiero estructurado para inversores institucionales.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Black Corporativo - Plataforma Inmobiliaria Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Corporativo",
    description: "Boutique inmobiliaria de alta gama en México",
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
        className={`${inter.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
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
