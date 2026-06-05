import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { BrandsGrid } from "@/components/home/BrandsGrid";
import { ComoTrabajamos } from "@/components/home/ComoTrabajamos";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { SocialProof } from "@/components/home/SocialProof";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: "Black Capital | Plataforma Inmobiliaria de Alta Gama",
    description:
        "Plataforma digital inmobiliaria de alta gama para inversores B2B y HNWI. Residencial, comercial e industrial en México.",
    openGraph: {
        title: "Black Capital | Plataforma Inmobiliaria de Alta Gama",
        description:
            "Residencial, comercial e industrial en México. Accede a inventario exclusivo y análisis financieros estructurados.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Capital",
    },
};

const REAL_ESTATE_AGENT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Black Capital",
    description:
        "Plataforma inmobiliaria de alta gama especializada en propiedades residenciales, comerciales e industriales",
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
    name: "Black Capital",
    url: "https://blackcorporativo.com",
    inLanguage: "es-MX",
    publisher: {
        "@type": "RealEstateAgent",
        name: "Black Capital",
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
            <JsonLd id="ld-organization" data={REAL_ESTATE_AGENT_SCHEMA} />
            <JsonLd id="ld-website" data={WEBSITE_SCHEMA} />
        </>
    );
}
