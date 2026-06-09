/**
 * LuxuryStats — animated counter grid for the Black Luxury landing.
 *
 * Thin wrapper around the shared `SubBrandStats` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandStats } from "@/components/shared/SubBrandStats";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

export function LuxuryStats() {
    return (
        <SubBrandStats
            brand="luxury"
            eyebrow="Criterios residenciales"
            title="Menos recorrido. Mejor decisión."
            description="Cada opción se lee por privacidad, zona, arquitectura y potencial patrimonial antes de recomendar una visita."
            accent="gold"
            stats={SUB_BRAND_CONFIGS.luxury.stats}
        />
    );
}
