"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Residencial", "Comercial", "Industrial"] as const;
const HEADLINE_ROTATE_INTERVAL_MS = 3200;
const WORD_TRANSITION_DURATION = 0.5;
const EASE = [0.22, 1, 0.36, 1] as const;
const LINE_UNDERLINE_DURATION = 0.55;
const WORD_INITIAL_OFFSET = 0.14;


export function HomeHeroHeadline() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, HEADLINE_ROTATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <h1 className="max-w-5xl text-balance text-white">
      <span className="block text-display-3 font-semibold uppercase text-white/88">
        Encuentra inventario
      </span>
      <span className="relative mt-2 block min-h-[1.18em] pb-3 text-display-1 font-extrabold leading-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: WORD_TRANSITION_DURATION, ease: EASE }}
            className="metallic-gold-static relative inline-block align-top"
          >
            {words[index]}
            <motion.span
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={shouldReduceMotion ? undefined : { scaleX: 0 }}
              transition={{
                duration: LINE_UNDERLINE_DURATION,
                delay: WORD_INITIAL_OFFSET,
                ease: EASE,
              }}
              className="pointer-events-none absolute -bottom-1 left-0 block h-[3px] w-full origin-left rounded-full"
              style={{ background: "var(--gradient-gold)" }}
            />
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
