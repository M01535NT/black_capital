"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

/* Import as modules so next/image can generate the blurDataURL at build time.
   Using string paths would force placeholder="empty" instead of "blur". */
import brandLuxury from "../../../public/brand-luxury.png";
import brandBusiness from "../../../public/brand-business.png";
import brandIndustrial from "../../../public/brand-industrial.png";

const brands: {
    name: string;
    href: string;
    description: string;
    image: StaticImageData;
}[] = [
    {
        name: "Black Luxury",
        href: "/black-luxury",
        description: "Residencias trofeo y propiedades de súper lujo para HNWI.",
        image: brandLuxury,
    },
    {
        name: "Black Business",
        href: "/black-business",
        description: "Activos corporativos clase A y oficinas premium.",
        image: brandBusiness,
    },
    {
        name: "Black Industrial",
        href: "/black-industrial",
        description: "Terrenos macro, naves industriales y parques logísticos.",
        image: brandIndustrial,
    },
];

export function BrandsGrid() {
    return (
        <section className="w-full py-24 bg-background">
            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-display-3 text-foreground mb-4">
                        Especialización Vertical
                    </h2>
                    <p className="text-body-lg text-foreground/70">
                        Nuestros portafolios operan bajo verticales
                        estrictamente segregadas para garantizar precisión en
                        la búsqueda y el análisis de cada clase de activo.
                    </p>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {brands.map((brand) => (
                        <StaggerItem key={brand.name}>
                            <Link
                                href={brand.href}
                                aria-label={`Explorar ${brand.name}`}
                                className="group relative overflow-hidden rounded-2xl img-zoom hover-lift aspect-square md:aspect-[4/5] flex flex-col justify-end p-8 border border-foreground/5 transition-all duration-500 hover:scale-[1.015] hover:shadow-2xl hover:shadow-gold-500/15 hover:border-gold-500/30"
                            >
                                {/* Background Image */}
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    placeholder="blur"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark gradient overlay for readability — slightly stronger on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                                {/* Gold border glow on hover (single restrained accent) */}
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-gold-500/0 group-hover:ring-gold-500/30 transition-all duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    <h3 className="text-display-4 text-foreground mb-2">
                                        {brand.name}
                                    </h3>
                                    <p className="text-body-sm text-foreground/70 mb-6 max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500">
                                        {brand.description}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-gold-500 font-display font-bold uppercase tracking-wide-display text-xs">
                                        Explorar Portafolio{" "}
                                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
}
