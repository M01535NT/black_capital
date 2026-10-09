"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function SavedProperties() {
  const [open, setOpen] = useState(false);
  const { saved, count, toggle } = useFavorites();
  return (
    <Drawer autoFocus direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button type="button" aria-label={`Abrir guardados (${count})`} className="inline-flex h-11 items-center gap-2 border border-white/12 px-3 text-white/65 transition-colors hover:text-[var(--color-accent)]">
          <Heart className="h-4 w-4" aria-hidden="true" />
          <span className="property-tag-type hidden lg:inline">Guardados</span>
          {count > 0 && <span className="property-tag-type gold-ink">{count}</span>}
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
