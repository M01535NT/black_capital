"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animated counter that scrolls from `from` to `to` once it scrolls
 * into view. Respects `prefers-reduced-motion`. Falls back to `to`
 * after 3s if the IntersectionObserver never fires.
 *
 * SSR renders the final value (`to`) so the first paint is honest
 * with the real number; the count-up animation only runs after the
 * component mounts on the client.
 */
export function Counter({
    from = 0,
    to,
    duration = 2,
    suffix = "",
}: {
    from?: number;
    to: number;
    duration?: number;
    suffix?: string;
}) {
    const shouldReduceMotion = useReducedMotion();
    // Start at `to` to avoid a flash of "0" during SSR / first paint.
    // The animation will reset to `from` and count up once we are
    // hydrated and in view.
    const [count, setCount] = useState(to);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        if (to === 0 || to === from) {
            // No animation needed.
            hasAnimated.current = true;
            setCount(to);
            return;
        }
        if (shouldReduceMotion) {
            hasAnimated.current = true;
            setCount(to);
            return;
        }
        // Reset to `from` so the animation is visible after hydration.
        setCount(from);
        if (isInView) {
            hasAnimated.current = true;
            let startTime: number;
            let rafHandle: number;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min(
                    (timestamp - startTime) / (duration * 1000),
                    1,
                );
                setCount(Math.floor(progress * (to - from) + from));
                if (progress < 1) {
                    rafHandle = window.requestAnimationFrame(step);
                }
            };
            rafHandle = window.requestAnimationFrame(step);
            return () => {
                if (rafHandle) window.cancelAnimationFrame(rafHandle);
            };
        }
        const timer = setTimeout(() => {
            if (!hasAnimated.current) {
                hasAnimated.current = true;
                setCount(to);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isInView, shouldReduceMotion, from, to, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}
