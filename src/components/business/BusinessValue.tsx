     1|"use client";
     2|
     3|import { Briefcase, Building, TrendingUp } from "lucide-react";
     4|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     5|
     6|const values = [
     7|    {
     8|        icon: Briefcase,
     9|        title: "Oficinas Corporativas",
    10|        description:
    11|            "Espacios de trabajo en torres emblemáticas con acabados premium, estacionamiento ejecutivo y salas de juntas equipadas. Ubicaciones estratégicas en los corredores de negocio más importantes.",
    12|    },
    13|    {
    14|        icon: Building,
    15|        title: "Locales y Plazas Comerciales",
    16|        description:
    17|            "Locales comerciales de alta visibilidad en plazas con flujo peatonal comprobado. Ideales para retail premium, restaurantes, showrooms y flagship stores de marcas líderes.",
    18|    },
    19|    {
    20|        icon: TrendingUp,
    21|        title: "Inversión en Renta Comercial",
    22|        description:
    23|            "Portafolio de activos comerciales con inquilinos triple-net, contratos a largo plazo y rendimientos superiores a la renta fija. Análisis Cap Rate y flujo operativo incluido.",
    24|    },
    25|];
    26|
    27|export function BusinessValue() {
    28|    return (
    29|        <section className="w-full py-28 bg-background relative overflow-hidden">
    30|            {/* Decorative gold lines */}
    31|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    32|
    33|            {/* Floating accent */}
    34|            <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />
    35|
    36|            <div className="container mx-auto px-4">
    37|                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
    38|                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    39|                        Oportunidades Comerciales
    40|                    </span>
    41|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-5">
    42|                        Activos que Generan{" "}
    43|                        <span className="metallic-gold">Valor</span>
    44|                    </h2>
    45|                    <p className="text-foreground/45 text-lg leading-relaxed">
    46|                        Cada propiedad comercial en nuestro portafolio ha sido
    47|                        analizada bajo criterios de ubicación, flujo operativo,
    48|                        cap rate y proyección de plusvalía.
    49|                    </p>
    50|                </FadeIn>
    51|
    52|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    53|                    {values.map((item) => {
    54|                        const Icon = item.icon;
    55|                        return (
    56|                            <StaggerItem key={item.title}>
    57|                                <div className="group relative p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700">
    58|                                    {/* Glow on hover */}
    59|                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    60|
    61|                                    <div className="relative z-10">
    62|                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500">
    63|                                            <Icon className="w-6 h-6 text-gold-500" />
    64|                                        </div>
    65|
    66|                                        <h3 className="card-title text-xl text-foreground mb-4 tracking-wide">
    67|                                            {item.title}
    68|                                        </h3>
    69|
    70|                                        <p className="text-foreground/45 text-sm leading-relaxed">
    71|                                            {item.description}
    72|                                        </p>
    73|                                    </div>
    74|                                </div>
    75|                            </StaggerItem>
    76|                        );
    77|                    })}
    78|                </StaggerChildren>
    79|            </div>
    80|        </section>
    81|    );
    82|}
    83|