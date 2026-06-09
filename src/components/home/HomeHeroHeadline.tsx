"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["vivir", "invertir", "crecer", "operar", "expandirte."] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeHeroHeadline() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <h1 className="max-w-5xl text-balance text-white">
      <span className="block text-display-3 font-semibold text-white/88">
        Encuentra espacios para
      </span>
      <span className="relative mt-2 block min-h-[1.18em] pb-3 text-display-1 font-extrabold leading-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.48, ease: EASE }}
            className="metallic-gold-static relative inline-block align-top"
          >
            {words[index]}
            <motion.span
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={shouldReduceMotion ? undefined : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
              className="pointer-events-none absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full"
              style={{ background: "var(--gradient-gold)" }}
            />
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
