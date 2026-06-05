/**
 * BusinessStats — animated counter grid for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandStats` component
 * (see `src/components/shared/SubBrandStats.tsx`). The original 120-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 */

import { SubBrandStats, type StatItem } from "@/components/shared/SubBrandStats";

const stats: StatItem[] = [
    { value: 420, label: "Millones USD Comerciales", suffix: "+", prefix: "$" },
    { value: 80, label: "Activos Clase A", suffix: "+", prefix: "" },
    { value: 95, label: "% Ocupación Promedio", suffix: "%", prefix: "" },
    { value: 12, label: "Años en Mercado", suffix: "+", prefix: "" },
];

export function BusinessStats() {
    return <SubBrandStats brand="business" accent="gold" stats={stats} />;
}
