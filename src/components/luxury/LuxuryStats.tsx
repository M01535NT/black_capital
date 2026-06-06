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
            accent="gold"
            stats={SUB_BRAND_CONFIGS.luxury.stats}
        />
    );
}
