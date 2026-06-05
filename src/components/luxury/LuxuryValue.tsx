"use client";

import { Crown, Building2, Gem } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

const values = [
    {
        icon: Crown,
        title: "Residencias Trofeo",
        description:
            "Propiedades icónicas en las zonas de mayor plusvalía. Casas de autor, mansiones y fincas con diseño arquitectónico de firma y amenidades excepcionales.",
    },
    {
        icon: Building2,
        title: "Penthouses de Autor",
        description:
            "Los pisos más altos con las mejores vistas. Penthouses en torres emblemáticas con acabados de altísima gama y sistemas domóticos de última generación.",
    },
    {
        icon: Gem,
        title: "Desarrollos Exclusivos",
        description:
            "Acceso anticipado a proyectos residenciales Pre-Venta y Off-Market. Oportunidades de inversión con rendimientos superiores al promedio del mercado.",
    },
];

export function LuxuryValue() {
    return (
        <section className="w-full py-28 bg-background relative overflow-hidden">
            {/* Decorative gold lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            {/* Floating accent */}
            <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-mega mb-6 inline-block">
                        Exclusividad Certificada
                    </span>
                    <h2 className="text-display-3 font-display font-semibold tracking-display uppercase text-3xl md:text-5xl text-foreground mb-5">
                        El Arte de Invertir en{" "}
                        <span className="metallic-gold">lo Extraordinario</span>
                    </h2>
                    <p className="text-foreground/45 text-lg leading-relaxed">
                        Cada propiedad en nuestro portafolio de lujo ha sido curada
                        personalmente bajo criterios de ubicación, diseño, plusvalía
                        y nivel de exclusividad.
                    </p>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {values.map((item) => {
                        const Icon = item.icon;
                        return (
                            <StaggerItem key={item.title}>
                                <div className="group relative p-10 rounded-2xl border border-gold-500/10 bg-background-deep/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500">
                                            <Icon className="w-6 h-6 text-gold-500" />
                                        </div>

                                        <h3 className="text-display-4 font-display font-semibold tracking-wide uppercase text-xl text-foreground mb-4 tracking-wide">
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
