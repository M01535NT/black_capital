     1|"use client";
     2|
     3|import { Factory, Warehouse, Truck } from "lucide-react";
     4|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     5|
     6|const values = [
     7|    {
     8|        icon: Factory,
     9|        title: "Terrenos Macro",
    10|        description:
    11|            "Predios de +5 hectáreas estratégicamente ubicados en zonas de alta demanda industrial con acceso a vías primarias y servicios de infraestructura.",
    12|    },
    13|    {
    14|        icon: Warehouse,
    15|        title: "Naves Industriales",
    16|        description:
    17|            "Desde naves industriales clase A con alturas de +12m hasta soluciones Build-to-Suit (BTS) diseñadas para operaciones específicas.",
    18|    },
    19|    {
    20|        icon: Truck,
    21|        title: "Parques Logísticos",
    22|        description:
    23|            "Parques con conectividad estratégica a los principales corredores logísticos de México: T-MEC, Bajío, Pacífico y frontera norte.",
    24|    },
    25|];
    26|
    27|export function IndustrialValue() {
    28|    return (
    29|        <section className="w-full py-24 bg-background relative overflow-hidden">
    30|            {/* Top separator */}
    31|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />
    32|
    33|            <div className="container mx-auto px-4">
    34|                <FadeIn className="text-center max-w-3xl mx-auto mb-16">
    35|                    <div className="flex items-center justify-center gap-4 mb-6">
    36|                        <div className="w-8 h-px bg-steel-500" />
    37|                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
    38|                            Verticales de activo
    39|                        </span>
    40|                        <div className="w-8 h-px bg-steel-500" />
    41|                    </div>
    42|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    43|                        Activos Industriales de
    44|                        <span className="metallic-gold"> Alto Calibre</span>
    45|                    </h2>
    46|                    <p className="text-foreground/50 text-lg">
    47|                        Tres clases de activo industrial, una sola plataforma con
    48|                        análisis financiero estructurado para cada oportunidad.
    49|                    </p>
    50|                </FadeIn>
    51|
    52|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    53|                    {values.map((item) => {
    54|                        const Icon = item.icon;
    55|                        return (
    56|                            <StaggerItem key={item.title}>
    57|                                <div className="group relative p-8 rounded-none border border-steel-500/15 bg-zinc-950/50 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500">
    58|                                    {/* Corner accent */}
    59|                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500" />
    60|                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500" />
    61|
    62|                                    <div className="w-12 h-12 rounded-none bg-steel-700/30 border border-steel-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition-all duration-500">
    63|                                        <Icon className="w-6 h-6 text-steel-400 group-hover:text-gold-500 transition-colors duration-500" />
    64|                                    </div>
    65|
    66|                                    <h3 className="card-title text-xl text-foreground mb-3 uppercase tracking-wider">
    67|                                        {item.title}
    68|                                    </h3>
    69|
    70|                                    <p className="text-foreground/50 text-sm leading-relaxed">
    71|                                        {item.description}
    72|                                    </p>
    73|                                </div>
    74|                            </StaggerItem>
    75|                        );
    76|                    })}
    77|                </StaggerChildren>
    78|            </div>
    79|        </section>
    80|    );
    81|}
    82|