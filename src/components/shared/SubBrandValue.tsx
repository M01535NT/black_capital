import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

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

const BRAND_LABEL: Record<SubBrandValueProps["brand"], string> = {
    luxury: "Residencial",
    business: "Comercial",
    industrial: "Industrial",
};

const BRAND_HREF: Record<SubBrandValueProps["brand"], string> = {
    luxury: "/inventario?uso=Residencial",
    business: "/inventario?uso=Comercial",
    industrial: "/inventario?uso=Industrial",
};

const BRAND_IMAGE: Record<SubBrandValueProps["brand"], { src: string; alt: string }> = {
    luxury: {
        src: "/brand-luxury.webp",
        alt: "Residencia premium en Tijuana",
    },
    business: {
        src: "/brand-business.webp",
        alt: "Espacio comercial en Tijuana",
    },
    industrial: {
        src: "/brand-industrial.webp",
        alt: "Nave industrial en Tijuana",
    },
};

export function SubBrandValue({
    brand,
    eyebrow,
    title,
    description,
    items,
}: SubBrandValueProps) {
    return (
        <section
            id={`${brand}-value`}
            aria-label={`Propuesta de valor ${brand}`}
            className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
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

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const image = BRAND_IMAGE[brand];
                    return (
                        <article
                            key={item.title}
                            className="group flex h-full flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025]"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/35 to-black/10" />
                                <div className="absolute left-4 top-4 property-tag-type text-white/42">
                                    /{String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <span className="gold-gradient flex h-9 w-9 items-center justify-center rounded-full text-black">
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <h3 className="text-display-3 text-white">{item.title}</h3>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <p className="text-body leading-relaxed text-white/64">{item.description}</p>
                                <p className="mt-5 footer-legal-type text-white/42">
                                    {BRAND_LABEL[brand]} · contenido editable
                                </p>
                                <div className="mt-auto pt-6">
                                    <Link
                                        href={BRAND_HREF[brand]}
                                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[var(--color-accent)]/45 px-4 py-2.5 premium-cta gold-ink hover:border-[var(--color-accent)]"
                                    >
                                        Inventario
                                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
