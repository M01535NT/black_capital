import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Equipo | Black Capital",
    description:
        "Conoce al equipo de Black Capital. Asesores inmobiliarios especializados en Tijuana con experiencia en los mercados residencial, comercial e industrial.",
    alternates: {
        canonical: "https://blackmx.vercel.app/nosotros/equipo",
    },
};

const miembros = [
    {
        nombre: "Moisés Núñez",
        cargo: "Director General",
        descripcion: "Estructura operaciones y análisis para inversionistas.",
    },
    {
        nombre: "Omar Medina Yañez",
        cargo: "Asesor Senior",
        descripcion: "Residencial premium y fraccionamientos privados.",
    },
];

export default function EquipoPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                            <span className="property-tag-type text-[var(--color-accent)]/80 mb-4 inline-block">
                            Nuestro Equipo
                        </span>
                        <h1 className="text-display-1 uppercase text-foreground mb-4 text-balance">
                            Las Personas Detrás de{" "}
                            <span className="metallic-gold-static">Black Capital</span>
                        </h1>
                        <p className="text-body text-foreground/58 max-w-2xl mx-auto">
                            Equipo local, análisis claro y seguimiento directo.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <StaggerChildren className="grid grid-cols-2 gap-0 max-w-4xl mx-auto border-t border-white/[0.06]">
                    {miembros.map((m) => (
                        <StaggerItem key={m.nombre}>
                            <div className="group h-full min-h-[260px] border-b border-white/[0.06] bg-white/[0.01] p-5 transition-colors duration-500 hover:bg-white/[0.025] first:border-r sm:p-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 sm:h-16 sm:w-16">
                                    <span className="text-lg font-bold text-[var(--color-accent)] sm:text-xl">
                                        {m.nombre.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                </div>
                                <h3 className="text-display-3 font-semibold text-foreground mb-1">
                                    {m.nombre}
                                </h3>
                                <p className="text-foreground/50 text-body-sm mb-4">
                                    {m.cargo}
                                </p>
                                <p className="text-foreground/50 text-body">
                                    {m.descripcion}
                                </p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </div>
    );
}
