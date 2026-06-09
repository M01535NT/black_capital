"use client";

import { useEffect, useRef, useState } from "react";

const counters = [
  {
    label: "Propiedades gestionadas",
    value: 24,
    suffix: "+",
    copy: "Residencial, comercial e industrial.",
  },
  {
    label: "Superficie comercializada",
    value: 18000,
    suffix: "M²",
    copy: "Activos asesorados y comercializados.",
  },
  {
    label: "Clientes atendidos",
    value: 70,
    suffix: "+",
    copy: "Compradores, vendedores y propietarios.",
  },
  {
    label: "Experiencia inmobiliaria",
    value: 8,
    suffix: "AÑOS",
    copy: "Lectura local del mercado de Tijuana.",
  },
];

function formatCount(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

function useCountUp(target: number, durationMs = 2200) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

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
  }, [durationMs, started, target]);

  return [ref, value] as const;
}

function CounterValue({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const formattedValue = formatCount(value);

  return (
    <p className="flex w-full items-end justify-center">
      <span className="inline-flex max-w-full items-end justify-center gap-2 whitespace-nowrap metallic-gold-static gold-glow">
        <span className="font-display text-stat-lg font-extrabold uppercase leading-none tracking-[0.02em] tabular-nums">
          {formattedValue}
        </span>
        <span className="pb-1 font-display text-caption font-extrabold uppercase leading-none sm:pb-1.5">
          {suffix}
        </span>
      </span>
    </p>
  );
}

function CounterItem({
  label,
  value,
  suffix,
  copy,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  copy: string;
  index: number;
}) {
  const [counterRef, count] = useCountUp(value);

  return (
    <div
      ref={counterRef}
      className="group relative flex min-h-[170px] min-w-0 flex-col items-center justify-center px-4 py-4 text-center sm:min-h-[190px] lg:px-6"
    >
      {index > 0 ? (
        <span className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.10] to-transparent xl:block" />
      ) : null}
      {index % 2 === 1 ? (
        <span className="absolute left-0 top-1/2 h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.10] to-transparent xl:hidden" />
      ) : null}
      {index > 1 ? (
        <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent xl:hidden" />
      ) : null}
      <CounterValue value={count} suffix={suffix} />
      <p className="mt-5 property-tag-type text-white/72">
        {label}
      </p>
      <p className="mt-3 max-w-[14rem] text-body text-white/52 leading-relaxed">{copy}</p>
    </div>
  );
}

export function HomeCounters() {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-caption gold-ink">
          Indicadores comerciales
        </p>
        <h2 className="text-display-2 leading-display tracking-headline text-white">
          PRESENCIA Y RESULTADOS
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-body text-white/58">
          Cifras de referencia para mostrar alcance, experiencia y capacidad de asesoría.
        </p>
      </div>

      <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-y-6 border-y border-white/[0.06] py-6 sm:gap-y-8 sm:py-8 lg:py-10 xl:grid-cols-4 xl:gap-y-0">
        {counters.map((counter, index) => (
          <CounterItem key={counter.label} {...counter} index={index} />
        ))}
      </div>
    </section>
  );
}

