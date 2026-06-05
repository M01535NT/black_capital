/**
 * IndustrialStats — animated counter grid for the Black Industrial landing.
 *
 * Thin wrapper around the shared `SubBrandStats` component
 * (see `src/components/shared/SubBrandStats.tsx`). The original 131-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 *
 * The "steel" accent triggers the industrial grid background, the
 * top accent bar per stat, and the steel-tinted dividers.
 */

import { SubBrandStats, type StatItem } from "@/components/shared/SubBrandStats";

const stats: StatItem[] = [
    { value: 250, label: "Mil m² Portafolio", suffix: "K+", prefix: "" },
    { value: 45, label: "Naves Activas", suffix: "+", prefix: "" },
    { value: 8, label: "Estados", suffix: "", prefix: "" },
    { value: 12, label: "Años Track Record", suffix: "+", prefix: "" },
];

export function IndustrialStats() {
    return <SubBrandStats brand="industrial" accent="steel" stats={stats} />;
}
