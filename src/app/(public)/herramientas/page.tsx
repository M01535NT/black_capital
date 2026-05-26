import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { Calculator, FileSpreadsheet, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Herramientas para Inversionistas | Black Corporativo",
    description:
        "Herramientas financieras y recursos exclusivos para inversionistas inmobiliarios: calculadoras, reportes de mercado y análisis comparativos.",
};

const tools = [
    {
        icon: Calculator,
        title: "Calculadora de Cap Rate",
        description:
            "Calcula la tasa de capitalización de cualquier activo comercial o industrial ingresando ingreso operativo neto y precio de adquisición.",
        status: "Próximamente",
    },
    {
        icon: FileSpreadsheet,
        title: "Plantilla de Due Diligence",
        description:
            "Checklist completo de verificación legal, financiera y técnica para adquisiciones inmobiliarias. Descargable en Excel.",
        status: "Próximamente",
    },
    {
        icon: BarChart3,
        title: "Reportes de Mercado",
        description:
            "Análisis trimestrales del mercado inmobiliario mexicano por segmento: residencial de lujo, comercial e industrial.",
        status: "Próximamente",
    },
    {
        icon: Download,
        title: "Brochures Financieros",
        description:
            "Accede a los brochures ejecutivos de cualquier propiedad en nuestro catálogo con datos financieros verificados.",
        status: "Disponible",
        href: "/inventario",
    },
];

export default function HerramientasPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Header */}
            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <FadeIn>
                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
                            Recursos Exclusivos
                        </span>
                        <h1 className="section-heading text-4xl md:text-6xl text-foreground mb-6">
                            Herramientas para{" "}
                            <span className="metallic-gold">Inversionistas</span>
                        </h1>
                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
                            Recursos financieros y analíticos diseñados para inversores
                            profesionales que buscan tomar decisiones informadas en el mercado
                            inmobiliario mexicano.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="container mx-auto px-4 py-24">
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <StaggerItem key={tool.title}>
                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/20 transition-all duration-500">
                                            <Icon className="w-6 h-6 text-gold-500" />
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                            tool.status === "Disponible"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                                        }`}>
                                            {tool.status}
                                        </span>
                                    </div>
                                    <h3 className="card-title text-xl text-foreground mb-4">
                                        {tool.title}
                                    </h3>
                                    <p className="text-foreground/45 text-sm leading-relaxed flex-1">
                                        {tool.description}
                                    </p>
                                    {tool.href && (
                                        <Link href={tool.href} className="mt-6">
                                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold">
                                                Acceder
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>
        </div>
    );
}
