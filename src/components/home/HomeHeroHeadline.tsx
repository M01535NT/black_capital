"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["vivir", "invertir", "crecer", "operar", "expandirte."] as const;

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
    <h1 className="max-w-5xl text-white text-balance">
      <span className="block text-display-3 font-semibold text-white/88">
        Encuentra espacios para
      </span>
      <span className="relative mt-2 block min-h-[1.05em] overflow-hidden text-display-1 font-extrabold leading-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="metallic-gold-static block"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}

