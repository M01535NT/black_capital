import type { Metadata } from "next";
import { LuxuryHero } from "@/components/luxury/LuxuryHero";
import { LuxuryValue } from "@/components/luxury/LuxuryValue";
import { LuxuryStats } from "@/components/luxury/LuxuryStats";
import { LuxuryInventory } from "@/components/luxury/LuxuryInventory";
import { LuxuryCTA } from "@/components/luxury/LuxuryCTA";

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
            <LuxuryHero />
            <LuxuryValue />
            <LuxuryStats />
            <LuxuryInventory />
            <LuxuryCTA />
        </>
    );
}
