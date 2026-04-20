import type { Metadata } from "next";
import { IndustrialHero } from "@/components/industrial/IndustrialHero";
import { IndustrialValue } from "@/components/industrial/IndustrialValue";
import { IndustrialStats } from "@/components/industrial/IndustrialStats";
import { IndustrialInventory } from "@/components/industrial/IndustrialInventory";
import { IndustrialCTA } from "@/components/industrial/IndustrialCTA";

export const metadata: Metadata = {
    title: "Black Industrial | Naves Industriales y Terrenos en México",
    description:
        "Terrenos macro, naves industriales clase A y parques logísticos en los principales corredores de México. Análisis financiero estructurado para inversores institucionales.",
    openGraph: {
        title: "Black Industrial | Naves Industriales y Terrenos en México",
        description:
            "Portafolio de activos industriales con análisis financiero completo: cap rates, ocupación histórica y proyecciones de rendimiento.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

export default function BlackIndustrialPage() {
    return (
        <>
            <IndustrialHero />
            <IndustrialValue />
            <IndustrialStats />
            <IndustrialInventory />
            <IndustrialCTA />
        </>
    );
}
