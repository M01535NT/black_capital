import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { Shield, Users, TrendingUp, Award } from "lucide-react";

export const metadata: Metadata = {
    title: "Nosotros | Black Corporativo",
    description:
        "Inmobiliaria premium en Tijuana especializada en casas residenciales, centros comerciales y naves industriales. Transparencia, análisis y resultados en cada operación.",
};

const pillars = [
    {
        icon: Shield,
        title: "Due Diligence Institucional",
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
        title: "Análisis Financiero Estructurado",
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

export default function NosotrosPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Hero */}
            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <FadeIn>
                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-mega mb-6 inline-block">
                            Acerca de Nosotros
                        </span>
                        <h1 className="text-display-3 font-display font-semibold tracking-display uppercase text-4xl md:text-6xl text-foreground mb-6">
                            La Plataforma Inmobiliaria{" "}
                            <span className="metallic-gold">del Futuro</span>
                        </h1>
                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
                            Black Capital es una plataforma inmobiliaria premium
                            enfocada en Tijuana, Baja California. Conectamos a compradores,
                            vendedores e inversionistas con los mejores activos residenciales,
                            comerciales e industriales de la región.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Pilares */}
            <div className="container mx-auto px-4 py-24">
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <StaggerItem key={pillar.title}>
                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-all duration-500">
                                        <Icon className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <h3 className="text-display-4 font-display font-semibold tracking-wide uppercase text-xl text-foreground mb-4">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-foreground/50 text-sm leading-relaxed">
                                        {pillar.description}
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
