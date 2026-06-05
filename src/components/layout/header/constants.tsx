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

export const navLinkBase =
  "font-display text-xs font-bold uppercase tracking-card text-foreground/80 hover:text-gold-solid transition-colors duration-300 relative py-1 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:text-gold-solid";

export const navLinkActive = "text-gold-solid after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gold-solid after:rounded-sm";
