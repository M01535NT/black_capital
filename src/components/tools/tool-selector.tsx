"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MortgageCalculator } from "./mortgage-calculator";
import { FlippingSimulator, IsaiCalculator, RoiCalculator } from "./investment-calculators";

const calculators = [
  { id: "hipoteca", title: "Hipoteca", description: "Mensualidad, enganche, tasa y plazo." },
  { id: "roi", title: "Rendimiento de renta", description: "Renta, gastos y retorno estimado." },
  { id: "flipping", title: "Compra y remodelación", description: "Compra, mejora y venta de una propiedad." },
  { id: "isai", title: "Impuestos", description: "Estimación del impuesto de adquisición." },
] as const;

function subscribeToHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}

function MortgageTool() {
  const [price, setPrice] = useState("1700000");
  const [currency, setCurrency] = useState("MXN");
  return (
    <article id="hipoteca" className="scroll-mt-28 border border-white/[0.08] bg-black/25">
      <header className="border-b border-white/[0.08] p-5 sm:p-6">
        <p className="property-tag-type text-[var(--color-accent)]">Financiamiento</p>
        <h3 className="mt-2 text-display-3 text-white">Hipoteca</h3>
        <p className="mt-2 text-body-sm text-white/55">Estima tu mensualidad con el precio, enganche, plazo y tasa de tu escenario.</p>
      </header>
      <div className="space-y-6 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
          <label className="block">
            <span className="property-tag-type text-white/48">Precio del inmueble</span>
            <input type="number" min="0" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 h-11 w-full min-w-0 border border-white/[0.1] bg-white/[0.03] px-3 text-body text-white outline-none focus:border-[var(--color-accent)]" />
          </label>
          <label className="block">
            <span className="property-tag-type text-white/48">Moneda</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="mt-2 h-11 w-full border border-white/[0.1] bg-black px-3 text-body text-white focus:border-[var(--color-accent)]">
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </div>
        <MortgageCalculator price={Math.max(0, Number(price) || 0)} currency={currency} />
        <p className="text-body-sm leading-relaxed text-white/45">Supuestos: tasa fija, pagos mensuales y amortización durante el plazo seleccionado. Los valores iniciales son un ejemplo, no una oferta de crédito. La moneda indica la unidad de tus importes; no convierte precios.</p>
      </div>
    </article>
  );
}

export function ToolSelector() {
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash.slice(1), () => "");
  const requested = searchParams.get("calculadora") ?? hash;
  const selected = calculators.find((calculator) => calculator.id === requested) ?? calculators[0];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-0 lg:border lg:border-white/[0.08]">
      <aside className="border border-white/[0.08] bg-black/35 lg:border-0 lg:border-r">
        <nav aria-label="Elegir calculadora" className="grid grid-cols-2 gap-px bg-white/[0.08] lg:sticky lg:top-28 lg:grid-cols-1">
          {calculators.map((calculator, index) => (
            <Link key={calculator.id} href={`?calculadora=${calculator.id}`} scroll={false} aria-current={selected.id === calculator.id ? "page" : undefined} className={`group min-w-0 p-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] lg:p-5 ${selected.id === calculator.id ? "bg-[#18150a] text-[var(--color-accent)]" : "bg-[#080808] text-white/58 hover:text-[var(--color-accent)]"}`}>
              <span className="hidden property-tag-type lg:block" aria-hidden="true">0{index + 1}</span>
              <span className="block text-body font-semibold lg:mt-3">{calculator.title}</span>
              <span className="mt-2 hidden text-body-sm text-white/55 lg:block" aria-hidden="true">{calculator.description}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 border border-white/[0.08] lg:border-0">
        <div className="p-3 sm:p-6 lg:p-8">
          <div hidden={selected.id !== "hipoteca"}><MortgageTool /></div>
          <div hidden={selected.id !== "roi"}><RoiCalculator /></div>
          <div hidden={selected.id !== "flipping"}><FlippingSimulator /></div>
          <div hidden={selected.id !== "isai"}><IsaiCalculator /></div>
        </div>
        <footer className="grid grid-cols-1 border-t border-white/[0.08] bg-black/30 xl:grid-cols-[1fr_auto]">
          <p className="p-4 text-body text-white/56 sm:p-6">Resultados orientativos. Confirma cifras finales con asesoría fiscal, legal e inmobiliaria.</p>
          <Link href={`/contacto?objetivo=asesoria&interes=herramientas&calculadora=${selected.id}`} className="inline-flex min-h-14 items-center justify-center gap-3 border-t border-white/[0.08] px-6 py-4 property-tag-type text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black xl:border-l xl:border-t-0">
            Pedir orientación <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
