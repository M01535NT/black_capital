import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Calculator, FileSpreadsheet, BarChart3, Download, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Herramientas para Inversionistas | Black Capital",
    description:
        "Herramientas financieras y recursos exclusivos para inversionistas inmobiliarios: calculadoras, reportes de mercado y análisis comparativos.",
};

const tools = [
    {
        icon: Calculator,
        title: "Calculadora de Cap Rate",
        description:
            "Calcula la tasa de capitalización de cualquier activo comercial o industrial ingresando ingreso operativo neto y precio de adquisición.",
        status: "Próximamente" as const,
        href: null,
    },
    {
        icon: FileSpreadsheet,
        title: "Plantilla de Due Diligence",
        description:
            "Checklist completo de verificación legal, financiera y técnica para adquisiciones inmobiliarias. Descargable en Excel.",
        status: "Próximamente" as const,
        href: null,
    },
    {
        icon: BarChart3,
        title: "Reportes de Mercado",
        description:
            "Análisis trimestrales del mercado inmobiliario mexicano por segmento: residencial premium, comercial e industrial.",
        status: "Próximamente" as const,
        href: null,
    },
    {
        icon: Download,
        title: "Brochures Financieros",
        description:
            "Accede a los brochures ejecutivos de cualquier propiedad en nuestro catálogo con datos financieros verificados.",
        status: "Disponible" as const,
        href: "/inventario",
    },
];

export default function HerramientasPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Hero — mismo lenguaje que Home */}
            <section
                aria-label="Herramientas"
                className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 bg-background border-b border-white/[0.04] overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <Eyebrow label="Recursos exclusivos" />
                            <h1 className="text-display-1 font-light text-white leading-hero tracking-tight text-balance">
                                Herramientas para{" "}
                                <span className="metallic-gold-static gold-glow">inversionistas</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed font-light max-w-2xl mt-6 sm:mt-10">
                                Recursos financieros y analíticos diseñados para inversores profesionales que buscan
                                tomar decisiones informadas en el mercado inmobiliario mexicano.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools — 2×2 con vlines y hairline */}
            <Section id="herramientas" label="Recursos" spacing="default" containerWidth="wide">
                <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
                    <div className="max-w-2xl">
                        <Eyebrow label="Recursos" />
                        <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                            Cuatro piezas.{" "}
                            <span className="text-white/45">Una caja de herramientas.</span>
                        </h2>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/[0.06]" role="list">
                    {/* Horizontal hairline (mobile) */}
                    <div
                        className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                    {/* Vertical hairline (desktop) */}
                    <div
                        className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />

                    {tools.map((tool, i) => {
                        const Icon = tool.icon;
                        const isTop = i < 2;
                        const isAvailable = tool.status === "Disponible";
                        return (
                            <div
                                key={tool.title}
                                role="listitem"
                                className={
                                    "relative p-8 sm:p-10 lg:p-14 flex flex-col items-start " +
                                    (isTop ? "border-b md:border-b border-white/[0.06]" : "")
                                }
                            >
                                <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-6">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="flex items-center justify-between w-full mb-8">
                                    <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center" aria-hidden="true">
                                        <Icon className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={1.5} />
                                    </div>
                                    <span
                                        className={
                                            "text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-full " +
                                            (isAvailable
                                                ? "border border-emerald-400/30 text-emerald-300/90 bg-emerald-500/[0.06]"
                                                : "border border-white/15 text-white/55 bg-white/[0.02]")
                                        }
                                    >
                                        {tool.status}
                                    </span>
                                </div>
                                <h3 className="text-display-4 font-semibold text-white tracking-snug mb-3">
                                    {tool.title}
                                </h3>
                                <p className="text-body-sm text-white/60 leading-relaxed font-light flex-1 mb-6 max-w-xs">
                                    {tool.description}
                                </p>
                                {tool.href && (
                                    <Link
                                        href={tool.href}
                                        className="btn-ghost-gold inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-accent)]/30 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full hover:border-[var(--color-accent)] transition-colors duration-300"
                                    >
                                        <span>Acceder</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Section>

            <Section id="solicitar-analisis" label="Solicitar análisis" spacing="tight" containerWidth="wide">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/[0.06] py-12 sm:py-16">
                    <div className="lg:col-span-7">
                        <Eyebrow label="Placeholder editable" />
                        <h2 className="text-display-3 font-light text-white leading-display tracking-headline text-balance">
                            Cuando el panel esté listo, estos recursos se podrán publicar por etapa.
                        </h2>
                    </div>
                    <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end gap-5">
                        <p className="text-body-sm text-white/58 leading-relaxed max-w-md lg:text-right">
                            Por ahora, el flujo útil es consultar inventario o solicitar un análisis personalizado con el equipo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Link
                                href="/inventario"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)]/35 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-[var(--color-accent)]"
                            >
                                Inventario
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/contacto?interes=analisis"
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-500 px-5 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gold-400"
                            >
                                Solicitar análisis
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
