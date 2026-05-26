"use client";

import { Briefcase, Building, TrendingUp } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

const values = [
    {
        icon: Briefcase,
        title: "Oficinas Corporativas",
        description:
            "Espacios de trabajo en torres emblemáticas con acabados premium, estacionamiento ejecutivo y salas de juntas equipadas. Ubicaciones estratégicas en los corredores de negocio más importantes.",
    },
    {
        icon: Building,
        title: "Locales y Plazas Comerciales",
        description:
            "Locales comerciales de alta visibilidad en plazas con flujo peatonal comprobado. Ideales para retail premium, restaurantes, showrooms y flagship stores de marcas líderes.",
    },
    {
        icon: TrendingUp,
        title: "Inversión en Renta Comercial",
        description:
            "Portafolio de activos comerciales con inquilinos triple-net, contratos a largo plazo y rendimientos superiores a la renta fija. Análisis Cap Rate y flujo operativo incluido.",
    },
];

export function BusinessValue() {
    return (
        <section className="w-full py-28 bg-background relative overflow-hidden">
            {/* Decorative gold lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            {/* Floating accent */}
            <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
                        Oportunidades Comerciales
                    </span>
                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-5">
                        Activos que Generan{" "}
                        <span className="metallic-gold">Valor</span>
                    </h2>
                    <p className="text-foreground/45 text-lg leading-relaxed">
                        Cada propiedad comercial en nuestro portafolio ha sido
                        analizada bajo criterios de ubicación, flujo operativo,
                        cap rate y proyección de plusvalía.
                    </p>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {values.map((item) => {
                        const Icon = item.icon;
                        return (
                            <StaggerItem key={item.title}>
                                <div className="group relative p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500">
                                            <Icon className="w-6 h-6 text-gold-500" />
                                        </div>

                                        <h3 className="card-title text-xl text-foreground mb-4 tracking-wide">
                                            {item.title}
                                        </h3>

                                        <p className="text-foreground/45 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>
        </section>
    );
}
