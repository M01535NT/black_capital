"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, DollarSign, Percent } from "lucide-react";

interface MortgageCalculatorProps {
  price: number;
  currency: string;
  businessType?: string;
}

export function MortgageCalculator({
  price,
  currency,
}: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(15);
  const [interestRate, setInterestRate] = useState(11.5);

  // Calculation
  const loanAmount = useMemo(() => {
    return price * (1 - downPayment / 100);
  }, [price, downPayment]);

  const monthlyPayment = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return loanAmount / n;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, interestRate, years]);

  const totalPayment = monthlyPayment * years * 12;
  const totalInterest = totalPayment - loanAmount;
  const ltv = loanAmount / price;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    return formatCurrency(amount);
  };

  const termOptions = [10, 15, 20, 25];
  const rateOptions = [
    { label: "Banco tradicional", value: 11.5 },
    { label: "Hipoteca verde", value: 9.9 },
    { label: "SOFIPO", value: 13 },
  ];

  return (
    <div className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-card to-background-elevated p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-[var(--color-accent)]" />
            Calculadora Hipotecaria
          </h3>
          <p className="text-sm text-muted-foreground">
            Simula tu pago mensual basado en el precio de la propiedad
          </p>
        </div>
      </div>

      {/* Down Payment Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[var(--color-accent)]" />
            Enganche
          </label>
          <span className="text-sm font-numerics font-semibold text-[var(--color-accent)]">
            {downPayment}% ({formatCompact(price * downPayment / 100)})
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full h-2 bg-foreground/10 rounded-full appearance-none cursor-pointer slider-gold"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Term Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground block">
          Plazo (años)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {termOptions.map((term) => (
            <button
              key={term}
              onClick={() => setYears(term)}
              className={`py-2 rounded-lg border transition-all ${
                years === term
                  ? "bg-[var(--color-accent)] text-background border-[var(--color-accent)] font-semibold"
                  : "bg-transparent text-foreground/70 border-foreground/10 hover:border-foreground/30"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Percent className="w-4 h-4 text-[var(--color-accent)]" />
          Tasa de interés anual
        </label>
        <div className="grid grid-cols-3 gap-2">
          {rateOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setInterestRate(value)}
              className={`py-2 px-3 rounded-lg border transition-all text-sm ${
                Math.abs(interestRate - value) < 0.1
                  ? "bg-[var(--color-accent)] text-background border-[var(--color-accent)] font-semibold"
                  : "bg-transparent text-foreground/70 border-foreground/10 hover:border-foreground/30"
              }`}
            >
              {value}%
              <span className="block text-xs opacity-80 mt-0.5">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 pt-4 border-t border-foreground/10">
        {/* Monthly Payment - Hero */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Pago mensual estimado
          </p>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={monthlyPayment}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-numerics text-4xl font-bold text-[var(--color-accent)]"
            >
              {formatCurrency(monthlyPayment)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-foreground/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">Monto del crédito</p>
            <p className="font-semibold text-foreground">
              {formatCompact(loanAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-foreground/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">Total a pagar</p>
            <p className="font-semibold text-foreground">
              {formatCompact(totalPayment)}
            </p>
          </div>
          <div className="rounded-lg bg-foreground/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">Intereses totales</p>
            <p className="font-semibold text-foreground">
              {formatCompact(totalInterest)}
            </p>
          </div>
          <div className="rounded-lg bg-foreground/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">LTV (Loan-to-Value)</p>
            <p
              className={`font-semibold ${
                ltv > 0.8 ? "text-red-400" : "text-foreground"
              }`}
            >
              {(ltv * 100).toFixed(0)}%
              {ltv > 0.8 && (
                <span className="text-xs text-red-400 ml-1">⚠️</span>
              )}
            </p>
          </div>
        </div>

        {/* LTV Warning */}
        {ltv > 0.8 && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
            <strong>Nota:</strong> Un LTV superior al 80% generalmente requiere
            seguro hipotecario y puede dificultar la aprobación del crédito.
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground italic">
          Cálculo orientativo. La cuota real depende del banco, tu historial
          crediticio y seguros. No incluye gastos notariales ni avalúo.
        </p>
      </div>
    </div>
  );
}
