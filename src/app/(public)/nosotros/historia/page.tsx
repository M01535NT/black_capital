import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Nuestra Historia | Black Capital",
    description:
        "La historia de Black Capital: de operar en el mercado inmobiliario de Tijuana a construir una plataforma premium de inversión con presencia en Baja California.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros/historia",
    },
};

const hitos = [
    {
        anio: "2018",
        titulo: "El Inicio",
        descripcion:
            "Black Capital nace en Tijuana con la visión de profesionalizar la intermediación inmobiliaria en Baja California. Las primeras operaciones fueron residenciales, conectando a familias con su hogar ideal en fraccionamientos privados de la ciudad.",
    },
    {
        anio: "2020",
        titulo: "Expansión Comercial",
        descripcion:
            "Incorporamos la división Black Business, enfocada en locales comerciales y oficinas en zonas de alto tráfico. Cerramos nuestras primeras operaciones de renta comercial con cap rates superiores al promedio del mercado local.",
    },
    {
        anio: "2022",
        titulo: "Vertical Industrial",
        descripcion:
            "Lanzamos Black Industrial para atender la creciente demanda de naves y bodegas en los corredores logísticos de Tijuana. La proximidad a la frontera y el crecimiento del T-MEC impulsaron esta división.",
    },
    {
        anio: "2024",
        titulo: "Plataforma Digital",
        descripcion:
            "Transformamos la operación con análisis financiero estructurado para cada activo: cap rates, TIR proyectada, flujos y escenarios de salida. Dejamos de ser una inmobiliaria tradicional para convertirnos en una plataforma de inversión con datos.",
    },
    {
        anio: "2026",
        titulo: "Hoy",
        descripcion:
            "Operamos tres verticales — residencial, comercial e industrial — con un equipo de asesores que conoce Tijuana como la palma de su mano. Mismo compromiso de siempre: transparencia, análisis y resultados.",
    },
];

export default function HistoriaPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <span className="property-tag-type text-gold-500/80 mb-4 inline-block">
                            Nuestra Trayectoria
                        </span>
                        <h1 className="text-display-1 uppercase text-foreground mb-4 text-balance">
                            De Tijuana para{" "}
                            <span className="metallic-gold-static">Inversionistas</span>
                        </h1>
                        <p className="text-body text-foreground/58 max-w-2xl mx-auto">
                            Una historia de crecimiento constante, construida sobre la confianza
                            de nuestros clientes y el conocimiento profundo del mercado inmobiliario
                            de Baja California.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <FadeIn>
                    <div className="relative">
                        {/* Línea vertical dorada */}
                        <div
                            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/40 via-gold-500/20 to-transparent -translate-x-1/2"
                            aria-hidden="true"
                        />

                        <div className="space-y-16">
                            {hitos.map((h, i) => (
                                <div
                                    key={h.anio}
                                    className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Nodo dorado */}
                                    <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2">
                                        <div className="w-3 h-3 rounded-full bg-gold-500 border-2 border-gold-500/30" />
                                    </div>

                                    {/* Año */}
                                    <div className="md:w-1/2 pt-1 pl-10 md:pl-0 md:text-right">
                                        <span className="text-gold-500 text-2xl tabular-nums">
                                            {h.anio}
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="md:w-1/2 pl-10 md:pl-0">
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
        </div>
    );
}

