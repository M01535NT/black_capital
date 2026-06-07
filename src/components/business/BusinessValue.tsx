/**
 * BusinessValue — value proposition grid for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandValue` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandValue } from "@/components/shared/SubBrandValue";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

const config = SUB_BRAND_CONFIGS.business.value;

export function BusinessValue() {
    return (
        <SubBrandValue
            brand="business"
            accent="gold"
            eyebrow={config.eyebrow}
            title={config.title}
            description={config.description}
            items={config.items}
        />
    );
}
