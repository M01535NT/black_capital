"use client";

import { X } from "lucide-react";
import type { ActiveChip, Filters } from "./constants";

interface ActiveChipsProps {
  chips: ActiveChip[];
  onRemove: (key: keyof Filters) => void;
  onClearAll: () => void;
}

export function ActiveChips({ chips, onRemove, onClearAll }: ActiveChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="group inline-flex items-center gap-1.5 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] py-1.5 pl-3 pr-2 property-tag-type text-white/85 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/60 active:scale-[0.98]"
          aria-label={`Quitar filtro ${chip.label}`}
        >
          <span className="normal-case">{chip.label}</span>
          <X className="size-3.5 text-[var(--color-accent)] transition-transform duration-200 group-hover:rotate-90" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="group ml-1 inline-flex items-center property-tag-type text-white/55 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
        >
          <span className="relative pb-0.5">
            Limpiar todo
            <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-40 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
        </button>
      )}
    </div>
  );
}
