import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeHero } from "@/components/home/HomeHero";
import { SignatureCounters } from "@/components/home/SignatureCounters";
import { BusinessLines } from "@/components/home/BusinessLines";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { MethodologyStack } from "@/components/home/MethodologyStack";
import { ToolsSection } from "@/components/home/ToolsSection";
import { VoicesWall } from "@/components/home/VoicesWall";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export const metadata: Metadata = {
  title: "Inmobiliaria en Tijuana",
  description:
    "Compra, venta y renta de inmuebles residenciales, comerciales e industriales en Tijuana con valor comercial, revisión documental y ruta de cierre.",
  openGraph: {
    title: "Black Capital | Inmobiliaria en Tijuana",
    description:
      "Representación inmobiliaria para comprar, vender, rentar o conocer el valor comercial de un inmueble en Tijuana.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Capital",
    // Al redefinir openGraph aquí se pierde la imagen de convención (opengraph-image.tsx),
    // así que la referenciamos explícitamente para conservar el preview social.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Black Capital - Inmobiliaria en Tijuana" }],
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Black Capital",
  url: "https://blackmx.vercel.app",
  areaServed: {
    "@type": "City",
    name: "Tijuana",
    containedInPlace: { "@type": "State", name: "Baja California" },
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
    addressLocality: "Tijuana",
    addressRegion: "Baja California",
  },
};

export default function HomePage() {
  return (
    // El <main> semántico vive en el layout público (#main-content); aquí un div evita <main> anidados.
    <div className="bg-background">
      <HomeHero />
      <SignatureCounters />
      <BusinessLines />
      <FeaturedInventory />
      <MethodologyStack />
      <ToolsSection />
      <VoicesWall />
      <FaqSection />
      <ClosingCTA />
      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
    </div>
  );
}
