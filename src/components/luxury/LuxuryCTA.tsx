/**
 * LuxuryCTA — lead-capture panel for the Black Luxury landing.
 *
 * Thin wrapper around the shared `SubBrandCTA` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandCTA } from "@/components/shared/SubBrandCTA";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

export function LuxuryCTA() {
    return <SubBrandCTA config={SUB_BRAND_CONFIGS.luxury.cta} />;
}
