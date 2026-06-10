"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, clipPath: "inset(0 0 1.8rem 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0rem 0)" }}
      transition={{ duration: 0.46, ease: EASE }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
