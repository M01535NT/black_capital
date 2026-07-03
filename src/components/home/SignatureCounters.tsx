"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CONTACT_CONFIG } from "@/lib/contact-config";

const counters = [
  { value: 24, suffix: "+", label: "Propiedades en custodia" },
  { value: 18000, suffix: " m²", label: "Superficie comercializada" },
  { value: 70, suffix: "+", label: "Clientes acompañados" },
  { value: CONTACT_CONFIG.business.yearsInBusiness, suffix: "", label: "Años operando" },
];

function formatCount(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

/** Count-up 0→total al entrar en viewport (firma del cliente, lógica intacta). */
function useCountUp(target: number, durationMs = 2200) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const [started, setStarted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    if (shouldReduceMotion || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setValue(0);
        setShouldAnimate(true);
        setStarted(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldReduceMotion, started, target]);

  useEffect(() => {
    if (!started || !shouldAnimate || shouldReduceMotion) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
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
  return (
    <div
      ref={counterRef}
      className={`relative min-w-0 border-white/[0.08] px-6 py-10 sm:px-8 lg:py-14 ${
        index % 2 === 0 ? "border-r" : ""
      } ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
    >
      <p className="flex items-baseline gap-0.5">
        <span className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-none tabular-nums text-white">
          {formatCount(count)}
        </span>
        {suffix ? (
          <span className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-none gold-ink">
            {suffix}
          </span>
        ) : null}
      </p>
      <p className="mt-3 property-tag-type text-white/50">{label}</p>
    </div>
  );
}

export function SignatureCounters() {
  return (
    <section
      aria-label="Indicadores comerciales Black Capital"
      className="relative border-b border-white/[0.08] bg-white/[0.015]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent"
      />
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 lg:grid-cols-4">
        {counters.map((counter, index) => (
          <CounterItem key={counter.label} {...counter} index={index} />
        ))}
      </div>
    </section>
  );
}
