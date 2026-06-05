"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

/**
 * SubBrandValue — three-up value proposition grid for the 3 sub-brand
 * landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryValue.tsx
 *   - src/components/business/BusinessValue.tsx
 *   - src/components/industrial/IndustrialValue.tsx
 *
 * The 3 originals were ~95% duplicated. The visual chrome (gold panel
 * with gold gradient borders and floating orbs for luxury/business;
 * steel panel with squared corners and corner accents for industrial)
 * and the content (eyebrow, title with metallic-gold highlight, lead
 * paragraph, 3 cards) are now driven by a single `config` object.
 *
 * Old component names are preserved via thin re-exports in the
 * per-brand folders so import paths don't break elsewhere.
 *
 * Design rules:
 *   - "luxury" / "business" use rounded-2xl cards, gold borders, gold
 *     floating orbs, hover lift
 *   - "industrial" uses rounded-none cards, steel borders, corner
 *     accents that turn gold on hover, steel-400 icons
 */

export type Accent = "gold" | "steel";

export interface SubBrandValueItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface SubBrandValueProps {
    brand: "luxury" | "business" | "industrial";
    eyebrow: string;
    /** h2 content. Pass a Fragment with a <span className="metallic-gold"> for the highlighted word. */
    title: ReactNode;
    description: string;
    items: SubBrandValueItem[];
    accent: Accent;
}

export function SubBrandValue({
    brand,
    eyebrow,
    title,
    description,
    items,
    accent,
}: SubBrandValueProps) {
    const isSteel = accent === "steel";

    return (
        <section
            aria-label={`Propuesta de valor ${brand}`}
            className={`w-full ${isSteel ? "py-24" : "py-28"} bg-background relative overflow-hidden`}
        >
            {/* Top separator */}
            <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                    isSteel ? "via-steel-500/30" : "via-gold-500/30"
                } to-transparent`}
                aria-hidden="true"
            />

            {/* Floating accent (luxury/business only) */}
            {!isSteel && (
                <div
                    className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none"
                    aria-hidden="true"
                />
            )}

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    {isSteel ? (
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-8 h-px bg-steel-500" aria-hidden="true" />
                            <span className="text-xs font-bold uppercase tracking-hero text-steel-400">
                                {eyebrow}
                            </span>
                            <div className="w-8 h-px bg-steel-500" aria-hidden="true" />
                        </div>
                    ) : (
                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-mega mb-6 inline-block">
                            {eyebrow}
                        </span>
                    )}

                    <h2 className="text-display-3 font-display font-semibold tracking-display uppercase text-3xl md:text-5xl text-foreground mb-4 md:mb-5">
                        {title}
                    </h2>
                    <p
                        className={`${
                            isSteel ? "text-foreground/50 text-lg" : "text-foreground/50 text-lg leading-relaxed"
                        }`}
                    >
                        {description}
                    </p>
                </FadeIn>

                <StaggerChildren
                    className={`grid grid-cols-1 md:grid-cols-3 ${
                        isSteel ? "gap-6" : "gap-8"
                    } max-w-6xl mx-auto`}
                >
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <StaggerItem key={item.title}>
                                <div
                                    className={
                                        isSteel
                                            ? "group relative p-8 rounded-none border border-steel-500/15 bg-zinc-950/50 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500"
                                            : "group relative p-10 rounded-2xl border border-gold-500/10 bg-background-deep/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700"
                                    }
                                >
                                    {/* Hover glow (luxury/business) */}
                                    {!isSteel && (
                                        <div
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                            aria-hidden="true"
                                        />
                                    )}

                                    {/* Corner accents (industrial) */}
                                    {isSteel && (
                                        <>
                                            <div
                                                className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500"
                                                aria-hidden="true"
                                            />
                                            <div
                                                className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-steel-500/30 group-hover:border-gold-500/50 transition-colors duration-500"
                                                aria-hidden="true"
                                            />
                                        </>
                                    )}

                                    <div className="relative z-10">
                                        <div
                                            className={
                                                isSteel
                                                    ? "w-12 h-12 rounded-none bg-steel-700/30 border border-steel-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition-all duration-500"
                                                    : "w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500"
                                            }
                                        >
                                            <Icon
                                                className={
                                                    isSteel
                                                        ? "w-6 h-6 text-steel-400 group-hover:text-gold-500 transition-colors duration-500"
                                                        : "w-6 h-6 text-gold-500"
                                                }
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <h3 className="text-display-4 font-display font-semibold tracking-wide uppercase text-xl text-foreground mb-3 md:mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-foreground/50 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>
        </section>
    );
}
