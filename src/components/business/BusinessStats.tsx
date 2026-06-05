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
    { value: 420, label: "Millones USD en Transacciones", suffix: "+", prefix: "$" },
    { value: 85, label: "Oficinas Corporativas", suffix: "+", prefix: "" },
    { value: 18, label: "Plazas Comerciales", suffix: "+", prefix: "" },
    { value: 95, label: "Tasa de Ocupación", suffix: "%", prefix: "" },
];

export function BusinessStats() {
    return <SubBrandStats brand="business" accent="gold" stats={stats} />;
}
