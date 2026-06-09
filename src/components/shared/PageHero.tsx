/**
 * PageHero — reusable hero for non-landing public pages
 * (herramientas, nosotros, contacto, legal/privacidad, legal/terminos).
 *
 * Replaces the duplicated `<div className="bg-zinc-950 py-24 ...">` block
 * that previously appeared identically in 5 different pages.
 *
 * Variants:
 *   - "default" — for marketing/utility pages (herramientas, nosotros, contacto)
 *   - "compact" — for legal pages (shorter padding, no radial glow)
 *
 * Tokens used:
 *   bg-background (oklch 0.15 0 0) — replaces hardcoded bg-zinc-950
 *   text-display-3 + metallic-gold for the h1
 *   tracking-mega + animate-gold-shimmer for the eyebrow
 *
 * Accessibility:
 *   - <h1> as the only top-level heading on the page
 *   - Eyebrow marked aria-hidden so screen readers don't read the
 *     all-caps tracking-out letter-spaced string twice
 *   - Optional `id` so an aria-labelledby on the page <main> can
 *     reference the h1
 */

import type { ReactNode } from "react";
import { FadeIn } from "@/components/ui/motion";

export interface PageHeroProps {
    /** Small all-caps label above the h1 (e.g. "Recursos Exclusivos"). */
    eyebrow?: string;
    /** h1 content — can be a plain string or a Fragment with a <span className="metallic-gold"> highlight. */
    title: ReactNode;
    /** Supporting paragraph below the h1. */
    description?: ReactNode;
    /** Optional metadata line (e.g. "Última actualización: …"). */
    meta?: ReactNode;
    /** Optional CTAs, badges, etc. — rendered below the description. */
    children?: ReactNode;
    /** "default" (py-24 + radial gold glow) or "compact" (py-16, no glow). */
    variant?: "default" | "compact";
    /** Centered (default true). */
    centered?: boolean;
    /** Optional id for the h1 (e.g. for aria-labelledby or anchor links). */
    titleId?: string;
}

export function PageHero({
    eyebrow,
    title,
    description,
    meta,
    children,
    variant = "default",
    centered = true,
    titleId,
}: PageHeroProps) {
    const isCompact = variant === "compact";

    return (
        <div
            className={`bg-background ${isCompact ? "py-16" : "py-24"} border-b border-gold-500/20 relative overflow-hidden`}
        >
            {/* Subtle gold radial — only on default variant */}
            {!isCompact && (
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]"
                    aria-hidden="true"
                />
            )}

            <div
                className={`container mx-auto px-4 relative z-10 ${centered ? "text-center max-w-4xl" : "max-w-4xl"}`}
            >
                <FadeIn>
                    {eyebrow && (
                        <span
                            aria-hidden="true"
                            className="animate-gold-shimmer text-caption font-bold uppercase tracking-mega mb-6 inline-block"
                        >
                            {eyebrow}
                        </span>
                    )}

                <h1
                        id={titleId}
                        className="text-display-3 text-foreground mb-6"
                    >
                        {title}
                    </h1>

                    {description && (
                        <p className="text-foreground/50 text-body max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}

                    {meta && (
                        <p className="text-gold-500/80 text-body-lg mt-4">{meta}</p>
                    )}

                    {children && <div className="mt-8">{children}</div>}
                </FadeIn>
            </div>
        </div>
    );
}
