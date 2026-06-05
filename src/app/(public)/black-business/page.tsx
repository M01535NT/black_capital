import type { Metadata } from "next";
import { SubBrandHero } from "@/components/shared/SubBrandHero";
import { BusinessValue } from "@/components/business/BusinessValue";
import { BusinessStats } from "@/components/business/BusinessStats";
import { BrandInventory } from "@/components/shared/BrandInventory";
import { BusinessCTA } from "@/components/business/BusinessCTA";
import { JsonLd } from "@/components/seo/JsonLd";

const BUSINESS_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Black Business · Activos Corporativos Clase A",
    description:
        "Oficinas corporativas, locales comerciales y plazas premium para empresas que exigen ubicación estratégica y retorno garantizado.",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: 0,
    provider: {
        "@type": "RealEstateAgent",
        name: "Black Corporativo",
        url: "https://blackcorporativo.com",
    },
};

export const metadata: Metadata = {
    title: "Black Business | Activos Corporativos Clase A en México",
    description:
        "Oficinas corporativas, locales comerciales y plazas premium. Activos para empresas que exigen ubicación estratégica, eficiencia operativa y retorno garantizado.",
    openGraph: {
        title: "Black Business | Activos Corporativos Clase A",
        description:
            "Portafolio curado de propiedades comerciales clase A con análisis financiero estructurado y acompañamiento corporativo integral.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

export default function BlackBusinessPage() {
    return (
        <>
            <SubBrandHero
                brand="Black Business"
                backgroundImage="/business-hero.png"
                backgroundAlt="Oficina corporativa premium"
                accent="gold"
                headline={
                    <>
                        Espacios que
                        <br />
                        Impulsan{" "}
                        <span className="metallic-gold">Negocios</span>
                    </>
                }
                subtitle="Oficinas corporativas, locales comerciales y plazas premium seleccionadas para empresas que exigen ubicación estratégica, eficiencia operativa y retorno garantizado."
                primaryCta={{ label: "Explorar Portafolio", href: "/inventario?brand=business" }}
                secondaryCta={{ label: "Solicitar Asesoría Corporativa", href: "#business-cta" }}
            />
            <BusinessValue />
            <BusinessStats />
            <BrandInventory
                brandSlug="business"
                propertyUse="Comercial"
                title="Activos"
                highlight="Corporativos"
                subtitle="Cada activo ha sido evaluado por ubicación, flujo, retorno y potencial de plusvalía para asegurar decisiones de inversión informadas."
                ctaText="Ver Portafolio Completo"
                accentColor="gold"
            />
            <BusinessCTA />
            <JsonLd id="ld-business" data={BUSINESS_SCHEMA} />
        </>
    );
}
