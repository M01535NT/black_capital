"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopMarquee } from "./Marquees";

const words = ["Patrimonio", "Visión", "Capital"];

/* ── Staggered Letter Reveal Component ─────────────────────────────── */
function StaggeredWord({ word, className }: { word: string; className?: string }) {
    const letters = useMemo(() => word.split(""), [word]);

    return (
        <motion.span
            key={word}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="whitespace-nowrap"
            aria-label={word}
        >
            {letters.map((letter, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    className="inline-block metallic-gold text-glow-gold"
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: 60,
                            rotateX: -90,
                            filter: "blur(8px)",
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            filter: "blur(0px)",
                            transition: {
                                duration: 0.5,
                                delay: i * 0.06,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        },
                        exit: {
                            opacity: 0,
                            y: -40,
                            filter: "blur(4px)",
                            transition: {
                                duration: 0.3,
                                delay: i * 0.03,
                                ease: [0.55, 0, 1, 0.45],
                            },
                        },
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
}

/**
 * Conditionally render the hero video. We skip the `<video>` tag entirely on
 * (a) touch-only devices, (b) when `prefers-reduced-motion: reduce`, and
 * (c) when the effective network type looks slow (3g / slow-2g). The poster
 * frame still paints from the SVG, so first paint is never a black void.
 *
 * Trade-off: this hook only runs on the client, so the server-rendered HTML
 * includes the `<video>` and React swaps it for the poster on the first
 * hydration tick. That is acceptable because the `<video>` is decorative,
 * `aria-hidden`, and the poster is identical visually.
 */
function useShouldRenderVideo(): boolean {
    const [render, setRender] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setRender(false);
            return;
        }
        if (window.matchMedia("(pointer: coarse)").matches) {
            setRender(false);
            return;
        }
        const conn = (navigator as Navigator & {
            connection?: { effectiveType?: string; saveData?: boolean };
        }).connection;
        if (conn?.saveData) {
            setRender(false);
            return;
        }
        if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) {
            setRender(false);
            return;
        }
    }, []);

    return render;
}

export function Hero() {
    const [index, setIndex] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    const shouldRenderVideo = useShouldRenderVideo();

    useEffect(() => {
        if (shouldReduceMotion) return;
        const intervalId = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3500);
        return () => clearInterval(intervalId);
    }, [shouldReduceMotion]);

    return (
        <section
            className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden"
            aria-label="Hero de Black Corporativo"
        >
            {/* ── Video Background ──
                poster: shows immediately so first paint is not the black void
                preload="metadata": only fetches the metadata first, full bytes
                stream once autoplay starts (browser heuristics).
                Render is gated by useShouldRenderVideo to spare mobile data. */}
            {shouldRenderVideo && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/hero-poster.svg"
                    className="absolute inset-0 w-full h-full object-cover z-[-2]"
                    aria-hidden="true"
                >
                    <source src="/hero.webm" type="video/webm" />
                </video>
            )}
            {/* ── Static poster fallback (also used on its own when video is skipped) ── */}
            {!shouldRenderVideo && (
                <div
                    className="absolute inset-0 bg-cover bg-center z-[-2]"
                    style={{ backgroundImage: "url(/hero-poster.svg)" }}
                    aria-hidden="true"
                />
            )}

            {/* ── Layered Dark Overlay ──
                gradient is more refined than a flat black/60: the top fades
                to almost transparent (lets the gold poster glow through),
                the middle anchors the text, the bottom prepares the
                transition into the marquee. */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85 z-[-1]" />

            {/* ── Editorial corner markers (always visible) ──
                Small gold "BC" mark in the top-left, mirrored with the
                "01 / Hero" counter on the top-right. A subtle gold line
                on the left edge gives the section a "framed" feel. */}
            <div
                aria-hidden="true"
                className="absolute top-6 left-6 md:top-8 md:left-10 z-20 flex items-center gap-3"
            >
                <span className="w-8 h-px bg-gradient-to-r from-gold-500 to-gold-700" />
                <span className="font-display text-caption font-bold uppercase tracking-mega text-foreground/60">
                    BC
                </span>
            </div>
            <div
                aria-hidden="true"
                className="absolute top-6 right-6 md:top-8 md:right-10 z-20"
            >
                <span className="font-display text-caption font-bold uppercase tracking-mega text-foreground/60">
                    01 — Hero
                </span>
            </div>
            <div
                aria-hidden="true"
                className="absolute top-0 left-6 md:left-10 bottom-32 w-px bg-gradient-to-b from-gold-500/40 via-gold-500/10 to-transparent hidden md:block"
            />
            <div
                aria-hidden="true"
                className="absolute top-0 right-6 md:right-10 bottom-32 w-px bg-gradient-to-b from-gold-500/40 via-gold-500/10 to-transparent hidden md:block"
            />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl space-y-8 md:space-y-10">
                    {/* ── Eyebrow ── */}
                    <motion.span
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block font-display text-caption font-bold uppercase tracking-eyebrow text-gold-solid"
                    >
                        Boutique Inmobiliaria · México
                    </motion.span>

                    {/* ── Main Headline ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-display-1 font-display font-bold tracking-display uppercase text-foreground"
                    >
                        Estructuramos <br className="hidden sm:block" />
                        tu{" "}
                        {/* ── Staggered Letter Reveal (PRD requirement) ── */}
                        <span
                            className="inline whitespace-nowrap"
                            style={{ perspective: "600px" }}
                        >
                            {shouldReduceMotion ? (
                                <span className="metallic-gold drop-shadow-[0_0_24px_rgba(212,175,55,0.18)]">
                                    {words[index]}
                                </span>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <StaggeredWord
                                        key={words[index]}
                                        word={words[index]}
                                    />
                                </AnimatePresence>
                            )}
                        </span>
                    </motion.h1>

                    {/* ── Gold Separator Line ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{
                            duration: 1.2,
                            delay: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-24 h-px bg-gradient-to-r from-gold-500 to-gold-700 origin-left"
                    />

                    {/* ── Value proposition (concrete, B2B) ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 1,
                            delay: shouldReduceMotion ? 0 : 0.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="text-body-lg md:text-body-xl text-foreground/75 max-w-2xl leading-relaxed"
                    >
                        Adquisición, estructuración y disposición de activos
                        inmobiliarios premium —residenciales, comerciales e
                        industriales— para inversores institucionales y
                        family offices en México.
                    </motion.p>

                    {/* ── Primary + secondary CTA ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: shouldReduceMotion ? 0 : 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex flex-col sm:flex-row gap-3 pt-2"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="bg-gold-solid text-black hover:bg-gold-400 font-display text-xs font-bold uppercase tracking-eyebrow px-7 py-6 rounded-full shadow-[0_8px_24px_rgba(212,175,55,0.18)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.32)] transition-all duration-300"
                        >
                            <Link href="/inventario">
                                Ver Inventario Exclusivo
                                <ArrowRight
                                    className="w-4 h-4 ml-2"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-foreground/30 text-foreground hover:border-gold-solid hover:text-gold-solid hover:bg-transparent font-display text-xs font-bold uppercase tracking-eyebrow px-7 py-6 rounded-full transition-all duration-300"
                        >
                            <Link href="/contacto">
                                <CalendarCheck
                                    className="w-4 h-4 mr-2"
                                    aria-hidden="true"
                                />
                                Agendar Asesoría
                            </Link>
                        </Button>
                    </motion.div>

                    {/* ── Trust microline (year, scope) ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="font-display text-caption uppercase tracking-overline text-foreground/40 pt-2"
                    >
                        Más de 12 años · CDMX · Monterrey · Guadalajara · Tijuana
                    </motion.p>
                </div>
            </div>

            {/* ── Scroll Down Indicator ──
                Vertical-rail style: a thin gold line, a small caption,
                and a chevron that floats up and down. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-3"
            >
                <span className="text-caption uppercase tracking-eyebrow text-foreground/50 font-medium">
                    Descubre más
                </span>
                <div className="relative w-px h-10 bg-foreground/15 overflow-hidden">
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold-500"
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>
                <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown
                        aria-hidden="true"
                        className="w-5 h-5 text-gold-500/60"
                    />
                </motion.div>
            </motion.div>

            {/* ── Bottom Marquee ── */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <TopMarquee />
            </div>
        </section>
    );
}
