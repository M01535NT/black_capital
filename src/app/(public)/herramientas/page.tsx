     1|import type { Metadata } from "next";
     2|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     3|import { Calculator, FileSpreadsheet, BarChart3, Download } from "lucide-react";
     4|import { Button } from "@/components/ui/button";
     5|import Link from "next/link";
     6|
     7|export const metadata: Metadata = {
     8|    title: "Herramientas para Inversionistas | Black Corporativo",
     9|    description:
    10|        "Herramientas financieras y recursos exclusivos para inversionistas inmobiliarios: calculadoras, reportes de mercado y análisis comparativos.",
    11|};
    12|
    13|const tools = [
    14|    {
    15|        icon: Calculator,
    16|        title: "Calculadora de Cap Rate",
    17|        description:
    18|            "Calcula la tasa de capitalización de cualquier activo comercial o industrial ingresando ingreso operativo neto y precio de adquisición.",
    19|        status: "Próximamente",
    20|    },
    21|    {
    22|        icon: FileSpreadsheet,
    23|        title: "Plantilla de Due Diligence",
    24|        description:
    25|            "Checklist completo de verificación legal, financiera y técnica para adquisiciones inmobiliarias. Descargable en Excel.",
    26|        status: "Próximamente",
    27|    },
    28|    {
    29|        icon: BarChart3,
    30|        title: "Reportes de Mercado",
    31|        description:
    32|            "Análisis trimestrales del mercado inmobiliario mexicano por segmento: residencial de lujo, comercial e industrial.",
    33|        status: "Próximamente",
    34|    },
    35|    {
    36|        icon: Download,
    37|        title: "Brochures Financieros",
    38|        description:
    39|            "Accede a los brochures ejecutivos de cualquier propiedad en nuestro catálogo con datos financieros verificados.",
    40|        status: "Disponible",
    41|        href: "/inventario",
    42|    },
    43|];
    44|
    45|export default function HerramientasPage() {
    46|    return (
    47|        <div className="w-full flex-1 bg-background">
    48|            {/* Header */}
    49|            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
    50|                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
    51|                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
    52|                    <FadeIn>
    53|                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    54|                            Recursos Exclusivos
    55|                        </span>
    56|                        <h1 className="section-heading text-4xl md:text-6xl text-white mb-6">
    57|                            Herramientas para{" "}
    58|                            <span className="metallic-gold">Inversionistas</span>
    59|                        </h1>
    60|                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
    61|                            Recursos financieros y analíticos diseñados para inversores
    62|                            profesionales que buscan tomar decisiones informadas en el mercado
    63|                            inmobiliario mexicano.
    64|                        </p>
    65|                    </FadeIn>
    66|                </div>
    67|            </div>
    68|
    69|            {/* Tools Grid */}
    70|            <div className="container mx-auto px-4 py-24">
    71|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    72|                    {tools.map((tool) => {
    73|                        const Icon = tool.icon;
    74|                        return (
    75|                            <StaggerItem key={tool.title}>
    76|                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 flex flex-col h-full">
    77|                                    <div className="flex items-start justify-between mb-8">
    78|                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/20 transition-all duration-500">
    79|                                            <Icon className="w-6 h-6 text-gold-500" />
    80|                                        </div>
    81|                                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
    82|                                            tool.status === "Disponible"
    83|                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    84|                                                : "bg-gold-500/10 text-gold-500 border border-gold-500/20"
    85|                                        }`}>
    86|                                            {tool.status}
    87|                                        </span>
    88|                                    </div>
    89|                                    <h3 className="card-title text-xl text-foreground mb-4">
    90|                                        {tool.title}
    91|                                    </h3>
    92|                                    <p className="text-foreground/45 text-sm leading-relaxed flex-1">
    93|                                        {tool.description}
    94|                                    </p>
    95|                                    {tool.href && (
    96|                                        <Link href={tool.href} className="mt-6">
    97|                                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold">
    98|                                                Acceder
    99|                                            </Button>
   100|                                        </Link>
   101|                                    )}
   102|                                </div>
   103|                            </StaggerItem>
   104|                        );
   105|                    })}
   106|                </StaggerChildren>
   107|            </div>
   108|        </div>
   109|    );
   110|}
   111|