/**
 * ComoTrabajamos — process section for the home page.
 *
 * 4 numbered steps that frame the Black Corporativo value proposition
 * (Diagnóstico → Curación → Estructuración → Cierre). This is the
 * "boutique" signal: luxury real estate is sold as a process, not a
 * catalog. Buyers (especially HNWI / family offices) need to see the
 * methodology before they will click "Ver Inventario".
 *
 * Server component — purely presentational. The staggered fade-in is
 * provided by the existing `StaggerChildren` / `StaggerItem` helpers
 * from `@/components/ui/motion`, which hydrate to a small framer-motion
 * island on the client.
 */

import { Search, Gem, FileSignature, KeyRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

interface Step {
    number: string;
    title: string;
    body: string;
    icon: LucideIcon;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Diagnóstico",
        body:
            "Reunión inicial confidencial. Mapeamos objetivos de inversión, horizonte, tolerancia al riesgo y estructura fiscal para definir el perfil de búsqueda.",
        icon: Search,
    },
    {
        number: "02",
        title: "Curación de Portafolio",
        body:
            "Acceso a inventario On-Market y Off-Market curado por verticales —Luxury, Business, Industrial— con análisis financiero estructurado por activo.",
        icon: Gem,
    },
    {
        number: "03",
        title: "Estructuración",
        body:
            "Coordinación con notaría, fiduciario y asesores legales. Modelado de escenarios de salida, yield objetivo y estructura de capital.",
        icon: FileSignature,
    },
    {
        number: "04",
        title: "Cierre y Operación",
        body:
            "Acompañamiento hasta la firma. Después: gestión post-venta, reportes trimestrales y revendedores estratégicos cuando aplica.",
        icon: KeyRound,
    },
];

export function ComoTrabajamos() {
    return (
        <section
            className="w-full py-24 bg-background"
            aria-labelledby="como-trabajamos-title"
        >
            <div className="container mx-auto px-4">
                <FadeIn className="max-w-2xl mb-16">
                    <span className="font-display text-caption font-bold uppercase tracking-eyebrow text-gold-solid">
                        Metodología
                    </span>
                    <h2
                        id="como-trabajamos-title"
                        className="text-display-2 md:text-display-2 text-foreground mt-4 mb-4"
                    >
                        Cómo trabajamos
                    </h2>
                    <p className="text-body-lg text-foreground/70">
                        Cuatro fases que estructuran cada operación. Sin
                        improvisación, con entregables definidos en cada
                        etapa.
                    </p>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <StaggerItem key={step.number}>
                                <div className="relative h-full p-6 md:p-8 rounded-2xl border border-foreground/5 bg-foreground/[0.015] hover:border-gold-500/20 hover:bg-foreground/[0.03] transition-all duration-500">
                                    {/* Number + icon row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="font-display text-display-3 font-bold metallic-gold-static">
                                            {step.number}
                                        </span>
                                        <div
                                            className="w-11 h-11 rounded-full border border-gold-500/20 bg-background/40 flex items-center justify-center"
                                            aria-hidden="true"
                                        >
                                            <Icon className="w-5 h-5 text-gold-solid" />
                                        </div>
                                    </div>
                                    {/* Title + body */}
                                    <h3 className="font-display text-lg font-bold uppercase tracking-card text-foreground mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-body text-foreground/60 leading-relaxed">
                                        {step.body}
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
