"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TopMarquee } from "./Marquees";

const words = ["Legado", "Rentabilidad", "Expansión"];

/* ── Staggered Letter Reveal Component ── */
function StaggeredWord({ word, className }: { word: string; className?: string }) {
    const letters = useMemo(() => word.split(""), [word]);

    return (
        <motion.span
            key={word}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={className}
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

export function Hero() {
    const [index, setIndex] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (shouldReduceMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        const intervalId = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3500);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearInterval(intervalId);
        };
    }, [shouldReduceMotion]);

    return (
        <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
            {/* ── Animated Gradient Background ── */}
            <div
                className="absolute inset-0 animate-gradient-shift"
                style={{
                    background:
                        "linear-gradient(135deg, oklch(0.12 0 0) 0%, oklch(0.18 0.04 78) 35%, oklch(0.10 0 0) 70%, oklch(0.08 0 0) 100%)",
                }}
            />

            {/* ── Noise/Grain Overlay ── */}
            <div className="grain-overlay" />

            {/* ── Cursor Follow Glow ── */}
            {!shouldReduceMotion && (
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none z-0"
                    animate={{
                        x: mousePos.x - 300,
                        y: mousePos.y - 300,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 150 }}
                />
            )}

            {/* ── Floating Orbs ── */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-400/5 blur-[100px] animate-float-slow pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/6 w-72 h-72 rounded-full bg-gold-600/5 blur-[80px] animate-float pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl space-y-12">
                    {/* ── Main Headline ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-[100px] font-display font-semibold text-foreground leading-[0.95] tracking-[-0.04em] uppercase"
                    >
                        Impulsamos <br />
                        tu{" "}
                        {/* ── Staggered Letter Reveal (PRD requirement) ── */}
                        <span className="inline" style={{ perspective: "600px" }}>
                            {shouldReduceMotion ? (
                                <span className="metallic-gold">{words[index]}</span>
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
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                        className="text-sm md:text-base text-foreground/40 max-w-xl uppercase tracking-[0.4em] font-medium leading-relaxed"
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
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-medium">
                    Descubre más
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-gold-500/60" />
                </motion.div>
            </motion.div>

            {/* ── Bottom Marquee ── */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <TopMarquee />
            </div>
        </section>
    );
}
