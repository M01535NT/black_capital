/**
 * BusinessCTA — lead-capture panel for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandCTA` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandCTA } from "@/components/shared/SubBrandCTA";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

export function BusinessCTA() {
    return <SubBrandCTA config={SUB_BRAND_CONFIGS.business.cta} />;
}
