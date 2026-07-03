"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { USES, BUSINESS_TYPES } from "@/lib/property-constants";
import {
  CURRENCY_OPTIONS,
  STATUS_OPTIONS,
  pillBase,
  pillActive,
  pillInactive,
  hasAnyFilter,
  type Filters,
} from "./constants";

interface FilterPanelProps {
  filters: Filters;
  availableTypes: string[];
  resultCount: number;
  onUpdate: (patch: Partial<Filters>) => void;
  onClear: () => void;
  onClose: () => void;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/[0.07] py-5 first:border-t-0 first:pt-0">
      <p className="mb-3 property-tag-type text-white/40">{label}</p>
      {children}
    </div>
  );
}

/** Grupo de selección única con opción "todas". Toggle: reelegir el activo lo limpia. */
function PillGroup({
  options,
  value,
  onChange,
  allLabel,
  columns = 3,
}: {
  options: readonly { label: string; value: string }[];
  value: string | null;
  onChange: (next: string | null) => void;
  allLabel: string;
  columns?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={!value}
        className={cn(pillBase, "w-full", !value ? pillActive : pillInactive)}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          aria-pressed={value === opt.value}
          className={cn(pillBase, "w-full", value === opt.value ? pillActive : pillInactive)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const numberInput =
  "h-11 w-full border border-white/[0.1] bg-background/70 px-4 text-body-sm text-white outline-none transition-colors duration-200 ease-out placeholder:text-white/35 focus:border-[var(--color-accent)]";

export function FilterPanel({
  filters,
  availableTypes,
  resultCount,
  onUpdate,
  onClear,
  onClose,
}: FilterPanelProps) {
  const toOpt = (v: string) => ({ label: v, value: v });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
        <p className="property-tag-type gold-ink">Filtros</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar filtros"
          className="flex h-9 w-9 items-center justify-center border border-white/12 text-white/65 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <Section label="Operación">
          <PillGroup
            options={BUSINESS_TYPES.map(toOpt)}
            value={filters.tipo}
            onChange={(v) => onUpdate({ tipo: v })}
            allLabel="Todo"
          />
        </Section>

        <Section label="Uso">
          <PillGroup
            options={USES.map(toOpt)}
            value={filters.uso}
            onChange={(v) => onUpdate({ uso: v })}
            allLabel="Todos"
          />
        </Section>

        {availableTypes.length > 0 && (
          <Section label="Tipo de inmueble">
            <PillGroup
              options={availableTypes.map(toOpt)}
              value={filters.propiedad}
              onChange={(v) => onUpdate({ propiedad: v })}
              allLabel="Todos"
              columns={2}
            />
          </Section>
        )}

        <Section label="Estatus">
          <PillGroup
            options={STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.value }))}
            value={filters.estatus}
            onChange={(v) => onUpdate({ estatus: v })}
            allLabel="Todos"
            columns={2}
          />
        </Section>

        <Section label="Moneda">
          <PillGroup
            options={CURRENCY_OPTIONS.map(toOpt)}
            value={filters.moneda}
            onChange={(v) => onUpdate({ moneda: v })}
            allLabel="Ambas"
          />
        </Section>

        <Section label="Precio">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Mínimo"
              aria-label="Precio mínimo"
              value={filters.precioMin}
              onChange={(e) => onUpdate({ precioMin: e.target.value })}
              className={numberInput}
            />
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Máximo"
              aria-label="Precio máximo"
              value={filters.precioMax}
              onChange={(e) => onUpdate({ precioMax: e.target.value })}
              className={numberInput}
            />
          </div>
        </Section>

        <Section label="Superficie">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="m² mínimo"
            aria-label="Metros cuadrados mínimos"
            value={filters.m2Min}
            onChange={(e) => onUpdate({ m2Min: e.target.value })}
            className={numberInput}
          />
        </Section>
      </div>

      <div className="flex items-center gap-3 border-t border-white/[0.08] p-4">
        {hasAnyFilter(filters) && (
          <button
            type="button"
            onClick={onClear}
            className="group inline-flex min-h-11 shrink-0 items-center property-tag-type text-white/65 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
          >
            <span className="relative pb-0.5">
              Limpiar
              <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-40 transition-opacity duration-200 group-hover:opacity-100" />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="brushed-gold premium-cta ml-auto inline-flex min-h-11 flex-1 items-center justify-center rounded-none active:scale-[0.98]"
        >
          Ver {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
        </button>
      </div>
    </div>
  );
}
