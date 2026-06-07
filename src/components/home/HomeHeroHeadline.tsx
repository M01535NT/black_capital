"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Criterio", "Visión", "Confianza"] as const;

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
    <h1 className="max-w-4xl text-[clamp(3.15rem,15vw,5.25rem)] font-light leading-[0.96] tracking-tight text-white text-balance sm:text-[clamp(4rem,8vw,6rem)] lg:text-[clamp(4.75rem,7vw,7rem)]">
      Invierte con{" "}
      <span className="relative inline-block min-w-[8.5ch] text-[var(--color-accent)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
