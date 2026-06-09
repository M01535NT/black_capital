"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Editorial scroll-progress bar. Fixed at the top of the viewport, 2px
 * tall, gold gradient. Mirrors a feature you'll see on Vercel / Linear /
 * Stripe press kits. Server-rendered as a 0px placeholder so the markup
 * is the same; the actual width is set on the client after we have a
 * scroll position to read.
 */
export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 28,
        restDelta: 0.001,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // ✅ Hydration guard: SSR produces null, client flips to true
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-gold-700 via-gold-solid to-gold-300 shadow-[0_0_8px_rgba(210,167,60,0.5)]"
            style={{ scaleX, transformOrigin: "0% 50%" }}
        />
    );
}
