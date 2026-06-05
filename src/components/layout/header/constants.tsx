"use client";

import { Home, Building2, Warehouse, Calculator, ArrowRightLeft, Percent, Phone } from "lucide-react";

export const baseLinks = [
  { name: "Inicio", href: "/" },
  { name: "Proyectos", href: "/inventario" },
];

export const ventaDropdown = [
  { name: "Residencial", href: "/black-luxury", icon: Home },
  { name: "Comercial", href: "/black-business", icon: Building2 },
  { name: "Industrial", href: "/black-industrial", icon: Warehouse },
];

export const rentaDropdown = [
  { name: "Residencial", href: "/black-luxury", icon: Home },
  { name: "Comercial", href: "/black-business", icon: Building2 },
  { name: "Industrial", href: "/black-industrial", icon: Warehouse },
];

export const herramientasDropdown = [
  { name: "Calculadora ROI", href: "/herramientas#roi", icon: Percent },
  { name: "Simulador Flipping", href: "/herramientas#flipping", icon: ArrowRightLeft },
  { name: "Calculadora ISAI", href: "/herramientas#isai", icon: Calculator },
];

export const verticales = [
  { name: "Black Luxury", href: "/black-luxury", desc: "Residencias trofeo y super lujo" },
  { name: "Black Business", href: "/black-business", desc: "Activos corporativos clase A" },
  { name: "Black Industrial", href: "/black-industrial", desc: "Naves y parques logisticos" },
];

export const corporativoLinks = [
  { name: "Nosotros", href: "/nosotros" },
  { name: "Aviso de Privacidad", href: "/legal/privacidad" },
  { name: "Terminos de Uso", href: "/legal/terminos" },
];

export type DropdownKey = "venta" | "renta" | "herramientas";

export interface DropdownDef {
  key: DropdownKey;
  label: string;
  href: string;
  items: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

export const DESKTOP_DROPDOWNS: DropdownDef[] = [
  { key: "venta", label: "Venta", href: "/inventario?tipo=Venta", items: ventaDropdown },
  { key: "renta", label: "Renta", href: "/inventario?tipo=Renta", items: rentaDropdown },
  { key: "herramientas", label: "Herramientas", href: "/herramientas", items: herramientasDropdown },
];

/* ── Nav link styles ─────────────────────────────────────────────────
 * El underline se construye con un pseudo-elemento `after:` que
 * crece de 0→100% al hacer hover (scaleX con transform-origin: left).
 * Para el estado activo, el underline está siempre al 100%.
 * Gold champagne = var(--color-accent).
 */
export const navLinkBase =
  "font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground transition-colors duration-300 relative py-1 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:text-foreground " +
  "after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-accent)] after:transition-transform after:duration-500 after:ease-out " +
  "hover:after:scale-x-100";

export const navLinkActive = "text-foreground after:scale-x-100";
