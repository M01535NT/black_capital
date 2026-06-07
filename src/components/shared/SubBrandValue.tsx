import type { ReactNode } from "react";
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
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {eyebrow}
                    </p>
                    <h2 className="text-display-2 font-light leading-display tracking-headline text-white">
                        {title}
                    </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-right">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <article
                            key={item.title}
                            className="group overflow-hidden border border-white/[0.08] bg-white/[0.025]"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(212,175,55,0.08),rgba(255,255,255,0.02))]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                                <div className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                                    /{String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                                </div>
                            </div>
                            <div className="space-y-5 p-5">
                                <p className="text-sm leading-6 text-white/64">{item.description}</p>
                                <p className="text-xs uppercase tracking-[0.16em] text-white/42">
                                    {BRAND_LABEL[brand]} · contenido editable
                                </p>
                                <Link
                                    href={BRAND_HREF[brand]}
                                    className="inline-flex w-full items-center justify-center gap-2 border border-[var(--color-accent)]/45 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
                                >
                                    Inventario
                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
