import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Shield, Users, TrendingUp, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Nosotros | Black Capital",
    description:
        "Inmobiliaria premium en Tijuana especializada en casas residenciales, centros comerciales y naves industriales. Transparencia, análisis y resultados en cada operación.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros",
    },
};

const pillars = [
    {
        icon: Shield,
        title: "Due Diligence",
        description:
            "Cada propiedad pasa por un proceso de verificación legal, financiera y técnica antes de ser publicada en nuestra plataforma.",
    },
    {
        icon: Users,
        title: "Relaciones de Confianza",
        description:
            "Construimos relaciones a largo plazo con compradores, vendedores e inversionistas basadas en transparencia y resultados.",
    },
    {
        icon: TrendingUp,
        title: "Análisis Financiero",
        description:
            "Brochures ejecutivos con Cap Rate, TIR, flujos proyectados y comparativos de mercado para una toma de decisiones informada.",
    },
    {
        icon: Award,
        title: "Especialización por Vertical",
        description:
            "Tres marcas especializadas — Luxury, Business e Industrial — con equipos dedicados que entienden cada segmento a profundidad.",
    },
];

const subpaginas = [
    {
        href: "/nosotros/equipo",
        titulo: "Equipo",
        descripcion: "Conoce a las personas detrás de Black Capital.",
    },
    {
        href: "/nosotros/historia",
        titulo: "Historia",
        descripcion: "De Tijuana para inversionistas: nuestra trayectoria.",
    },
    {
        href: "/nosotros/valores",
        titulo: "Valores",
        descripcion: "Los principios que guían cada operación.",
    },
];

export default function NosotrosPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Hero — mismo lenguaje que Home */}
            <section
                aria-label="Nosotros"
                className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 bg-background border-b border-white/[0.04] overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <Eyebrow label="Acerca de nosotros" />
                            <h1 className="text-display-1 text-white leading-hero tracking-tight text-balance">
                                Plataforma inmobiliaria con{" "}
                                <span className="metallic-gold-static gold-glow">criterio</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed max-w-2xl mt-6 sm:mt-10">
                                Black Capital es una plataforma inmobiliaria premium enfocada en Tijuana, Baja
                                California. Conectamos a compradores, vendedores e inversionistas con los mejores
                                activos residenciales, comerciales e industriales de la región.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subpáginas — links con hairlines (sin glass cards) */}
            <Section id="subpaginas" label="Secciones" spacing="default" containerWidth="wide">
                        <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
                            <div className="max-w-2xl">
                                <Eyebrow label="Profundiza" />
                                <h2 className="text-display-2 text-white leading-display tracking-headline">
                                    Conoce más sobre nosotros.
                                </h2>
                    </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-3 border-t border-white/[0.06]" role="list">
                    {subpaginas.map((s, i) => (
                        <li
                            key={s.href}
                            className={
                                "border-b md:border-b-0 border-white/[0.06] " +
                                (i < subpaginas.length - 1 ? "md:border-r md:border-white/[0.06] " : "")
                            }
                        >
                            <Link
                                href={s.href}
                                className="group block p-8 sm:p-10 lg:p-12 transition-colors duration-500 hover:bg-white/[0.015]"
                            >
                                <span className="property-tag-type text-[var(--color-accent)]">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="text-display-3 font-semibold text-white mt-4 mb-3 group-hover:text-[var(--color-accent-light)] transition-colors duration-300">
                                    {s.titulo}
                                </h3>
                                <p className="text-body-sm text-white/60 leading-relaxed mb-6 max-w-xs">
                                    {s.descripcion}
                                </p>
                                <span className="inline-flex items-center gap-2 footer-link-type property-tag-type text-white/55 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                    Explorar
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Pilares — 2×2 con vlines y hairline horizontal (mismo patrón que TrackRecord) */}
            <Section id="pilares" label="Pilares" spacing="default" containerWidth="wide">
                <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
                                <div className="max-w-2xl">
                        <Eyebrow label="Pilares" />
                        <h2 className="text-display-2 text-white leading-display tracking-headline">
                            Cuatro principios.{" "}
                            <span className="text-white/45">Cero excepciones.</span>
                        </h2>
                    </div>
                    <p className="text-body-fluid-sm text-white/55 leading-relaxed max-w-md sm:text-right hidden sm:block">
                        Lo que audita cada activo antes de salir al mercado, y lo que firma cada operación antes de cerrar.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/[0.06]" role="list">
                    {/* Horizontal hairline entre filas (mobile-first) */}
                    <div
                        className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                    {/* Vertical hairline entre columnas (desktop) */}
                    <div
                        className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />

                    {pillars.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.title}
                                role="listitem"
                                className={
                                    "relative p-8 sm:p-10 lg:p-14 flex flex-col items-start " +
                                    (i < 2 ? "border-b md:border-b border-white/[0.06]" : "")
                                }
                            >
                                <span className="property-tag-type text-white/40 mb-6">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center mb-8" aria-hidden="true">
                                    <Icon className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-display-3 font-semibold text-white mb-3">
                                    {pillar.title}
                                </h3>
                                <p className="text-body-sm text-white/60 leading-relaxed max-w-xs">
                                    {pillar.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}

