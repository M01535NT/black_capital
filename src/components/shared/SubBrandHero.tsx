"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Accent = "gold" | "steel";

export interface SubBrandHeroProps {
    /** Eyebrow label rendered above the headline (e.g. "Black Luxury"). */
    brand: string;
    /** Path to the hero background image (PNG fallback). */
    backgroundImage: string;
    /** Optional WebP version for browsers that support it. */
    backgroundImageWebp?: string;
    /** Alt text for the background image. */
    backgroundAlt: string;
    /** Tailwind classes for the dark overlay gradient. */
    overlayClass?: string;
    /** Visual accent: gold (luxury/business) or steel (industrial). */
    accent: Accent;
    /** Headline. Pass a Fragment with <br /> and a <span className="metallic-gold"> for the gold-highlighted word. */
    headline: React.ReactNode;
    /** Supporting paragraph below the headline. */
    subtitle: string;
    /** Primary CTA button. */
    primaryCta: { label: string; href: string };
    /** Optional secondary text-link CTA. */
    secondaryCta?: { label: string; href: string };
    /** Optional stats bar (e.g. industrial: "250K+ m² en portafolio"). */
    highlights?: Array<{ value: string; label: string }>;
    /** Whether to show the decorative grid-line overlay. Default: false. */
    gridLines?: boolean;
    /** Whether to follow the cursor with a gold glow. Default: true. */
    cursorGlow?: boolean;
    /** Whether to show the scroll indicator at the bottom. Default: true. */
    scrollIndicator?: boolean;
}

const ACCENT_LABEL: Record<Accent, { text: string; separator: string; chevron: string; scroll: string }> = {
    gold: {
        text: "animate-gold-shimmer text-foreground",
        separator: "from-gold-500 to-gold-700",
        chevron: "text-gold-500/60",
        scroll: "text-gold-500/60",
    },
    steel: {
        text: "text-steel-400",
        separator: "from-steel-500 to-gold-700",
        chevron: "text-steel-500/60",
        scroll: "text-steel-500/60",
    },
};

const isTouchDevice = (): boolean =>
    typeof window !== "undefined" && "ontouchstart" in window;

export function SubBrandHero({
    brand,
    backgroundImage,
    backgroundImageWebp,
    backgroundAlt,
    overlayClass = "from-black/60 via-black/40",
    accent,
    headline,
    subtitle,
    primaryCta,
    secondaryCta,
    highlights,
    gridLines = false,
    cursorGlow = true,
    scrollIndicator = true,
}: SubBrandHeroProps) {
    const shouldReduceMotion = useReducedMotion();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const pendingRef = useRef<{ x: number; y: number } | null>(null);

    const animateCursor = useCallback(() => {
        if (!pendingRef.current) return;
        setMousePos(pendingRef.current);
        pendingRef.current = null;
        rafRef.current = requestAnimationFrame(animateCursor);
    }, []);

    useEffect(() => {
        if (shouldReduceMotion || !cursorGlow || isTouchDevice()) return;

        const handleMouseMove = (e: MouseEvent) => {
            pendingRef.current = { x: e.clientX, y: e.clientY };
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(animateCursor);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [shouldReduceMotion, cursorGlow, animateCursor]);

    const accentClasses = ACCENT_LABEL[accent];

    return (
        <section
            aria-label={`${brand} — Presentación`}
            className="scroll-snap-section relative w-full min-h-[100svh] flex items-center overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
        >
            {backgroundImageWebp ? (
              <picture>
                <source srcSet={backgroundImageWebp} type="image/webp" />
                <Image
                  src={backgroundImage}
                  alt={backgroundAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </picture>
            ) : (
              <Image
                src={backgroundImage}
                alt={backgroundAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}

            {/* Dark overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass} to-background`} />

            {/* Cursor-follow glow (luxury/business) — throttled via rAF + early-return on touch */}
            {cursorGlow && !shouldReduceMotion && !isTouchDevice() && (
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[120px] pointer-events-none z-0"
                    animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
                    transition={{ type: "spring", damping: 30, stiffness: 150 }}
                />
            )}

            {/* Floating orbs (luxury/business) */}
            {cursorGlow && (
                <>
                    <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-400/5 blur-[100px] animate-float-slow pointer-events-none" />
                    <div className="absolute bottom-1/3 left-1/6 w-64 h-64 rounded-full bg-gold-600/5 blur-[80px] animate-float pointer-events-none" />
                </>
            )}

            {/* Grid lines (industrial) */}
            {gridLines && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, oklch(1 0 0 / 20%) 1px, transparent 1px),
                                linear-gradient(to bottom, oklch(1 0 0 / 20%) 1px, transparent 1px)
                            `,
                            backgroundSize: "80px 80px",
                        }}
                    />
                </div>
            )}

            {/* Noise overlay */}
            <div className="grain-overlay" />

            {/* ═══════ Content: asymmetric grid (7+5 desktop, 1-col mobile) ═══════ */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-28 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end min-h-[68vh]">

                    {/* ═══ LEFT: Text block (cols 1-7) ═══ */}
                    <div className="lg:col-span-7 order-2 lg:order-1 space-y-6 sm:space-y-8 lg:space-y-10">
                        {/* Eyebrow label */}
                        <motion.div
                            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-4"
                        >
                            <div className={cn(
                                "w-12 h-px",
                                accent === "gold"
                                    ? "bg-gradient-to-r from-gold-700 to-gold-400"
                                    : "bg-steel-500",
                            )} />
                            <span
                                className={cn("text-xs font-bold uppercase tracking-mega", accentClasses.text)}
                            >
                                {brand}
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={shouldReduceMotion ? {} : (gridLines ? { opacity: 0, x: -40 } : { opacity: 0, y: 40 })}
                            animate={{ opacity: 1, [gridLines ? "x" : "y"]: 0 }}
                            transition={{ duration: gridLines ? 0.8 : 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-display-1 font-display font-bold tracking-display uppercase text-foreground"
                        >
                            {headline}
                        </motion.h1>

                        {/* Separator */}
                        <motion.div
                            initial={shouldReduceMotion ? {} : { scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className={`w-24 h-px bg-gradient-to-r ${accentClasses.separator} origin-left`}
                        />

                        {/* Subtitle */}
                        <motion.p
                            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-base md:text-lg text-foreground/50 max-w-lg md:max-w-xl leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                        >
                            <Link href={primaryCta.href} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto min-h-[48px] bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase px-8 py-3 sm:py-4 text-sm rounded-full group">
                                    {primaryCta.label}
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            {secondaryCta && (
                                <Link
                                    href={secondaryCta.href}
                                    className="text-sm text-foreground/50 hover:text-gold-500 uppercase tracking-eyebrow font-medium transition-colors"
                                >
                                    {secondaryCta.label}
                                </Link>
                            )}
                        </motion.div>
                    </div>

                    {/* ═══ RIGHT: Highlights (cols 8-12, mobile-first: above text) ═══ */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        {highlights && highlights.length > 0 && (
                            <motion.div
                                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                className="grid grid-cols-3 gap-4 sm:gap-6 lg:grid-cols-1 lg:gap-8"
                            >
                                {highlights.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex flex-col lg:border-l lg:border-white/10 lg:pl-6"
                                    >
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-numerics font-bold metallic-gold">
                                            {stat.value}
                                        </span>
                                        <span className="text-[10px] sm:text-xs uppercase tracking-wide-display text-foreground/50 font-medium mt-1">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>

            {/* Scroll indicator */}
            {scrollIndicator && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-caption uppercase tracking-eyebrow text-foreground/50 font-medium">
                        Descubre más
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className={`w-5 h-5 ${accentClasses.scroll}`} />
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
