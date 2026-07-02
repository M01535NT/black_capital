"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";

interface MortgageCalculatorProps {
  price: number;
  currency: string;
  businessType?: string;
}

function Slider({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  ariaLabel,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="property-tag-type text-white/55">{label}</span>
        <span className="font-display text-body-sm font-bold text-[var(--color-accent)]">
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        aria-valuetext={valueLabel}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-gold h-1 w-full cursor-pointer appearance-none bg-white/[0.14]"
      />
    </div>
  );
}

/**
 * Calculadora de financiamiento estilo "Propiedad Editorial Black" (sección 05):
 * mensualidad protagonista a la izquierda, tres sliders a la derecha,
 * esquinas cuadradas y densidad compacta.
 */
export function MortgageCalculator({ price, currency }: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(10.5);

  const downAmount = price * (downPayment / 100);
  const loanAmount = price - downAmount;

  const monthlyPayment = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return loanAmount / n;
    return (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  }, [loanAmount, rate, years]);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "MXN",
      maximumFractionDigits: 0,
    }).format(amount);

  const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
    `Hola, quiero solicitar preaprobación de crédito. Precio ${fmt(price)}, enganche ${downPayment}%, plazo ${years} años.`,
  )}`;

  return (
    <div className="border border-white/[0.08] bg-white/[0.02]">
      <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        {/* Resultado protagonista */}
        <div>
          <p className="property-tag-type text-white/55">Mensualidad estimada</p>
          <p
            aria-live="polite"
            className="mt-2 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-black leading-none tabular-nums gold-ink"
          >
            {fmt(monthlyPayment)}
          </p>
          <div
            className="mt-5 flex h-1.5 overflow-hidden bg-white/[0.12]"
            role="img"
            aria-label={`Enganche ${downPayment} por ciento del precio`}
          >
            <div
              className="gold-gradient h-full transition-[width] duration-300"
              style={{ width: `${downPayment}%` }}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap justify-between gap-x-6 gap-y-1 text-body-sm text-white/55">
            <span>
              <span className="font-semibold text-[var(--color-accent)]">Enganche</span>{" "}
              {fmt(downAmount)}
            </span>
            <span>Financiar {fmt(loanAmount)}</span>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 gold-gradient px-5 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] text-black transition-[filter] hover:brightness-110"
          >
            Solicitar preaprobación
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-6 border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <Slider
            label="Enganche"
            valueLabel={`${downPayment}% · ${fmt(downAmount)}`}
            min={10}
            max={40}
            step={5}
            value={downPayment}
            onChange={setDownPayment}
            ariaLabel="Porcentaje de enganche"
          />
          <Slider
            label="Plazo"
            valueLabel={`${years} años`}
            min={5}
            max={25}
            step={5}
            value={years}
            onChange={setYears}
            ariaLabel="Plazo en años"
          />
          <Slider
            label="Tasa anual"
            valueLabel={`${rate.toFixed(2)}%`}
            min={8}
            max={14}
            step={0.25}
            value={rate}
            onChange={setRate}
            ariaLabel="Tasa de interés anual"
          />
          <p className="text-[0.72rem] leading-relaxed text-white/40">
            Estimación referencial sobre {fmt(price)}. Sujeto a aprobación
            crediticia; no incluye gastos notariales, avalúo ni seguros.
          </p>
        </div>
      </div>
    </div>
  );
}
