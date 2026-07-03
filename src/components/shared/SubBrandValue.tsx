import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export type Accent = "gold" | "steel";

export interface SubBrandValueItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface SubBrandValueProps {
    brand: "luxury" | "business" | "industrial";
    eyebrow: string;
    title: ReactNode;
    description: string;
    items: SubBrandValueItem[];
    accent: Accent;
}

const BRAND_HREF: Record<SubBrandValueProps["brand"], string> = {
    luxury: "/inventario?uso=Residencial",
    business: "/inventario?uso=Comercial",
    industrial: "/inventario?uso=Industrial",
};

interface BrandCardImage {
    src: string;
    alt: string;
    imageClassName?: string;
}

const BRAND_IMAGES: Record<SubBrandValueProps["brand"], BrandCardImage[]> = {
    luxury: [
        {
            src: "/brand-luxury.webp",
            alt: "Residencia privada con acceso controlado en Tijuana",
            imageClassName: "object-[52%_50%]",
        },
        {
            src: "/hero-luxury.webp",
            alt: "Casa residencial contemporánea en Tijuana",
            imageClassName: "object-[58%_50%]",
        },
        {
            src: "/brand-luxury.webp",
            alt: "Detalle residencial con terraza y amenidades",
            imageClassName: "object-[72%_50%]",
        },
    ],
    business: [
        {
            src: "/brand-business.webp",
            alt: "Espacio comercial con visibilidad en Tijuana",
            imageClassName: "object-[48%_50%]",
        },
        {
            src: "/hero-business.webp",
            alt: "Local comercial en corredor corporativo de Tijuana",
            imageClassName: "object-[58%_50%]",
        },
        {
            src: "/brand-business.webp",
            alt: "Interior comercial para servicios en Tijuana",
            imageClassName: "object-[70%_50%]",
        },
    ],
    industrial: [
        {
            src: "/brand-industrial.webp",
            alt: "Nave industrial con patio de maniobra en Tijuana",
            imageClassName: "object-[42%_50%]",
        },
        {
            src: "/industrial-hero.webp",
            alt: "Parque industrial con conectividad logística en Tijuana",
            imageClassName: "object-[55%_50%]",
        },
        {
            src: "/hero-industrial.webp",
            alt: "Bodega industrial para logística en Tijuana",
            imageClassName: "object-[66%_50%]",
        },
    ],
};

export function SubBrandValue({
    brand,
    eyebrow,
    title,
    description,
    items,
}: SubBrandValueProps) {
    return (
        // w-full es necesario: como flex item de #main-content (columna), mx-auto sin
        // ancho explícito dimensiona la sección a su contenido y el rail desborda el viewport.
        <section
            id={`${brand}-value`}
            aria-label={`Propuesta de valor ${brand}`}
            className="w-full mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
        >
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <p className="mb-3 text-caption gold-ink">
                        {eyebrow}
                    </p>
                    <h2 className="text-display-2 text-white">
                        {title}
                    </h2>
                </div>
                <p className="max-w-xl text-body text-white/58 sm:text-right">
                    {description}
                </p>
            </div>

            <div
                data-section="sub-brand-value-rail"
                data-brand={brand}
                className="sub-brand-value-rail scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 lg:mx-0 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
            >
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const images = BRAND_IMAGES[brand];
                    const image = images[index % images.length];
                    return (
                        <ScrollReveal
                            key={item.title}
                            delay={index * 0.08}
                            className="sub-brand-value-card-shell min-w-[78vw] snap-center sm:min-w-[58vw] lg:min-w-0"
                        >
                            <article className="group relative flex h-full min-w-0 flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-colors duration-500 hover:border-[var(--color-accent)]/38">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "linear-gradient(140deg, transparent 20%, rgba(210,167,60,0.12) 72%, transparent 100%)",
                                    }}
                                />
                                <div className="sub-brand-value-image relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className={`object-cover motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-out motion-safe:group-hover:scale-105 ${image.imageClassName ?? ""}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/28 to-black/5 transition-opacity duration-700 group-hover:opacity-90" />
                                    <div className="absolute left-4 top-4 property-tag-type text-white/42">
                                        /{String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className="absolute inset-x-4 bottom-4">
                                        <div className="mb-4 h-px w-12 origin-left bg-[var(--color-accent)]/55 transition-all duration-700 group-hover:w-24" />
                                        <div className="flex items-end gap-3">
                                            <span className="gold-gradient flex h-9 w-9 shrink-0 items-center justify-center text-black">
                                                <Icon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                            <h3 className="min-w-0 break-words text-display-3 text-white">{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex flex-1 flex-col p-5">
                                    <p className="line-clamp-3 text-body leading-relaxed text-white/64 lg:line-clamp-none">{item.description}</p>
                                    <div className="mt-auto pt-6">
                                        <Link
                                            href={BRAND_HREF[brand]}
                                            className="group/cta inline-flex w-fit items-center gap-2 text-white/82 transition-colors duration-300 hover:text-[var(--color-accent)]"
                                        >
                                            <span className="property-tag-type relative pb-1">
                                                Ver inventario
                                                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current opacity-60 transition-transform duration-500 group-hover/cta:scale-x-100" />
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/cta:translate-x-1" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
