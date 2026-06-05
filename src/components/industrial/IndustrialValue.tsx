/**
 * IndustrialValue — value proposition grid for the Black Industrial landing.
 *
 * Thin wrapper around the shared `SubBrandValue` component. The original
 * 81-line implementation was merged into the shared component as part
 * of the June 2026 frontend pass; this re-export preserves the existing
 * import path for any external consumers and supplies the brand-specific
 * content.
 *
 * Industrial differences:
 *   - accent = "steel" (steel-tinted, squared corners, corner accents)
 *   - Eyebrow uses tracking-hero + steel-400 (not the gold shimmer)
 *   - py-24 (tighter than luxury/business)
 */

"use client";

import { Factory, Warehouse, Truck } from "lucide-react";
import { SubBrandValue } from "@/components/shared/SubBrandValue";

const items = [
    {
        icon: Factory,
        title: "Terrenos Macro",
        description:
            "Predios de +5 hectáreas estratégicamente ubicados en zonas de alta demanda industrial con acceso a vías primarias y servicios de infraestructura.",
    },
    {
        icon: Warehouse,
        title: "Naves Industriales",
        description:
            "Desde naves industriales clase A con alturas de +12m hasta soluciones Build-to-Suit (BTS) diseñadas para operaciones específicas.",
    },
    {
        icon: Truck,
        title: "Parques Logísticos",
        description:
            "Parques con conectividad estratégica a los principales corredores logísticos de México: T-MEC, Bajío, Pacífico y frontera norte.",
    },
];

export function IndustrialValue() {
    return (
        <SubBrandValue
            brand="industrial"
            accent="steel"
            eyebrow="Verticales de activo"
            title={
                <>
                    Activos Industriales de
                    <span className="metallic-gold"> Alto Calibre</span>
                </>
            }
            description="Tres clases de activo industrial, una sola plataforma con análisis financiero estructurado para cada oportunidad."
            items={items}
        />
    );
}
