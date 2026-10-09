import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Shield, Users, TrendingUp, Award, Eye, Handshake, Target, Scale, Zap } from "lucide-react";
import { NextStepCTA } from "@/components/shared/NextStepCTA";

export const metadata: Metadata = {
    title: "Nosotros",
    description:
        "Black Capital es una inmobiliaria en Tijuana para compra, venta y renta residencial, comercial e industrial.",
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

const miembros = [
    {
        nombre: "Moisés Núñez",
        cargo: "Director General",
        descripcion: "Define precio, estrategia y seguimiento con propietarios e inversionistas.",
    },
    {
        nombre: "Omar Medina Yañez",
        cargo: "Asesor Senior",
        descripcion: "Especialista en residencial y fraccionamientos privados.",
    },
];

const hitos = [
    {
        anio: "2018",
        titulo: "Inicio",
        descripcion: "Nacemos en Tijuana con enfoque residencial.",
    },
    {
        anio: "2020",
        titulo: "Comercial",
        descripcion: "Integramos locales y oficinas en zonas de flujo.",
    },
    {
        anio: "2022",
        titulo: "Industrial",
        descripcion: "Sumamos naves y bodegas en corredores logísticos.",
    },
    {
        anio: "2024",
        titulo: "Método",
        descripcion: "Mejoramos la revisión de precio, documentos y seguimiento.",
    },
    {
        anio: "2026",
        titulo: "Hoy",
        descripcion: "Residencial, comercial e industrial con atención directa.",
    },
];

const valores = [
    {
        icon: Eye,
        titulo: "Transparencia",
        descripcion: "Análisis claro, sin letra chica.",
    },
    {
        icon: Handshake,
        titulo: "Trato directo",
        descripcion: "Una línea de comunicación.",
    },
    {
        icon: Target,
        titulo: "Seguimiento",
        descripcion: "Acompañamiento hasta firma o decisión final.",
    },
    {
        icon: Shield,
        titulo: "Patrimonio",
        descripcion: "Cuidamos información, precio y condiciones.",
    },
    {
        icon: Scale,
        titulo: "Revisión",
        descripcion: "Verificación legal, fiscal y técnica cuando aplica.",
    },
    {
        icon: Zap,
        titulo: "Precisión",
        descripcion: "Rapidez sin perder análisis.",
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
                                Inmobiliaria local para decidir{" "}
                                <span className="metallic-gold-static gold-glow">con más claridad</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed max-w-2xl mt-6 sm:mt-10">
                                Trabajamos con propietarios, compradores e inversionistas en Tijuana: residencial, comercial e industrial.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <nav aria-label="Secciones de nosotros" className="mx-auto flex max-w-[90rem] flex-wrap gap-3 px-6 py-6 sm:px-10 lg:px-16">
                {[
                    ["#equipo", "Equipo"],
                    ["#valores", "Cómo trabajamos"],
                    ["#historia", "Trayectoria"],
                    ["#contacto", "Contacto"],
                ].map(([href, title]) => (
                    <Link key={href} href={href} className="border border-white/[0.08] px-4 py-3 property-tag-type text-white/55 transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]">{title}</Link>
                ))}
            </nav>

            <Section id="equipo" label="Equipo" spacing="tight" containerWidth="wide" className="scroll-mt-24">
                <Eyebrow label="Nuestro equipo" />
                <h2 className="text-display-2 text-white leading-display tracking-headline">Las personas detrás de Black Capital.</h2>
                <p className="mt-4 text-body text-foreground/58 max-w-2xl">Equipo local, información clara y seguimiento directo.</p>
                <div className="mt-8 grid grid-cols-1 gap-0 border-t border-white/[0.06] md:grid-cols-2">
                    {miembros.map((m) => (
                        <article key={m.nombre} className="border-b border-white/[0.06] bg-white/[0.01] p-5 sm:p-8 md:first:border-r">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 sm:h-16 sm:w-16" aria-hidden="true">
                                <span className="text-lg font-bold text-[var(--color-accent)] sm:text-xl">{m.nombre.split(" ").map((n) => n[0]).join("")}</span>
                            </div>
                            <h3 className="text-display-3 font-semibold text-foreground mb-1">{m.nombre}</h3>
                            <p className="text-foreground/50 text-body-sm mb-4">{m.cargo}</p>
                            <p className="text-foreground/50 text-body">{m.descripcion}</p>
                        </article>
                    ))}
                </div>
            </Section>

            {/* Pilares — 2×2 con líneas divisorias para lectura rápida. */}
            <Section id="valores" label="Cómo trabajamos" spacing="tight" containerWidth="wide" className="scroll-mt-24">
                <div className="flex items-end justify-between gap-8 mb-8 sm:mb-10">
                                <div className="max-w-2xl">
                        <Eyebrow label="Pilares" />
                        <h2 className="text-display-2 text-white leading-display tracking-headline">
                            Cómo trabajamos.{" "}
                            <span className="text-white/45">Sin adornos.</span>
                        </h2>
                    </div>
                    <p className="text-body-fluid-sm text-white/55 leading-relaxed max-w-md sm:text-right hidden sm:block">
                        Revisamos la propiedad, ordenamos la información y damos seguimiento directo.
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
                                    "relative flex min-h-[250px] flex-col items-start p-5 sm:min-h-[270px] sm:p-8 " +
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
                <div className="mt-8 grid grid-cols-1 gap-0 border-t border-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
                    {valores.map((v) => {
                        const Icon = v.icon;
                        return (
                            <article key={v.titulo} className="border-b border-r border-white/[0.06] bg-white/[0.01] p-5 sm:p-8">
                                <Icon className="mb-5 h-4 w-4 text-[var(--color-accent)] sm:h-5 sm:w-5" aria-hidden="true" />
                                <h3 className="text-display-3 font-semibold text-foreground mb-3">{v.titulo}</h3>
                                <p className="text-foreground/50 text-body leading-relaxed">{v.descripcion}</p>
                            </article>
                        );
                    })}
                </div>
            </Section>
            <Section id="historia" label="Nuestra trayectoria" spacing="tight" containerWidth="wide" className="scroll-mt-24">
                <Eyebrow label="Nuestra trayectoria" />
                <h2 className="text-display-2 text-white leading-display tracking-headline">Una inmobiliaria hecha en Tijuana.</h2>
                <p className="mt-4 text-body text-foreground/58 max-w-2xl">Crecimiento local, especialización y seguimiento directo.</p>
                <ol className="mt-8 grid grid-cols-1 border-t border-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
                    {hitos.map((h) => (
                        <li key={h.anio} className="border-b border-r border-white/[0.06] p-5 sm:p-6">
                            <span className="text-[var(--color-accent)] text-2xl tabular-nums">{h.anio}</span>
                            <h3 className="mt-4 text-display-3 font-semibold text-foreground mb-2">{h.titulo}</h3>
                            <p className="text-body text-foreground/50">{h.descripcion}</p>
                        </li>
                    ))}
                </ol>
            </Section>
            <div id="contacto" className="scroll-mt-24">
                <NextStepCTA description="Habla directo con el equipo: sin intermediarios y con respuesta clara." />
            </div>
        </div>
    );
}

