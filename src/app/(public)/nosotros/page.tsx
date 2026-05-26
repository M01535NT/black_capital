     1|import type { Metadata } from "next";
     2|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     3|import { Shield, Users, TrendingUp, Award } from "lucide-react";
     4|
     5|export const metadata: Metadata = {
     6|    title: "Nosotros | Black Corporativo",
     7|    description:
     8|        "Boutique inmobiliaria digital de alto nivel especializada en activos residenciales de lujo, comerciales y logísticos en México.",
     9|};
    10|
    11|const pillars = [
    12|    {
    13|        icon: Shield,
    14|        title: "Due Diligence Institucional",
    15|        description:
    16|            "Cada propiedad pasa por un proceso de verificación legal, financiera y técnica antes de ser publicada en nuestra plataforma.",
    17|    },
    18|    {
    19|        icon: Users,
    20|        title: "Relaciones de Confianza",
    21|        description:
    22|            "Construimos relaciones a largo plazo con inversores, desarrolladores y family offices basadas en transparencia y resultados.",
    23|    },
    24|    {
    25|        icon: TrendingUp,
    26|        title: "Análisis Financiero Estructurado",
    27|        description:
    28|            "Brochures ejecutivos con Cap Rate, TIR, flujos proyectados y comparativos de mercado para una toma de decisiones informada.",
    29|    },
    30|    {
    31|        icon: Award,
    32|        title: "Especialización por Vertical",
    33|        description:
    34|            "Tres marcas especializadas — Luxury, Business e Industrial — con equipos dedicados que entienden cada segmento a profundidad.",
    35|    },
    36|];
    37|
    38|export default function NosotrosPage() {
    39|    return (
    40|        <div className="w-full flex-1 bg-background">
    41|            {/* Hero */}
    42|            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
    43|                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
    44|                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
    45|                    <FadeIn>
    46|                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    47|                            Acerca de Nosotros
    48|                        </span>
    49|                        <h1 className="section-heading text-4xl md:text-6xl text-white mb-6">
    50|                            La Boutique Inmobiliaria{" "}
    51|                            <span className="metallic-gold">del Futuro</span>
    52|                        </h1>
    53|                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
    54|                            Black Corporativo es una plataforma digital inmobiliaria de alta gama
    55|                            estructurada para inversores B2B y HNWI con interés en el mercado
    56|                            mexicano. Operamos como puente entre los mejores activos inmobiliarios
    57|                            y los inversores más sofisticados.
    58|                        </p>
    59|                    </FadeIn>
    60|                </div>
    61|            </div>
    62|
    63|            {/* Pilares */}
    64|            <div className="container mx-auto px-4 py-24">
    65|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    66|                    {pillars.map((pillar) => {
    67|                        const Icon = pillar.icon;
    68|                        return (
    69|                            <StaggerItem key={pillar.title}>
    70|                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
    71|                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-all duration-500">
    72|                                        <Icon className="w-6 h-6 text-gold-500" />
    73|                                    </div>
    74|                                    <h3 className="card-title text-xl text-foreground mb-4">
    75|                                        {pillar.title}
    76|                                    </h3>
    77|                                    <p className="text-foreground/45 text-sm leading-relaxed">
    78|                                        {pillar.description}
    79|                                    </p>
    80|                                </div>
    81|                            </StaggerItem>
    82|                        );
    83|                    })}
    84|                </StaggerChildren>
    85|            </div>
    86|        </div>
    87|    );
    88|}
    89|