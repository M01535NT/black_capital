"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopMarquee } from "./Marquees";

const words = ["Patrimonio", "Visión", "Capital"];

/* ── Staggered Letter Reveal Component ─────────────────────────────── */
function StaggeredWord({ word }: { word: string }) {
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
                    className="inline-block metallic-gold"
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

/* ── Conditionally render the hero video. Skip on touch-only devices,
 * `prefers-reduced-motion`, or slow network. Static poster still paints. */
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
        }, 5000); // Slower rotation for more contemplative feel
        return () => clearInterval(intervalId);
    }, [shouldReduceMotion]);

    return (
        <section
            className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden"
            aria-label="Hero de Black Capital"
        >
            {/* ── Video Background ── */}
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
            {!shouldRenderVideo && (
                <div
                    className="absolute inset-0 bg-cover bg-center z-[-2]"
                    style={{ backgroundImage: "url(/hero-poster.svg)" }}
                    aria-hidden="true"
                />
            )}

            {/* ── Layered Dark Overlay with subtle texture ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90 z-[-1]">
                <div className="absolute inset-0 grain-overlay" />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-4xl lg:max-w-5xl space-y-8 md:space-y-10">
                    {/* ── Asymmetrical layout: eyebrow left-aligned, headline right-weighted ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-3 font-display text-caption font-bold uppercase tracking-eyebrow mb-4"
                    >
                        <span className="font-mono text-gold-solid text-body-sm">
                            01 /
                        </span>
                        <span className="text-gold-solid">
                            Real Estate · Inversión · México
                        </span>
                    </motion.div>

                    {/* ── Main Headline with enhanced metallic treatment ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[clamp(3.5rem,9vw,7rem)] font-display font-bold tracking-[-0.04em] uppercase text-foreground leading-[0.9] mb-6"
                    >
                        Estructuramos <br className="hidden sm:block" />
                        tu{" "}
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

                    {/* ── Refined gold separator with subtle animation ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{
                            duration: 1.5,
                            delay: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-24 h-[1.5px] bg-gold-solid origin-left mb-8"
                    />

                    {/* ── Value proposition (enhanced B2B focus) ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 1,
                            delay: shouldReduceMotion ? 0 : 0.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="font-sans text-body-lg md:text-body-xl text-foreground/75 max-w-xl leading-relaxed mb-10"
                    >
                        Adquisición, estructuración y disposición de activos
                        inmobiliarios premium —residenciales, comerciales e
                        industriales— para inversores institucionales y
                        family offices en México.
                    </motion.p>

                    {/* ── Primary + secondary CTA with elevated interaction ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: shouldReduceMotion ? 0 : 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex flex-col sm:flex-row gap-4 pt-6"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="group relative bg-gold-solid text-black hover:bg-gold-400 font-display text-xs font-bold uppercase tracking-eyebrow px-8 py-7 rounded-none shadow-[0_8px_24px_rgba(212,175,55,0.18)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.32)] transition-all duration-300 overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gold-solid after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-10"
                        >
                            <Link href="/inventario">
                                Ver Inventario Exclusivo
                                <ArrowRight
                                    className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-foreground/30 bg-transparent text-foreground hover:border-gold-solid hover:text-gold-solid hover:bg-transparent font-display text-xs font-bold uppercase tracking-eyebrow px-8 py-7 rounded-none transition-all duration-300 relative after:content-[''] after:absolute after:inset-0 after:border after:border-gold-solid after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100"
                        >
                            <Link href="/contacto">
                                <CalendarCheck
                                    className="w-4 h-4 mr-3"
                                    aria-hidden="true"
                                />
                                Agendar Asesoría
                            </Link>
                        </Button>
                    </motion.div>

                    {/* ── Trust microline with subtle divider ── */}
                    <div className="flex items-center justify-center space-x-4 pt-6">
                        <div className="w-px h-4 bg-gold-400/30" />
                        <motion.p
                            initial={shouldReduceMotion ? {} : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="font-display text-capital uppercase tracking-overline text-foreground/40"
                        >
                            Más de 12 años · CDMX · Monterrey · Guadalajara · Tijuana
                        </motion.p>
                        <div className="w-px h-4 bg-gold-400/30" />
                    </div>
                </div>
            </div>

            {/* ── Bottom Marquee with enhanced styling ── */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <TopMarquee className="bg-gold-500/5 backdrop-blur-sm" />
            </div>
        </section>
    );
}