"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const counters = [
  {
    label: "Propiedades",
    value: 24,
    suffix: "+",
    verb: "Custodiadas",
  },
  {
    label: "Superficie",
    value: 18000,
    suffix: "M²",
    verb: "Comercializados",
  },
  {
    label: "Clientes",
    value: 70,
    suffix: "+",
    verb: "Acompañados",
  },
  {
    label: "Años",
    value: 8,
    suffix: "",
    verb: "Operando",
  },
];

function formatCount(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

function useCountUp(target: number, durationMs = 2200) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const [started, setStarted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    if (shouldReduceMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const fallback = window.setTimeout(() => {
      setValue(target);
      setShouldAnimate(false);
      setStarted(true);
    }, 1800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.clearTimeout(fallback);
        setValue(0);
        setShouldAnimate(true);
        setStarted(true);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [shouldReduceMotion, started, target]);

  useEffect(() => {
    if (!started || !shouldAnimate || shouldReduceMotion) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, shouldAnimate, shouldReduceMotion, started, target]);

  return [ref, value] as const;
}

function CounterItem({
  label,
  value,
  suffix,
  verb,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  verb: string;
  index: number;
}) {
  const [counterRef, count] = useCountUp(value);
  const formatted = formatCount(count);

  return (
    <div
      ref={counterRef}
      className="relative flex min-w-0 flex-col items-center justify-center px-5 py-7 text-center sm:py-8 lg:px-8"
    >
      {index > 0 ? (
        <span className="absolute left-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent lg:block" />
      ) : null}
      {index % 2 === 1 ? (
        <span className="absolute left-0 top-1/2 h-14 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--color-accent)]/25 to-transparent lg:hidden" />
      ) : null}
      {index > 1 ? (
        <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent lg:hidden" />
      ) : null}

      <p className="flex items-baseline justify-center gap-1.5">
        <span className="metallic-gold-static gold-glow font-display text-stat-lg font-extrabold uppercase leading-none tabular-nums tracking-[0.02em]">
          {formatted}
        </span>
        {suffix ? (
          <span className="metallic-gold-static font-display text-caption font-extrabold uppercase leading-none">
            {suffix}
          </span>
        ) : null}
      </p>
      <p className="mt-3 property-tag-type text-white/55">
        {label} <span className="text-white/85">/ {verb}</span>
      </p>
    </div>
  );
}

export function HomeCounters() {
  return (
    <section
      aria-label="Indicadores comerciales Black Capital"
      className="relative border-y border-white/[0.04] bg-white/[0.015]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
      />
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 lg:grid-cols-4">
        {counters.map((counter, index) => (
          <CounterItem key={counter.label} {...counter} index={index} />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
      />
    </section>
  );
}
