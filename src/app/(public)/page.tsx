import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BrandsGrid } from "@/components/home/BrandsGrid";
import { ComoTrabajamos } from "@/components/home/ComoTrabajamos";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { SocialProof } from "@/components/home/SocialProof";
import { LoQueDicen } from "@/components/home/LoQueDicen";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Black Capital — Inversión Inmobiliaria de Alta Gama en México",
  description:
    "Plataforma de inversión inmobiliaria premium. Estructuramos, curamos y gestionamos activos residenciales, comerciales e industriales para family offices e inversores institucionales en México.",
  openGraph: {
    title: "Black Capital — Inversión Inmobiliaria de Alta Gama",
    description:
      "Propiedades residenciales, comerciales e industriales con análisis financiero estructurado. CDMX, Monterrey, Guadalajara, Tijuana.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Capital",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Black Capital",
  description:
    "Plataforma de inversión inmobiliaria de alta gama. Propiedades residenciales, comerciales e industriales con análisis financiero estructurado.",
  url: "https://blackcorporativo.com",
  priceRange: "$$$$",
  address: { "@type": "PostalAddress", addressCountry: "MX" },
  sameAs: [
    "https://instagram.com/blackcorporativo",
    "https://linkedin.com/company/blackcorporativo",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Black Capital",
  url: "https://blackcorporativo.com",
  inLanguage: "es-MX",
  publisher: { "@type": "RealEstateAgent", name: "Black Capital" },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://blackcorporativo.com",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <main className="scroll-snap-container">
        <Hero />
        <BrandsGrid />
        <ComoTrabajamos />
        <FeaturedInventory />
        <SocialProof />
        <LoQueDicen />
        <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
        <JsonLd id="ld-web" data={WEBSITE_SCHEMA} />
        <JsonLd id="ld-breadcrumb" data={BREADCRUMB_SCHEMA} />
      </main>
    </>
  );
}
