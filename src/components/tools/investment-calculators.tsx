"use client";

import { useState } from "react";
import { ArrowRightLeft, Percent, ReceiptText } from "lucide-react";

/**
 * Calculadoras funcionales de /herramientas.
 * Los ids #roi, #flipping e #isai son destinos de los links del menú
 * Herramientas del header — no renombrarlos sin actualizar constants.tsx.
 * Resultados orientativos; el disclaimer general vive en la página.
 */

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const pct = (value: number) =>
  Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "—";

function parseAmount(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="property-tag-type text-white/48">{label}</span>
      <span className="mt-2 flex items-center gap-2 border border-white/[0.1] bg-white/[0.03] focus-within:border-[var(--color-accent)]">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full min-w-0 bg-transparent px-3 text-body text-white outline-none placeholder:text-white/30"
        />
        {suffix ? (
          <span className="pr-3 text-body-sm text-white/40">{suffix}</span>
        ) : null}
      </span>
    </label>
  );
}

function ResultRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-white/[0.06] py-3 first:border-t-0">
      <span className="property-tag-type text-white/48">{label}</span>
      <span
        className={
          highlight
            ? "property-price-type gold-ink"
            : "text-body font-semibold tabular-nums text-white/85"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ToolShell({
  id,
  icon: Icon,
  category,
  title,
  description,
  children,
}: {
  id: string;
  icon: typeof Percent;
  category: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-28 border border-white/[0.08] bg-black/25"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
        <div>
          <p className="property-tag-type text-[var(--color-accent)]">{category}</p>
          <h3 className="mt-2 text-display-3 text-white">{title}</h3>
          <p className="mt-2 max-w-md text-body-sm text-white/55">{description}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10">
          <Icon className="size-4 text-[var(--color-accent)]" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </header>
      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-2">{children}</div>
    </article>
  );
}

function RoiCalculator() {
  const [price, setPrice] = useState("1700000");
  const [rent, setRent] = useState("14000");
  const [expenses, setExpenses] = useState("28000");

  const p = parseAmount(price);
  const annualRent = parseAmount(rent) * 12;
  const annualExpenses = parseAmount(expenses);
  const gross = p > 0 ? annualRent / p : NaN;
  const net = p > 0 ? (annualRent - annualExpenses) / p : NaN;

  return (
    <ToolShell
      id="roi"
      icon={Percent}
      category="Inversión"
      title="Calculadora ROI"
      description="Retorno anual de una propiedad en renta: bruto y neto de gastos."
    >
      <div className="space-y-4">
        <Field label="Precio de compra" value={price} onChange={setPrice} suffix="MXN" />
        <Field label="Renta mensual" value={rent} onChange={setRent} suffix="MXN" />
        <Field
          label="Gastos anuales (predial, mantenimiento, administración)"
          value={expenses}
          onChange={setExpenses}
          suffix="MXN"
        />
      </div>
      <div aria-live="polite">
        <ResultRow label="Renta anual" value={mxn.format(annualRent)} />
        <ResultRow label="ROI bruto" value={pct(gross)} />
        <ResultRow label="ROI neto / cap rate" value={pct(net)} highlight />
      </div>
    </ToolShell>
  );
}

function FlippingSimulator() {
  const [buy, setBuy] = useState("1500000");
  const [rehab, setRehab] = useState("250000");
  const [sale, setSale] = useState("2300000");
  const [months, setMonths] = useState("8");
  const [sellCostPct, setSellCostPct] = useState("6");

  const totalIn = parseAmount(buy) + parseAmount(rehab);
  const saleN = parseAmount(sale);
  const sellCosts = saleN * (parseAmount(sellCostPct) / 100);
  const profit = saleN - sellCosts - totalIn;
  const roi = totalIn > 0 ? profit / totalIn : NaN;
  const m = parseAmount(months);
  const annualized = totalIn > 0 && m > 0 ? roi * (12 / m) : NaN;

  return (
    <ToolShell
      id="flipping"
      icon={ArrowRightLeft}
      category="Inversión"
      title="Simulador Flipping"
      description="Utilidad y retorno de comprar, remodelar y revender."
    >
      <div className="space-y-4">
        <Field label="Precio de compra" value={buy} onChange={setBuy} suffix="MXN" />
        <Field label="Remodelación y cierre" value={rehab} onChange={setRehab} suffix="MXN" />
        <Field label="Precio de venta esperado" value={sale} onChange={setSale} suffix="MXN" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duración (meses)" value={months} onChange={setMonths} />
          <Field label="Costos de venta" value={sellCostPct} onChange={setSellCostPct} suffix="%" />
        </div>
      </div>
      <div aria-live="polite">
        <ResultRow label="Inversión total" value={mxn.format(totalIn)} />
        <ResultRow label="Costos de venta" value={mxn.format(sellCosts)} />
        <ResultRow label="Utilidad estimada" value={mxn.format(profit)} highlight />
        <ResultRow label="ROI del proyecto" value={pct(roi)} />
        <ResultRow label="ROI anualizado" value={pct(annualized)} />
      </div>
    </ToolShell>
  );
}

function IsaiCalculator() {
  const [value, setValue] = useState("1700000");
  const [rate, setRate] = useState("2");

  const v = parseAmount(value);
  const isai = v * (parseAmount(rate) / 100);

  return (
    <ToolShell
      id="isai"
      icon={ReceiptText}
      category="Impuestos"
      title="Calculadora ISAI"
      description="Impuesto sobre adquisición de inmuebles al comprar en Tijuana."
    >
      <div className="space-y-4">
        <Field label="Valor de la operación" value={value} onChange={setValue} suffix="MXN" />
        <Field label="Tasa aplicable" value={rate} onChange={setRate} suffix="%" />
        <p className="text-body-sm leading-relaxed text-white/45">
          La tasa referencial en Tijuana ronda el 2% sobre el valor más alto
          entre operación, catastral y avalúo. El cálculo notarial final puede
          variar por actualización de tarifas y del valor catastral.
        </p>
      </div>
      <div aria-live="polite">
        <ResultRow label="Base gravable" value={mxn.format(v)} />
        <ResultRow label="ISAI estimado" value={mxn.format(isai)} highlight />
      </div>
    </ToolShell>
  );
}

export function InvestmentCalculators() {
  return (
    <div className="grid grid-cols-1 gap-5">
      <RoiCalculator />
      <FlippingSimulator />
      <IsaiCalculator />
    </div>
  );
}
