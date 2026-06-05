/**
 * IndustrialCTA — gated-access lead-capture panel for the Black Industrial landing.
 *
 * Thin wrapper around the shared `SubBrandCTA` component
 * (see `src/components/shared/SubBrandCTA.tsx`). The original 273-line
 * implementation was merged into the shared component as part of the
 * June 2026 frontend pass; this re-export preserves the existing import
 * path for any external consumers.
 *
 * Industrial differences:
 *   - panel = "industrial" (steel-tinted, squared corners, gold corner accents)
 *   - companyRequired = true (industrial leads must be corporate)
 *   - sectionId is omitted (SubBrandHero doesn't link to it)
 *   - tags = ["Cap Rates", "Benchmarks", "Proyecciones"] (unique to industrial)
 *   - notesFormat = "always" (company is always appended to notes)
 *   - py = "py-24" (tighter than luxury/business)
 */

import { SubBrandCTA, type SubBrandCTAConfig } from "@/components/shared/SubBrandCTA";

const config: SubBrandCTAConfig = {
    brand: "industrial",
    panel: "industrial",
    source: "landing_industrial",
    notesPrefix: "Industrial Landing",
    notesFormat: "always",
    py: "py-24",

    eyebrowIcon: "download",
    eyebrow: "Portafolio Industrial",
    title: "Recibe Nuestro Portafolio",
    titleHighlight: "Industrial Actualizado",
    description:
        "Análisis financiero con cap rates, ocupación histórica, benchmarks de mercado y proyecciones de rendimiento para cada activo industrial disponible.",
    tags: ["Cap Rates", "Benchmarks", "Proyecciones"],

    companyLabel: "Empresa",
    companyPlaceholder: "Empresa *",
    companyRequired: true,
    emailPlaceholder: "Correo Corporativo",
    submitLabel: "Solicitar Portafolio Industrial",

    successTitle: "Solicitud Registrada",
    successMessage:
        "Nuestro equipo de inversiones industriales se pondrá en contacto contigo en las próximas 24 horas con el portafolio actualizado y análisis financiero correspondiente.",
};

export function IndustrialCTA() {
    return <SubBrandCTA config={config} />;
}
