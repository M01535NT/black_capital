/**
 * LuxuryCTA — gated-access lead-capture panel for the Black Luxury landing.
 *
 * Thin wrapper around the shared `SubBrandCTA` component
 * (see `src/components/shared/SubBrandCTA.tsx`). The original 262-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 */

import { SubBrandCTA, type SubBrandCTAConfig } from "@/components/shared/SubBrandCTA";

const config: SubBrandCTAConfig = {
    brand: "luxury",
    panel: "luxury",
    source: "landing_luxury",
    notesPrefix: "Luxury Landing",
    notesFormat: "optional",
    sectionId: "luxury-cta",

    eyebrowIcon: "lock",
    eyebrow: "Acceso Privado",
    title: "Accede al Directorio",
    titleHighlight: "de Propiedades Exclusivas",
    description:
        "Portafolio reservado con propiedades Off-Market, análisis financiero personalizado, y acompañamiento fiduciario para inversiones de alto patrimonio.",
    indicator: "Respuesta en menos de 24h",

    companyLabel: "Empresa o Fondo",
    companyPlaceholder: "Empresa o Fondo",
    companyRequired: false,
    emailPlaceholder: "Correo Electrónico",
    submitLabel: "Solicitar Acceso Exclusivo",

    successTitle: "¡Bienvenido al Directorio Exclusivo!",
    successMessage:
        "Tu solicitud ha sido registrada. Nuestro equipo de relaciones con inversores se pondrá en contacto contigo en las próximas 24 horas para brindarte acceso personalizado.",
};

export function LuxuryCTA() {
    return <SubBrandCTA config={config} />;
}
