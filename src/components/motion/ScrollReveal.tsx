"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const imageMask: Variants = {
  hidden: { opacity: 0, clipPath: "inset(12% 0% 0% 0%)", y: 18 },
  show: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "image-mask";
  once?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variant === "image-mask" ? imageMask : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: variant === "image-mask" ? 0.9 : 0.72, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
