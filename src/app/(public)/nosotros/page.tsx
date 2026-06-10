import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Shield, Users, TrendingUp, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Nosotros | Black Capital",
    description:
        "Black Capital es una inmobiliaria en Tijuana enfocada en operaciones residenciales, comerciales e industriales.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros",
    },
};

const pillars = [
    {
        icon: Shield,
        title: "Revisión",
        description: "Documentos, precio, estado y condiciones antes de avanzar.",
    },
    {
        icon: Users,
        title: "Trato directo",
        description: "Comunicación clara con propietarios, compradores e inversionistas.",
    },
    {
        icon: TrendingUp,
        title: "Comparables",
        description: "Precio, zona y referencias de mercado para decidir mejor.",
    },
    {
        icon: Award,
        title: "Especialización",
        description: "Residencial, comercial e industrial con enfoque propio.",
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
        descripcion: "Nuestra evolución en el mercado inmobiliario de Tijuana.",
    },
    {
        href: "/nosotros/valores",
        titulo: "Valores",
        descripcion: "Cómo trabajamos antes, durante y después de una operación.",
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
                                Inmobiliaria local para operaciones{" "}
                                <span className="metallic-gold-static gold-glow">bien preparadas</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed max-w-2xl mt-6 sm:mt-10">
                                Trabajamos con propietarios, compradores e inversionistas en residencial, comercial e industrial.
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
                                    Qué hay detrás de Black Capital.
                                </h2>
                    </div>
                </div>

                <ul className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto border-t border-white/[0.06] px-6 pb-2 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:gap-0 md:overflow-visible md:px-0 md:pb-0" role="list">
                    {subpaginas.map((s, i) => (
                        <li
                            key={s.href}
                            className={
                                "min-w-[76vw] snap-center border border-white/[0.06] md:min-w-0 md:border-b-0 md:border-l-0 md:border-t-0 " +
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

            {/* Pilares — 2×2 con líneas divisorias para lectura rápida. */}
            <Section id="pilares" label="Pilares" spacing="default" containerWidth="wide">
                <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
                                <div className="max-w-2xl">
                        <Eyebrow label="Pilares" />
                        <h2 className="text-display-2 text-white leading-display tracking-headline">
                            Cómo trabajamos.{" "}
                            <span className="text-white/45">Sin adornos.</span>
                        </h2>
                    </div>
                    <p className="text-body-fluid-sm text-white/55 leading-relaxed max-w-md sm:text-right hidden sm:block">
                        Revisamos el inmueble, ordenamos la información y acompañamos el cierre.
                    </p>
                </div>

                <div className="relative grid grid-cols-2 gap-0 border-t border-white/[0.06]" role="list">
                    {/* Horizontal hairline entre filas (mobile-first) */}
                    <div
                        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                    {/* Vertical hairline entre columnas (desktop) */}
                    <div
                        className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />

                    {pillars.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.title}
                                role="listitem"
                                className={
                                    "relative flex min-h-[250px] flex-col items-start p-5 sm:min-h-[270px] sm:p-8 lg:p-14 " +
                                    (i < 2 ? "border-b md:border-b border-white/[0.06]" : "")
                                }
                            >
                                <span className="property-tag-type text-white/40 mb-5">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-accent)]/40 sm:h-14 sm:w-14" aria-hidden="true">
                                    <Icon className="h-5 w-5 text-[var(--color-accent)] sm:h-6 sm:w-6" strokeWidth={1.5} />
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

