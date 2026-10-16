"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function SavedProperties({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const { saved, count, toggle } = useFavorites();
  return (
    <Drawer autoFocus direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button type="button" aria-label={`Abrir guardados (${count})`} className={`relative inline-flex h-11 items-center border border-white/20 text-white/75 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] ${compact ? "w-11 justify-center" : "gap-2 rounded-full px-3"}`}>
          <Heart className="h-4 w-4" aria-hidden="true" />
          {!compact && <span className="property-tag-type hidden lg:inline">Guardados</span>}
          {count > 0 && <span className={compact ? "absolute -right-1 -top-1 min-w-4 bg-[var(--color-accent)] px-1 text-[10px] leading-4 text-black" : "property-tag-type gold-ink"}>{count}</span>}
        </button>
      </DrawerTrigger>
      <DrawerContent accessibleTitle="Propiedades guardadas" className="z-[70] w-[92%] border-[var(--color-accent)]/20 bg-background sm:max-w-md">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-6">
          <h2 className="property-tag-type gold-ink">Propiedades guardadas ({count})</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar guardados" className="flex h-11 w-11 items-center justify-center border border-white/12"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-6 text-body-sm text-white/60">Tu selección se guarda en este navegador.</p>
          {saved.length === 0 ? <p className="text-body">Todavía no has guardado propiedades.</p> : (
            <ul className="space-y-4">{saved.map(property => <li key={property.id} className="flex items-start gap-3 border border-white/10 p-5">
              <Link href={property.href} onClick={() => setOpen(false)} className="flex-1 text-body-sm text-white transition-colors hover:text-[var(--color-accent)]">{property.title}</Link>
              <button type="button" onClick={() => toggle(property.id)} aria-label={`Quitar ${property.title}`} className="flex h-10 w-10 shrink-0 items-center justify-center text-white/60 hover:text-[var(--color-accent)]"><X className="h-4 w-4" /></button>
            </li>)}</ul>
          )}
        </div>
        <Link href="/inventario" onClick={() => setOpen(false)} className="brushed-gold premium-cta m-6 inline-flex min-h-11 items-center justify-center">Explorar propiedades</Link>
      </DrawerContent>
    </Drawer>
  );
}
