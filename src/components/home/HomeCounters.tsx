"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const counters = [
  {
    value: 24,
    suffix: "+",
    label: "Propiedades en custodia",
  },
  {
    value: 18000,
    suffix: " m²",
    label: "Superficie comercializada",
  },
  {
    value: 70,
    suffix: "+",
    label: "Clientes acompañados",
  },
  {
    value: 8,
    suffix: "",
    label: "Años operando",
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
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  index: number;
}) {
  const [counterRef, count] = useCountUp(value);
  const formatted = formatCount(count);

  return (
    <div
      ref={counterRef}
      className={`relative min-w-0 border-white/[0.08] px-6 py-9 sm:px-8 ${
        index % 2 === 0 ? "border-r" : ""
      } ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
    >
      <p className="flex items-baseline gap-0.5">
        <span className="font-display text-[clamp(2rem,4.5vw,2.75rem)] font-extrabold leading-none tabular-nums text-white">
          {formatted}
        </span>
        {suffix ? (
          <span className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-none gold-ink">
            {suffix}
          </span>
        ) : null}
      </p>
      <p className="mt-3 property-tag-type text-white/50">{label}</p>
    </div>
  );
}

export function HomeCounters() {
  return (
    <section
      aria-label="Indicadores comerciales Black Capital"
      className="border-b border-white/[0.08] bg-white/[0.015]"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 lg:grid-cols-4">
        {counters.map((counter, index) => (
          <CounterItem key={counter.label} {...counter} index={index} />
        ))}
      </div>
    </section>
  );
}
