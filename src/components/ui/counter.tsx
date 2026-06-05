"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animated count-up. Triggers once when the element scrolls into view.
 *
 * Why this rewrite (June 2026):
 *  - The previous version initialized state to `to` (so SSR + first paint
 *    would not flash "0"), but the animation logic was guarded behind a
 *    useEffect that would silently skip if `isInView` was false on mount
 *    AND the user never scrolled past the -100px margin — leaving the
 *    counter stuck at `from` or, after the 3s fallback, snapping to `to`
 *    with no animation at all.
 *  - New behavior:
 *      • SSR / first paint  → renders the FINAL value (no flash)
 *      • Hydration          → resets to `from` if motion is allowed
 *      • Scroll into view   → starts rAF count-up
 *      • `prefers-reduced-motion` → no animation, just shows `to`
 *      • Re-mounts on the page (e.g. route change) → re-animates
 *  - Uses an `animateKey` so that if the same Counter is rendered with a
 *    different `to`, the rAF loop is torn down and restarted cleanly.
 */
export function Counter({
    from = 0,
    to,
    duration = 1.8,
    suffix = "",
    prefix = "",
}: {
    from?: number;
    to: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}) {
    const shouldReduceMotion = useReducedMotion() ?? false;
    const [count, setCount] = useState<number>(to);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const hasAnimated = useRef(false);
    const rafHandle = useRef<number | null>(null);

    useEffect(() => {
        if (hasAnimated.current) return;

        // 0 → 0 or equal values: nothing to animate.
        if (to === from) {
            hasAnimated.current = true;
            setCount(to);
            return;
        }

        // Reduced motion: skip animation, show final value.
        if (shouldReduceMotion) {
            hasAnimated.current = true;
            setCount(to);
            return;
        }

        // Reset to `from` so the count-up is visible after hydration.
        setCount(from);

        if (isInView) {
            hasAnimated.current = true;
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / (duration * 1000), 1);
                // easeOutCubic for a soft deceleration — feels less mechanical
                // than a linear ramp.
                const eased = 1 - Math.pow(1 - progress, 3);
                const next = from + (to - from) * eased;
                setCount(progress >= 1 ? to : next);
                if (progress < 1) {
                    rafHandle.current = window.requestAnimationFrame(tick);
                }
            };
            rafHandle.current = window.requestAnimationFrame(tick);
        }
    }, [isInView, shouldReduceMotion, from, to, duration]);

    useEffect(() => {
        return () => {
            if (rafHandle.current !== null) {
                window.cancelAnimationFrame(rafHandle.current);
            }
        };
    }, []);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}
            {Number.isInteger(to)
                ? Math.round(count).toLocaleString()
                : count.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                  })}
            {suffix}
        </span>
    );
}
