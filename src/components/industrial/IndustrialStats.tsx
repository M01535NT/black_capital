/**
 * IndustrialStats — animated counter grid for the Black Industrial landing.
 *
 * Thin wrapper around the shared `SubBrandStats` component.
 * Content is drawn from SUB_BRAND_CONFIGS (single source of truth).
 */

import { SubBrandStats } from "@/components/shared/SubBrandStats";
import { SUB_BRAND_CONFIGS } from "@/lib/sub-brand-config";

export function IndustrialStats() {
    return (
        <SubBrandStats
            brand="industrial"
            eyebrow="Criterios operativos"
            title="La escala se mide antes de agendar visita."
            description="Superficie, maniobra, conectividad y uso permitido se ordenan para decidir con precisión logística."
            accent="steel"
            stats={SUB_BRAND_CONFIGS.industrial.stats}
        />
    );
}
