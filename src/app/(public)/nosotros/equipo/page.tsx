import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Equipo | Black Corporativo",
    description:
        "Conoce al equipo de Black Corporativo. Asesores inmobiliarios especializados en Tijuana con experiencia en los mercados residencial, comercial e industrial.",
    alternates: {
        canonical: "https://blackcorporativo.com/nosotros/equipo",
    },
};

const miembros = [
    {
        nombre: "Moisés Núñez",
        cargo: "Director General",
        descripcion:
            "Al frente de Black Corporativo desde su fundación. Especialista en estructuración de operaciones inmobiliarias y análisis financiero para inversionistas en Tijuana.",
    },
    {
        nombre: "Omar Medina Yañez",
        cargo: "Asesor Inmobiliario Senior",
        descripcion:
            "Más de 8 años de experiencia en el mercado inmobiliario de Tijuana. Especializado en propiedades residenciales premium y fraccionamientos privados.",
    },
];

export default function EquipoPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="bg-zinc-950 py-16 border-b border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <span className="text-xs font-bold uppercase tracking-mega text-gold-500/80 mb-4 inline-block">
                            Nuestro Equipo
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-display uppercase text-foreground mb-4">
                            Las Personas Detrás de{" "}
                            <span className="metallic-gold">Black Corporativo</span>
                        </h1>
                        <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
                            Asesores inmobiliarios con conocimiento profundo del mercado de Tijuana.
                            No vendemos humo — conocemos cada colonia, cada fraccionamiento y cada
                            corredor industrial de la región.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {miembros.map((m) => (
                        <StaggerItem key={m.nombre}>
                            <div className="group p-8 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
                                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6">
                                    <span className="text-gold-500 text-xl font-bold">
                                        {m.nombre.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                </div>
                                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                                    {m.nombre}
                                </h3>
                                <p className="text-gold-500/80 text-sm font-medium mb-4">
                                    {m.cargo}
                                </p>
                                <p className="text-foreground/50 text-sm leading-relaxed">
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
