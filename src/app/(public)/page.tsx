import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BottomMarquee } from "@/components/home/Marquees";
import { BrandsGrid } from "@/components/home/BrandsGrid";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { SocialProof } from "@/components/home/SocialProof";
import { LeadMagnet } from "@/components/home/LeadMagnet";

export const metadata: Metadata = {
  title: "Black Corporativo | Boutique Inmobiliaria de Alto Nivel",
  description:
    "Plataforma digital inmobiliaria de alta gama para inversores B2B y HNWI. Residencial de lujo, oficinas corporativas y activos industriales en México.",
  openGraph: {
    title: "Black Corporativo | Boutique Inmobiliaria de Alto Nivel",
    description:
      "Residencial de lujo, oficinas corporativas y activos industriales en México. Accede a inventario exclusivo y análisis financieros estructurados.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Corporativo",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsGrid />
      <FeaturedInventory />
      <SocialProof />
      <BottomMarquee />
      <LeadMagnet />
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Black Corporativo",
            "description": "Boutique inmobiliaria de alta gama especializada en propiedades de lujo, comerciales e industriales",
            "url": "https://blackcorporativo.com",
            "priceRange": "$$$$",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MX"
            },
            "sameAs": [
              "https://instagram.com/blackcorporativo",
              "https://linkedin.com/company/blackcorporativo"
            ]
          })
        }}
      />
    </>
  );
}
