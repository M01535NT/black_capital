import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { IndustrialValue } from "@/components/industrial/IndustrialValue";
import { IndustrialStats } from "@/components/industrial/IndustrialStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { IndustrialCTA } from "@/components/industrial/IndustrialCTA";
import { JsonLd } from "@/components/seo/JsonLd";

const INDUSTRIAL_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Black Industrial · Naves, Bodegas y Parques Logísticos",
    description:
        "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México.",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: 0,
    provider: {
        "@type": "RealEstateAgent",
        name: "Black Corporativo",
        url: "https://blackcorporativo.com",
    },
};

export const metadata: Metadata = {
    title: "Black Industrial | Naves, Bodegas y Parques Logísticos",
    description:
        "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México. Análisis estructurado para inversión institucional.",
    openGraph: {
        title: "Black Industrial | Infraestructura que Escala",
        description:
            "Portafolio industrial con análisis estructurado para decisiones de inversión institucional en los principales corredores logísticos de México.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

export default function BlackIndustrialPage() {
    return (
        <>
            <SubBrandHero
                brand="Black Industrial"
                backgroundImage="/industrial-hero.png"
                backgroundAlt="Complejo industrial moderno"
                accent="steel"
                overlayClass="from-black/70 via-black/50"
                headline={
                    <>
                        Infraestructura
                        <br />
                        <span className="metallic-gold">que Escala</span>
                    </>
                }
                subtitle="Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México. Análisis estructurado para decisiones de inversión institucional."
                primaryCta={{ label: "Ver Inventario Industrial", href: "/inventario?brand=industrial" }}
                highlights={[
                    { value: "250K+", label: "m² en portafolio" },
                    { value: "45+", label: "naves activas" },
                    { value: "8", label: "estados" },
                ]}
                gridLines
            />
            <IndustrialValue />
            <IndustrialStats />
            <BrandInventory
                brandSlug="industrial"
                propertyUse="Industrial"
                title="Naves y"
                highlight="Parques"
                subtitle="Cada activo ha sido evaluado por ubicación, capacidad, conectividad y retorno para decisiones de inversión institucional."
                ctaText="Ver Portafolio Completo"
                accentColor="steel"
            />
            <IndustrialCTA />
            <JsonLd id="ld-industrial" data={INDUSTRIAL_SCHEMA} />
        </>
    );
}
