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
        titulo: "Transparencia Radical",
        descripcion:
            "Cada propiedad tiene un análisis financiero detrás. Sin letra chica, sin sorpresas. Si algo no conviene, te lo decimos antes de que preguntes.",
    },
    {
        icon: Handshake,
        titulo: "El Trato es Directo",
        descripcion:
            "Sin intermediarios innecesarios. Tú hablas con quien estructura la operación. Una línea de comunicación, una mesa de decisión.",
    },
    {
        icon: Target,
        titulo: "Enfoque en Resultados",
        descripcion:
            "No medimos el éxito en propiedades mostradas, sino en operaciones cerradas. Cada activo que entra al inventario pasa un filtro cuantitativo riguroso.",
    },
    {
        icon: Shield,
        titulo: "Tu Patrimonio, en Serio",
        descripcion:
            "Tratamos tu inversión como si fuera nuestra. Porque así empezamos: comprando, vendiendo y estructurando con nuestras propias tesis antes de ofrecerlas.",
    },
    {
        icon: Scale,
        titulo: "Due Diligence sin Atajos",
        descripcion:
            "Verificación legal, fiscal y técnica de cada propiedad. Si un activo no pasa el filtro, no entra al inventario. Por más bonita que se vea la foto.",
    },
    {
        icon: Zap,
        titulo: "Velocidad con Precisión",
        descripcion:
            "El mercado de Tijuana se mueve rápido. Nosotros también. Pero sin sacrificar el análisis. Cerramos más rápido porque empezamos con mejor información.",
    },
];

export default function ValoresPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <span className="text-xs font-bold uppercase tracking-mega text-gold-500/80 mb-4 inline-block">
                            Nuestros Principios
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-display uppercase text-foreground mb-4 text-balance">
                            Lo Que <span className="metallic-gold-static">Nos Define</span>
                        </h1>
                        <p className="text-foreground/58 text-lg max-w-2xl mx-auto leading-relaxed">
                            Seis principios aplicados a cada operación: claridad, disciplina,
                            verificación y seguimiento hasta el cierre.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-6xl mx-auto border-t border-white/[0.06]">
                    {valores.map((v) => {
                        const Icon = v.icon;
                        return (
                            <StaggerItem key={v.titulo}>
                                <div className="group p-8 border-b md:border-r border-white/[0.06] bg-white/[0.01] transition-colors duration-500 hover:bg-white/[0.025] h-full">
                                    <div className="w-12 h-12 rounded-md bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500">
                                        <Icon className="w-5 h-5 text-gold-500" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                                        {v.titulo}
                                    </h3>
                                    <p className="text-foreground/50 text-sm leading-relaxed">
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
