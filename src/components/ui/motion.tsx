"use client";

import React from "react";
import {
    motion,
    useReducedMotion,
    type Variants,
} from "framer-motion";

/* ─────────────────────────────────────────────
 * FadeIn — fades + slides an element when it
 * enters the viewport. Configurable direction.
 * ───────────────────────────────────────────── */

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
    children: React.ReactNode;
    direction?: Direction;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
    /** viewport margin, e.g. "-100px" */
    margin?: string;
    /** ARIA role (e.g. "alert" for error states). */
    role?: string;
    /** Inline styles or aria-* attributes. */
    "aria-label"?: string;
    "aria-live"?: "polite" | "assertive" | "off";
}

const offset = 40;
const directionMap: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: offset },
    down: { x: 0, y: -offset },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
    none: { x: 0, y: 0 },
};

export function FadeIn({
    children,
    direction = "up",
    delay = 0,
    duration = 0.6,
    className,
    once = true,
    margin = "-80px",
    role,
    "aria-label": ariaLabel,
    "aria-live": ariaLive,
}: FadeInProps) {
    const shouldReduce = useReducedMotion();
    const d = directionMap[direction];

    return (
        <motion.div
            initial={
                shouldReduce
                    ? { opacity: 1 }
                    : { opacity: 0, x: d.x, y: d.y }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, margin }}
            transition={{
                duration: shouldReduce ? 0 : duration,
                delay: shouldReduce ? 0 : delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
            role={role}
            aria-label={ariaLabel}
            aria-live={ariaLive}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
 * StaggerChildren — staggers every direct child
 * that is wrapped in a motion element.
 * ───────────────────────────────────────────── */

interface StaggerChildrenProps {
    children: React.ReactNode;
    stagger?: number;
    className?: string;
    once?: boolean;
    margin?: string;
}

const containerVariants = (stagger: number): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: stagger,
        },
    },
});

export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export function StaggerChildren({
    children,
    stagger = 0.12,
    className,
    once = true,
    margin = "-80px",
}: StaggerChildrenProps) {
    const shouldReduce = useReducedMotion();

    if (shouldReduce) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            variants={containerVariants(stagger)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
 * StaggerItem — individual item inside a
 * StaggerChildren container.
 * ───────────────────────────────────────────── */

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div variants={staggerItemVariants} className={className}>
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
 * ScaleOnHover — wraps a card to add a smooth
 * scale + glow on hover.
 * ───────────────────────────────────────────── */

interface ScaleOnHoverProps {
    children: React.ReactNode;
    className?: string;
    scale?: number;
}

export function ScaleOnHover({
    children,
    className,
    scale = 1.03,
}: ScaleOnHoverProps) {
    const shouldReduce = useReducedMotion();

    if (shouldReduce) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            whileHover={{ scale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
