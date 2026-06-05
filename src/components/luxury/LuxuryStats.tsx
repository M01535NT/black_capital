/**
 * LuxuryStats — animated counter grid for the Black Luxury landing.
 *
 * This file is a thin wrapper around the shared `SubBrandStats` component
 * (see `src/components/shared/SubBrandStats.tsx`). The original 120-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 */

import { SubBrandStats, type StatItem } from "@/components/shared/SubBrandStats";

const stats: StatItem[] = [
    { value: 850, label: "Millones USD en Portafolio", suffix: "+", prefix: "$" },
    { value: 120, label: "Propiedades Curadas", suffix: "+", prefix: "" },
    { value: 35, label: "Desarrollos Exclusivos", suffix: "+", prefix: "" },
    { value: 6, label: "Ciudades Premium", suffix: "", prefix: "" },
];

export function LuxuryStats() {
    return <SubBrandStats brand="luxury" accent="gold" stats={stats} />;
}
