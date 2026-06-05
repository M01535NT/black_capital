import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BottomMarquee } from "@/components/home/Marquees";
import { BrandsGrid } from "@/components/home/BrandsGrid";
import { ComoTrabajamos } from "@/components/home/ComoTrabajamos";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { SocialProof } from "@/components/home/SocialProof";
import { LeadMagnet } from "@/components/home/LeadMagnet";
import { JsonLd } from "@/components/seo/JsonLd";

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

const REAL_ESTATE_AGENT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Black Corporativo",
    description:
        "Boutique inmobiliaria de alta gama especializada en propiedades de lujo, comerciales e industriales",
    url: "https://blackcorporativo.com",
    priceRange: "$$$$",
    address: {
        "@type": "PostalAddress",
        addressCountry: "MX",
    },
    sameAs: [
        "https://instagram.com/blackcorporativo",
        "https://linkedin.com/company/blackcorporativo",
    ],
};

const WEBSITE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Black Corporativo",
    url: "https://blackcorporativo.com",
    inLanguage: "es-MX",
    publisher: {
        "@type": "RealEstateAgent",
        name: "Black Corporativo",
    },
};

export default async function HomePage() {
    return (
        <>
            <Hero />
            <BrandsGrid />
            <ComoTrabajamos />
            <FeaturedInventory />
            <SocialProof />
            <BottomMarquee />
            <LeadMagnet />
            <JsonLd id="ld-organization" data={REAL_ESTATE_AGENT_SCHEMA} />
            <JsonLd id="ld-website" data={WEBSITE_SCHEMA} />
        </>
    );
}
