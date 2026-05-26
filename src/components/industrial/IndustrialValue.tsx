"use client";

import { Factory, Warehouse, Truck } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

const values = [
    {
        icon: Factory,
        title: "Terrenos Macro",
        description:
            "Predios de +5 hectáreas estratégicamente ubicados en zonas de alta demanda industrial con acceso a vías primarias y servicios de infraestructura.",
    },
    {
        icon: Warehouse,
        title: "Naves Industriales",
        description:
            "Desde naves industriales clase A con alturas de +12m hasta soluciones Build-to-Suit (BTS) diseñadas para operaciones específicas.",
    },
    {
        icon: Truck,
        title: "Parques Logísticos",
        description:
            "Parques con conectividad estratégica a los principales corredores logísticos de México: T-MEC, Bajío, Pacífico y frontera norte.",
    },
];

export function IndustrialValue() {
    return (
        <section className="w-full py-24 bg-background relative overflow-hidden">
            {/* Top separator */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-8 h-px bg-steel-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
                            Verticales de activo
                        </span>
                        <div className="w-8 h-px bg-steel-500" />
                    </div>
                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
                        Activos Industriales de
                        <span className="metallic-gold"> Alto Calibre</span>
                    </h2>
                    <p className="text-foreground/50 text-lg">
                        Tres clases de activo industrial, una sola plataforma con
                        análisis financiero estructurado para cada oportunidad.
                    </p>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {values.map((item) => {
                        const Icon = item.icon;
                        return (
                            <StaggerItem key={item.title}>
                                <div className="group relative p-8 rounded-none border border-steel-500/15 bg-zinc-950/50 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500">
                                    {/* Corner accent */}
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500" />

                                    <div className="w-12 h-12 rounded-none bg-steel-700/30 border border-steel-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition-all duration-500">
                                        <Icon className="w-6 h-6 text-steel-400 group-hover:text-gold-500 transition-colors duration-500" />
                                    </div>

                                    <h3 className="card-title text-xl text-foreground mb-3 uppercase tracking-wider">
                                        {item.title}
                                    </h3>

                                    <p className="text-foreground/50 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>
        </section>
    );
}
