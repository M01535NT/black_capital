import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { InvestmentTabs } from "@/components/home/InvestmentTabs";
import { MethodologyTimeline } from "@/components/home/MethodologyTimeline";
import { InventoryShowcase } from "@/components/home/InventoryShowcase";
import { TrackRecord } from "@/components/home/TrackRecord";
import { ValuesAccordion } from "@/components/home/ValuesAccordion";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Inmobiliaria Premium en Tijuana | Casas, Comercial e Industrial | Black Corporativo",
  description:
    "Encuentra casas residenciales, centros comerciales y naves industriales en Tijuana. Análisis financiero estructurado para familias, empresarios e inversionistas en Baja California.",
  openGraph: {
    title: "Inmobiliaria Premium en Tijuana | Casas, Comercial e Industrial | Black Corporativo",
    description:
      "Propiedades residenciales, comerciales e industriales en Tijuana con análisis financiero. Fraccionamientos privados, locales y naves industriales.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Corporativo",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Black Corporativo",
  description:
    "Inmobiliaria premium en Tijuana. Casas residenciales, centros comerciales y naves industriales con análisis financiero estructurado.",
  url: "https://blackcorporativo.vercel.app",
  priceRange: "$$",
  areaServed: {
    "@type": "City",
    name: "Tijuana",
    containedInPlace: {
      "@type": "State",
      name: "Baja California",
    },
  },
  address: { "@type": "PostalAddress", addressCountry: "MX", addressLocality: "Tijuana", addressRegion: "Baja California" },
  sameAs: [
    "https://instagram.com/blackcorporativo",
    "https://linkedin.com/company/blackcorporativo",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Black Corporativo",
  url: "https://blackcorporativo.vercel.app",
  inLanguage: "es-MX",
  publisher: { "@type": "RealEstateAgent", name: "Black Corporativo" },
};

export default function HomePage() {
  return (
    <main className="scroll-snap-container">
      <Hero />
      <InvestmentTabs />
      <MethodologyTimeline />
      <InventoryShowcase />
      <TrackRecord />
      <ValuesAccordion />
      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
      <JsonLd id="ld-web" data={WEBSITE_SCHEMA} />
    </main>
  );
}
