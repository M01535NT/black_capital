import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { LuxuryValue } from "@/components/luxury/LuxuryValue";
import { LuxuryStats } from "@/components/luxury/LuxuryStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { LuxuryCTA } from "@/components/luxury/LuxuryCTA";
import { JsonLd } from "@/components/seo/JsonLd";

const LUXURY_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Black Luxury · Residencias de Súper Lujo",
    description:
        "Portafolio curado de residencias trofeo, penthouses de autor y desarrollos exclusivos para inversores HNWI en México.",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: 0,
    provider: {
        "@type": "RealEstateAgent",
        name: "Black Corporativo",
        url: "https://blackcorporativo.com",
    },
};

export const metadata: Metadata = {
    title: "Black Luxury | Residencias de Súper Lujo en México",
    description:
        "Residencias trofeo, penthouses de autor y desarrollos exclusivos para inversores HNWI. Propiedades curadas con análisis financiero personalizado.",
    openGraph: {
        title: "Black Luxury | Residencias de Súper Lujo en México",
        description:
            "Portafolio curado de propiedades de súper lujo con análisis financiero, acceso Off-Market y acompañamiento fiduciario.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

export default function BlackLuxuryPage() {
    return (
        <>
            <SubBrandHero
                brand="Black Luxury"
                backgroundImage="/luxury-hero.png"
                backgroundAlt="Residencia de súper lujo"
                accent="gold"
                headline={
                    <>
                        Donde el Lujo
                        <br />
                        se Convierte en{" "}
                        <span className="metallic-gold">Legado</span>
                    </>
                }
                subtitle="Residencias trofeo, penthouses de autor y desarrollos exclusivos seleccionados para inversores HNWI con los estándares más exigentes del mercado inmobiliario mexicano."
                primaryCta={{ label: "Explorar Portafolio", href: "/inventario?brand=luxury" }}
                secondaryCta={{ label: "Solicitar Acceso Privado", href: "#luxury-cta" }}
            />
            <LuxuryValue />
            <LuxuryStats />
            <BrandInventory
                brandSlug="luxury"
                propertyUse="Residencial"
                title="Propiedades de"
                highlight="Súper Lujo"
                subtitle="Cada propiedad ha sido verificada, analizada financieramente y aprobada por nuestro comité de inversiones."
                ctaText="Ver Portafolio Completo"
                accentColor="gold"
            />
            <LuxuryCTA />
            <JsonLd id="ld-luxury" data={LUXURY_SCHEMA} />
        </>
    );
}
