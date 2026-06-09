"use client";

import { useEffect, useRef, useState } from "react";

const counters = [
  {
    label: "Negocios cerrados",
    value: 24,
    suffix: "+",
    copy: "Operaciones acompañadas.",
  },
  {
    label: "M² comercializados",
    value: 18000,
    suffix: "+",
    copy: "Residencial, comercial e industrial.",
  },
  {
    label: "Clientes atendidos",
    value: 70,
    suffix: "+",
    copy: "Compradores, vendedores y arrendadores.",
  },
  {
    label: "Servicios ofrecidos",
    value: 6,
    suffix: "+",
    copy: "Compra, venta, renta y dictamen.",
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

function CounterCard({
  label,
  value,
  suffix,
  copy,
}: {
  label: string;
  value: number;
  suffix: string;
  copy: string;
}) {
  const [counterRef, count] = useCountUp(value);

  return (
    <div ref={counterRef} className="flex min-h-[190px] flex-col items-center justify-center border border-white/[0.08] bg-white/[0.025] p-5 text-center">
      <p className="mb-4 property-tag-type text-white/42">
        {label}
      </p>
      <p className="text-display-1 leading-none metallic-gold-static gold-glow">
        {formatCount(count)}
        <span className="text-display-4 align-baseline metallic-gold-static gold-glow">{suffix}</span>
      </p>
      <p className="mt-5 max-w-[14rem] text-body text-white/58 leading-relaxed">{copy}</p>
    </div>
  );
}

export function HomeCounters() {
  return (
    <section className="mx-auto max-w-[90rem] px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-caption text-[var(--color-accent)]">
          Indicadores comerciales
        </p>
        <h2 className="text-display-2 leading-display tracking-headline text-white">
          Resultados en movimiento.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-body text-white/58">
          Cifras de referencia para mostrar alcance, experiencia y capacidad de asesoría.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {counters.map((counter) => (
          <CounterCard key={counter.label} {...counter} />
        ))}
      </div>
    </section>
  );
}

