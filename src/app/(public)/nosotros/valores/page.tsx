import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { Shield, Eye, Handshake, Target, Scale, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Nuestros Valores | Black Capital",
    description:
        "Los valores que guían a Black Capital: transparencia, compromiso, disciplina y resultados. Conoce los principios que aplicamos en cada operación inmobiliaria en Tijuana.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros/valores",
    },
};

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
        titulo: "Resultados",
        descripcion: "Operaciones cerradas con criterio.",
    },
    {
        icon: Shield,
        titulo: "Patrimonio",
        descripcion: "Cuidamos cada decisión.",
    },
    {
        icon: Scale,
        titulo: "Due diligence",
        descripcion: "Verificación legal, fiscal y técnica.",
    },
    {
        icon: Zap,
        titulo: "Precisión",
        descripcion: "Rapidez sin perder análisis.",
    },
];

export default function ValoresPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <span className="property-tag-type text-[var(--color-accent)]/80 mb-4 inline-block">
                            Nuestros Principios
                        </span>
                        <h1 className="text-display-1 uppercase text-foreground mb-4 text-balance">
                            Lo Que <span className="metallic-gold-static">Nos Define</span>
                        </h1>
                        <p className="text-body text-foreground/58 max-w-2xl mx-auto">
                            Claridad, disciplina y cierre.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <StaggerChildren className="grid grid-cols-2 gap-0 max-w-6xl mx-auto border-t border-white/[0.06] lg:grid-cols-3">
                    {valores.map((v) => {
                        const Icon = v.icon;
                        return (
                            <StaggerItem key={v.titulo}>
                                <div className="group h-full min-h-[210px] border-b border-r border-white/[0.06] bg-white/[0.01] p-5 transition-colors duration-500 hover:bg-white/[0.025] sm:p-8">
                                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 transition-all duration-500 group-hover:border-[var(--color-accent)]/40 group-hover:bg-[var(--color-accent)]/20 sm:h-12 sm:w-12">
                                        <Icon className="h-4 w-4 text-[var(--color-accent)] sm:h-5 sm:w-5" aria-hidden="true" />
                                    </div>
                                <h3 className="text-display-3 font-semibold text-foreground mb-3">
                                    {v.titulo}
                                </h3>
                                <p className="text-foreground/50 text-body leading-relaxed">
                                    {v.descripcion}
                                </p>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>
        </div>
    );
}
