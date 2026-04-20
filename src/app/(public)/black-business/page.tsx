import type { Metadata } from "next";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessValue } from "@/components/business/BusinessValue";
import { BusinessStats } from "@/components/business/BusinessStats";
import { BusinessInventory } from "@/components/business/BusinessInventory";
import { BusinessCTA } from "@/components/business/BusinessCTA";

export const metadata: Metadata = {
    title: "Black Business | Oficinas y Locales Comerciales Premium en México",
    description:
        "Oficinas corporativas, locales comerciales y plazas premium en los mejores corredores de negocio de México. Análisis financiero estructurado para inversores institucionales y empresas.",
    openGraph: {
        title: "Black Business | Oficinas y Locales Comerciales Premium en México",
        description:
            "Portafolio de activos comerciales con análisis financiero completo: cap rates, ocupación, y proyecciones de rendimiento para inversores B2B.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

export default function BlackBusinessPage() {
    return (
        <>
            <BusinessHero />
            <BusinessValue />
            <BusinessStats />
            <BusinessInventory />
            <BusinessCTA />
        </>
    );
}
