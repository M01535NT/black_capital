import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { Shield, Users, TrendingUp, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Nosotros | Black Corporativo",
    description:
        "Inmobiliaria premium en Tijuana especializada en casas residenciales, centros comerciales y naves industriales. Transparencia, análisis y resultados en cada operación.",
    alternates: {
        canonical: "https://blackcorporativo.com/nosotros",
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
        descripcion: "Conoce a las personas detrás de Black Corporativo.",
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

            {/* Subpáginas de navegación */}
            <div className="container mx-auto px-4 py-16">
                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {subpaginas.map((s) => (
                            <Link
                                key={s.href}
                                href={s.href}
                                className="group p-6 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500"
                            >
                                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-gold-500 transition-colors">
                                    {s.titulo}
                                </h3>
                                <p className="text-foreground/50 text-sm mb-4">
                                    {s.descripcion}
                                </p>
                                <span className="inline-flex items-center gap-1 text-xs text-gold-500 font-medium uppercase tracking-wider">
                                    Explorar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </FadeIn>
            </div>

            {/* Pilares */}
            <div className="container mx-auto px-4 py-24 border-t border-white/[0.04]">
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
