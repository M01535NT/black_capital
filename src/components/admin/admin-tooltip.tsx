"use client";

import { ReactNode } from "react";

export function AdminTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap border border-white/[0.08] bg-[#0b0b0b] px-2.5 py-1.5 text-[11px] font-semibold text-white/70 opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </span>
  );
}
