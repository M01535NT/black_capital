/**
 * BusinessStats — animated counter grid for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandStats` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandStats } from "@/components/shared/SubBrandStats";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

export function BusinessStats() {
    return (
        <SubBrandStats
            brand="business"
            eyebrow="Lectura comercial"
            title="Corredores que se comparan por operación."
            description="Cada zona se evalúa por flujo, visibilidad, acceso y capacidad de sostener renta o venta."
            accent="gold"
            stats={SUB_BRAND_CONFIGS.business.stats}
        />
    );
}
