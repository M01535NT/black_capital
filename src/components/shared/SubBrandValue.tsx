import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CinematicImage } from "@/components/visual/CinematicImage";

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
            src: "/line-residencial.webp",
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
            src: "/line-comercial.webp",
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

export function SubBrandValue({ brand, eyebrow, title, description, items }: SubBrandValueProps) {
    return (
        <section id={`${brand}-value`} aria-label={`Propuesta de valor ${brand}`} className="mx-auto w-full max-w-[100rem] px-6 py-20 sm:px-10 lg:px-20 lg:py-32">
            <ScrollReveal className="mb-10 max-w-3xl lg:mb-16">
                <p className="mb-5 text-caption gold-ink">{eyebrow}</p>
                <h2 className="text-display-2 text-balance text-white">{title}</h2>
                <p className="sr-only">{description}</p>
            </ScrollReveal>
            <div data-section="sub-brand-value-rail" data-brand={brand} className="grid gap-5 md:grid-cols-[1.2fr_1fr] lg:gap-8">
                {items.map((item, index) => {
                    const images = BRAND_IMAGES[brand];
                    const image = images[index % images.length];
                    return (
                        <ScrollReveal key={item.title} delay={index * 0.08} className={index === 0 ? "md:row-span-2" : ""}>
                            <Link href={BRAND_HREF[brand]} className="group relative block h-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[var(--color-accent)]" aria-label={`${item.title}: ver inventario`}>
                                <CinematicImage src={image.src} alt={image.alt} sizes="(max-width: 768px) 100vw, 55vw" imageClassName={image.imageClassName} className={`h-full min-h-[440px] ${index === 0 ? "md:min-h-[760px]" : "md:min-h-[368px]"}`}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                                    <span aria-hidden="true" className="absolute left-6 top-6 property-tag-type text-white/80">0{index + 1}</span>
                                    <div className="absolute inset-x-6 bottom-7 lg:inset-x-8 lg:bottom-8">
                                        <div className="flex items-end justify-between gap-4">
                                            <h3 className="text-display-3 max-w-[16ch] text-white lg:!text-3xl">{item.title}</h3>
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors group-hover:bg-white group-hover:text-black"><ArrowUpRight className="size-5" aria-hidden="true" /></span>
                                        </div>
                                        <p className="sr-only">{item.description}</p>
                                    </div>
                                </CinematicImage>
                            </Link>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
