import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";
import { NextStepCTA } from "@/components/shared/NextStepCTA";

export const metadata: Metadata = {
    title: "Nuestra Historia | Black Capital",
    description:
        "La historia de Black Capital en el mercado inmobiliario de Tijuana: residencial, comercial e industrial.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros/historia",
    },
};

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

export default function HistoriaPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <span className="property-tag-type text-[var(--color-accent)]/80 mb-4 inline-block">
                            Nuestra Trayectoria
                        </span>
                        <h1 className="text-display-1 uppercase text-foreground mb-4 text-balance">
                            Una inmobiliaria hecha en{" "}
                            <span className="metallic-gold-static">Tijuana</span>
                        </h1>
                        <p className="text-body text-foreground/58 max-w-2xl mx-auto">
                            Crecimiento local, especialización y seguimiento directo.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <FadeIn>
                    <div className="relative">
                        {/* Línea vertical dorada */}
                        <div
                            className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-accent)]/40 via-[var(--color-accent)]/20 to-transparent md:block"
                            aria-hidden="true"
                        />

                        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:block md:space-y-16 md:overflow-visible md:px-0 md:pb-0">
                            {hitos.map((h, i) => (
                                <div
                                    key={h.anio}
                                    className={`relative flex min-w-[72vw] snap-center flex-col border border-white/[0.06] bg-white/[0.01] p-5 md:min-w-0 md:border-0 md:bg-transparent md:p-0 md:flex-row gap-6 md:gap-12 ${
                                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Nodo dorado */}
                                    <div className="absolute left-5 top-5 -translate-x-1/2 md:left-1/2 md:top-6">
                                        <div className="w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-accent)]/30" />
                                    </div>

                                    {/* Año */}
                                    <div className="pt-1 pl-8 md:w-1/2 md:pl-0 md:text-right">
                                        <span className="text-[var(--color-accent)] text-2xl tabular-nums">
                                            {h.anio}
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="pl-8 md:w-1/2 md:pl-0">
                                <h3 className="text-display-3 font-semibold text-foreground mb-2">
                                    {h.titulo}
                                </h3>
                                <p className="text-body text-foreground/50">
                                    {h.descripcion}
                                </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>

            <NextStepCTA description="Ocho años en Tijuana. Cuéntanos qué quieres comprar, vender o rentar." />
        </div>
    );
}

