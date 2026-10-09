"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export function PropertyFinder() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <button type="button" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/40 bg-black/10 px-6 property-tag-type text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black">
        <Search className="size-4" aria-hidden="true" />Buscar propiedades
      </button>
    </DialogTrigger>
    <DialogContent showCloseButton={false} className="max-h-[90svh] overflow-y-auto rounded-2xl border-white/15 bg-[#0b0b0b] p-6 sm:max-w-2xl sm:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <DialogTitle className="font-display text-display-3 text-white">Encuentra tu espacio.</DialogTitle>
          <DialogDescription className="mt-2 text-body-sm text-white/55">Elige lo que importa para tu búsqueda.</DialogDescription>
        </div>
        <button type="button" aria-label="Cerrar buscador" onClick={() => setOpen(false)} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white"><X className="size-4" /></button>
      </div>
        <form
          action="/inventario"
          method="get"
          role="search"
          aria-label="Buscar propiedades"
          className="grid grid-cols-2 gap-4  sm:grid-cols-2 xl:mt-0 xl:grid-cols-2"
        >
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Operación</span>
            <select name="tipo" defaultValue="Venta" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="Venta">Venta</option>
              <option value="Renta">Renta</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Uso</span>
            <select name="uso" defaultValue="" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="">Todos</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Zona</span>
            <input name="zona" type="search" placeholder="Ej. Zona Río" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Moneda</span>
            <select name="moneda" defaultValue="MXN" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Precio mínimo</span>
            <input name="precioMin" type="number" min="0" step="any" inputMode="decimal" placeholder="Desde" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Precio máximo</span>
            <input name="precioMax" type="number" min="0" step="any" inputMode="decimal" placeholder="Hasta" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <div className="col-span-full flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-stretch">
            <button type="submit" className="brushed-gold premium-cta inline-flex min-h-[52px] items-center justify-center gap-2 rounded-none active:scale-[0.98]">
              Buscar propiedades
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link href="/propietarios" className="group inline-flex w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]">
              <span className="property-tag-type relative pb-1">
                Quiero vender o rentar mi propiedad
                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </form>    </DialogContent>
  </Dialog>;
}
