"use client";

/**
 * Primitivas de motion compartidas por la home rediseñada (framer-motion v12).
 * Todo respeta prefers-reduced-motion: bajo reduce, los reveals caen a estático
 * y el parallax se apaga (devuelve undefined → sin transform).
 *
 * Filosofía (emil-design-eng): curvas de easing fuertes, solo transform/opacity,
 * springs para gestos. Guardrail (design-taste): reduced-motion no es opcional.
 */

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode, type RefObject } from "react";

/** Curva ease-out fuerte (entradas). */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Curva ease-in-out fuerte (movimiento en pantalla). */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
/** Spring estándar para gestos/drag. */
export const SPRING = { type: "spring", stiffness: 120, damping: 20 } as const;
/** Spring suave para snap de carruseles. */
export const SPRING_SOFT = { type: "spring", stiffness: 90, damping: 18 } as const;

/**
 * Parallax de una capa ligada al scroll de su contenedor.
 * `distance` en px: la capa se desplaza de -distance a +distance mientras
 * el elemento cruza el viewport. Devuelve un MotionValue<string> para aplicar
 * como `transform` (hardware-accelerated, no el shorthand `y` de framer que
 * corre en el main thread). Undefined bajo reduced-motion.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  distance = 60,
): MotionValue<string> | undefined {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const transform = useMotionTemplate`translateY(${y}px)`;
  return reduce ? undefined : transform;
}

/**
 * Zoom-out sutil ligado al scroll (para fondos estáticos tipo hero).
 * Va de `from` a `to` en escala. Devuelve `transform` string para HW-accel.
 * Undefined bajo reduced-motion.
 */
export function useScrollScale(
  ref: RefObject<HTMLElement | null>,
  from = 1.12,
  to = 1,
): MotionValue<string> | undefined {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const transform = useMotionTemplate`scale(${scale})`;
  return reduce ? undefined : transform;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** Retraso en segundos. */
  delay?: number;
  /** Duración en segundos. */
  duration?: number;
  as?: "div" | "section" | "li" | "article" | "span" | "p" | "h2" | "h3";
}

/**
 * Reveal de entrada en scroll: fade + subida + desenfoque leve.
 * Bajo reduced-motion aparece estático (sin transform ni blur).
 */
export function Reveal({
  children,
  className,
  y = 26,
  delay = 0,
  duration = 0.7,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
}

/** Variants para orquestar stagger de hijos con RevealItem. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}

/** Contenedor que orquesta la entrada escalonada de sus RevealItem. */
export function RevealStagger({ children, className, amount = 0.25, as = "div" }: StaggerProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

interface ItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "span";
}

/** Hijo de RevealStagger. Bajo reduced-motion se renderiza plano. */
export function RevealItem({ children, className, as = "div" }: ItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}

/** Hook util: ref tipado para contenedores de parallax. */
export function useSectionRef<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null);
}
