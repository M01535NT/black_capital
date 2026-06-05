/**
 * LuxuryValue — value proposition grid for the Black Luxury landing.
 *
 * Thin wrapper around the shared `SubBrandValue` component. The original
 * 82-line implementation was merged into the shared component as part
 * of the June 2026 frontend pass; this re-export preserves the existing
 * import path for any external consumers and supplies the brand-specific
 * content.
 */

"use client";

import { Crown, Building2, Gem } from "lucide-react";
import { SubBrandValue } from "@/components/shared/SubBrandValue";

const items = [
    {
        icon: Crown,
        title: "Residencias Trofeo",
        description:
            "Propiedades icónicas en las zonas de mayor plusvalía. Casas de autor, mansiones y fincas con diseño arquitectónico de firma y amenidades excepcionales.",
    },
    {
        icon: Building2,
        title: "Penthouses de Autor",
        description:
            "Los pisos más altos con las mejores vistas. Penthouses en torres emblemáticas con acabados de altísima gama y sistemas domóticos de última generación.",
    },
    {
        icon: Gem,
        title: "Desarrollos Exclusivos",
        description:
            "Acceso anticipado a proyectos residenciales Pre-Venta y Off-Market. Oportunidades de inversión con rendimientos superiores al promedio del mercado.",
    },
];

export function LuxuryValue() {
    return (
        <SubBrandValue
            brand="luxury"
            accent="gold"
            eyebrow="Exclusividad Certificada"
            title={
                <>
                    El Arte de Invertir en{" "}
                    <span className="metallic-gold">lo Extraordinario</span>
                </>
            }
            description="Cada propiedad en nuestro portafolio de lujo ha sido curada personalmente bajo criterios de ubicación, diseño, plusvalía y nivel de exclusividad."
            items={items}
        />
    );
}
