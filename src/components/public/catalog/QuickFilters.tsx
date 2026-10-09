"use client";

import { USES, BUSINESS_TYPES } from "@/lib/property-constants";
import { CURRENCY_OPTIONS, type Filters } from "./constants";

const inputStyle = "mt-2 h-11 w-full min-w-0 border border-white/[0.1] bg-background px-3 text-body-sm text-white outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-40";

export function QuickFilters({ filters, onUpdate }: { filters: Filters; onUpdate: (patch: Partial<Filters>) => void }) {
  return <div aria-label="Filtros rápidos" className="mb-6 hidden grid-cols-3 gap-3 border-b border-white/[0.08] pb-6 lg:grid xl:grid-cols-6">
    <label className="property-tag-type text-white/60">Operación
      <select aria-label="Operación" value={filters.tipo || ""} onChange={e => onUpdate({ tipo: e.target.value || null })} className={inputStyle}>
        <option value="">Todas</option>{BUSINESS_TYPES.map(value => <option key={value}>{value}</option>)}
      </select>
    </label>
    <label className="property-tag-type text-white/60">Segmento
      <select aria-label="Segmento" value={filters.uso || ""} onChange={e => onUpdate({ uso: e.target.value || null })} className={inputStyle}>
        <option value="">Todos</option>{USES.map(value => <option key={value}>{value}</option>)}
      </select>
    </label>
    <label className="property-tag-type text-white/60">Zona
      <input aria-label="Zona" placeholder="Colonia o zona" value={filters.zona} onChange={e => onUpdate({ zona: e.target.value })} className={inputStyle} />
    </label>
    <label className="property-tag-type text-white/60">Moneda
      <select aria-label="Moneda" value={filters.moneda || ""} onChange={e => onUpdate({ moneda: e.target.value || null })} className={inputStyle}>
        <option value="">Elegir moneda</option>{CURRENCY_OPTIONS.map(value => <option key={value}>{value}</option>)}
      </select>
    </label>
    <label className="property-tag-type text-white/60">Precio mínimo
      <input aria-label="Precio mínimo" type="number" min="0" disabled={!filters.moneda} value={filters.precioMin} onChange={e => onUpdate({ precioMin: e.target.value })} placeholder={filters.moneda || "Elige moneda"} className={inputStyle} />
    </label>
    <label className="property-tag-type text-white/60">Precio máximo
      <input aria-label="Precio máximo" type="number" min="0" disabled={!filters.moneda} value={filters.precioMax} onChange={e => onUpdate({ precioMax: e.target.value })} placeholder={filters.moneda || "Elige moneda"} className={inputStyle} />
    </label>
  </div>;
}
