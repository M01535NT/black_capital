     1|"use client";
     2|
     3|import Link from "next/link";
     4|import Image from "next/image";
     5|import { ArrowRight } from "lucide-react";
     6|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     7|
     8|const brands = [
     9|    {
    10|        name: "Black Luxury",
    11|        href: "/black-luxury",
    12|        description: "Residencias trofeo y propiedades de súper lujo para HNWI.",
    13|        image: "/brand-luxury.png",
    14|    },
    15|    {
    16|        name: "Black Business",
    17|        href: "/black-business",
    18|        description: "Activos corporativos clase A y oficinas premium.",
    19|        image: "/brand-business.png",
    20|    },
    21|    {
    22|        name: "Black Industrial",
    23|        href: "/black-industrial",
    24|        description: "Terrenos macro, naves industriales y parques logísticos.",
    25|        image: "/brand-industrial.png",
    26|    }
    27|];
    28|
    29|export function BrandsGrid() {
    30|    return (
    31|        <section className="w-full py-24 bg-background">
    32|            <div className="container mx-auto px-4">
    33|                <FadeIn className="text-center max-w-2xl mx-auto mb-16">
    34|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    35|                        Especialización Vertical
    36|                    </h2>
    37|                    <p className="text-foreground/70 text-lg">
    38|                        Nuestros portafolios operan bajo verticales estrictamente segregadas para garantizar precisión en la búsqueda y el análisis de cada clase de activo.
    39|                    </p>
    40|                </FadeIn>
    41|
    42|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
    43|                    {brands.map((brand) => (
    44|                        <StaggerItem key={brand.name}>
    45|                            <Link
    46|                                href={brand.href}
    47|                                className="group relative overflow-hidden rounded-xl aspect-square md:aspect-[4/5] flex flex-col justify-end p-8 border border-foreground/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/15 hover:border-gold-500/30 cursor-pointer"
    48|                            >
    49|                                {/* Background Image */}
    50|                                <Image
    51|                                    src={brand.image}
    52|                                    alt={brand.name}
    53|                                    fill
    54|                                    sizes="(max-width: 768px) 100vw, 33vw"
    55|                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
    56|                                />
    57|
    58|                                {/* Dark gradient overlay for readability */}
    59|                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
    60|
    61|                                {/* Glassmorphic overlay on hover */}
    62|                                <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    63|
    64|                                {/* Gold border glow */}
    65|                                <div className="absolute inset-0 rounded-xl ring-1 ring-gold-500/0 group-hover:ring-gold-500/30 transition-all duration-500 pointer-events-none" />
    66|
    67|                                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
    68|                                    <h3 className="text-2xl font-bold font-display text-white mb-2">{brand.name}</h3>
    69|                                    <p className="text-white/70 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
    70|                                        {brand.description}
    71|                                    </p>
    72|                                    <div className="inline-flex items-center gap-2 text-gold-500 font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
    73|                                        Explorar Portafolio <ArrowRight className="w-4 h-4 ml-1" />
    74|                                    </div>
    75|                                </div>
    76|                            </Link>
    77|                        </StaggerItem>
    78|                    ))}
    79|                </StaggerChildren>
    80|            </div>
    81|        </section>
    82|    );
    83|}
    84|