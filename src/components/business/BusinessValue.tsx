/**
 * BusinessValue — value proposition grid for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandValue` component. The original
 * 82-line implementation was merged into the shared component as part
 * of the June 2026 frontend pass; this re-export preserves the existing
 * import path for any external consumers and supplies the brand-specific
 * content.
 */

"use client";

import { Briefcase, Building, TrendingUp } from "lucide-react";
import { SubBrandValue } from "@/components/shared/SubBrandValue";

const items = [
    {
        icon: Briefcase,
        title: "Oficinas Corporativas",
        description:
            "Espacios de trabajo en torres emblemáticas con acabados premium, estacionamiento ejecutivo y salas de juntas equipadas. Ubicaciones estratégicas en los corredores de negocio más importantes.",
    },
    {
        icon: Building,
        title: "Locales y Plazas Comerciales",
        description:
            "Locales comerciales de alta visibilidad en plazas con flujo peatonal comprobado. Ideales para retail premium, restaurantes, showrooms y flagship stores de marcas líderes.",
    },
    {
        icon: TrendingUp,
        title: "Inversión en Renta Comercial",
        description:
            "Portafolio de activos comerciales con inquilinos triple-net, contratos a largo plazo y rendimientos superiores a la renta fija. Análisis Cap Rate y flujo operativo incluido.",
    },
];

export function BusinessValue() {
    return (
        <SubBrandValue
            brand="business"
            accent="gold"
            eyebrow="Oportunidades Comerciales"
            title={
                <>
                    Activos que Generan <span className="metallic-gold">Valor</span>
                </>
            }
            description="Cada propiedad comercial en nuestro portafolio ha sido analizada bajo criterios de ubicación, flujo operativo, cap rate y proyección de plusvalía."
            items={items}
        />
    );
}
