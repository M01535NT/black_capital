"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TopMarquee } from "./Marquees";

const words = ["Legado", "Futuro", "Expansión"];

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

/* Detect coarse pointer (mobile/tablet) at hook level so we never
   mount the cursor-follow glow on touch devices. */
function useIsCoarsePointer(): boolean {
    const [coarse, setCoarse] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        const update = () => setCoarse(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    return coarse;
}

export function Hero() {
    const [index, setIndex] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    const isCoarsePointer = useIsCoarsePointer();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        if (shouldReduceMotion) return;

        // Throttle the cursor follow with rAF: only commit to state
        // when the browser is ready to paint the next frame, so we
        // avoid 1 re-render per mousemove (was 60–120 Hz on a fast mouse).
        const handleMouseMove = (e: MouseEvent) => {
            if (rafId.current !== null) return;
            rafId.current = window.requestAnimationFrame(() => {
                setMousePos({ x: e.clientX, y: e.clientY });
                rafId.current = null;
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const intervalId = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3500);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafId.current !== null) {
                window.cancelAnimationFrame(rafId.current);
            }
            clearInterval(intervalId);
        };
    }, [shouldReduceMotion]);

    const showCursorGlow = !shouldReduceMotion && !isCoarsePointer;

    return (
        <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
            {/* ── Video Background ──
                poster: shows immediately so first paint is not the black void
                preload="metadata": only fetches the metadata first, full bytes
                stream once autoplay starts (browser heuristics) */}
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

            {/* ── Dark Overlay ── */}
            <div className="absolute inset-0 bg-black/60 z-[-1]" />

            {/* ── Cursor Follow Glow (desktop only) ── */}
            {showCursorGlow && (
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none z-0"
                    animate={{
                        x: mousePos.x - 300,
                        y: mousePos.y - 300,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 150 }}
                />
            )}

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl space-y-12">
                    {/* ── Main Headline ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-display-1 font-display font-bold tracking-display uppercase text-foreground"
                    >
                        Impulsamos <br />
                        tu{" "}
                        {/* ── Staggered Letter Reveal (PRD requirement) ── */}
                        <span
                            className="inline whitespace-nowrap"
                            style={{ perspective: "600px" }}
                        >
                            {shouldReduceMotion ? (
                                <span className="metallic-gold">
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

                    {/* ── Subtitle ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 1,
                            delay: shouldReduceMotion ? 0 : 0.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="text-body text-foreground/50 max-w-xl uppercase tracking-hero font-medium"
                    >
                        Generando valor para ti.
                    </motion.p>
                </div>
            </div>

            {/* ── Scroll Down Indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-caption uppercase tracking-eyebrow text-foreground/50 font-medium">
                    Descubre más
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
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
