/**
 * BusinessCTA — gated-access lead-capture panel for the Black Business landing.
 *
 * Thin wrapper around the shared `SubBrandCTA` component
 * (see `src/components/shared/SubBrandCTA.tsx`). The original 262-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 */

import { SubBrandCTA, type SubBrandCTAConfig } from "@/components/shared/SubBrandCTA";

const config: SubBrandCTAConfig = {
    brand: "business",
    panel: "luxury",
    source: "landing_business",
    notesPrefix: "Business Landing",
    notesFormat: "optional",
    sectionId: "business-cta",

    eyebrowIcon: "lock",
    eyebrow: "Asesoría Corporativa",
    title: "Encuentra el Espacio",
    titleHighlight: "Ideal para tu Empresa",
    description:
        "Análisis de mercado corporativo, proyecciones de rendimiento y asesoría personalizada para optimizar tu operación inmobiliaria comercial.",
    indicator: "Respuesta en menos de 24h",

    companyLabel: "Empresa",
    companyPlaceholder: "Empresa",
    companyRequired: false,
    emailPlaceholder: "Correo Electrónico",
    submitLabel: "Solicitar Asesoría Comercial",

    successTitle: "¡Solicitud Recibida!",
    successMessage:
        "Tu solicitud ha sido registrada. Nuestro equipo de asesoría corporativa se pondrá en contacto contigo en las próximas 24 horas con opciones personalizadas.",
};

export function BusinessCTA() {
    return <SubBrandCTA config={config} />;
}
