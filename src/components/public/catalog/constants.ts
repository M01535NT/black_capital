import type { ReadonlyURLSearchParams } from "next/navigation";
import { BRAND_TO_USE } from "@/lib/property-constants";

/** Opciones de orden del catálogo. */
export const SORT_OPTIONS = [
  { label: "Más recientes", value: "newest" },
  { label: "Menor precio", value: "price_asc" },
  { label: "Mayor precio", value: "price_desc" },
  { label: "Mayor terreno", value: "terrain_desc" },
  { label: "Mayor construcción", value: "construction_desc" },
  { label: "Destacadas primero", value: "featured" },
] as const;

/** Estatus centralizado (evita duplicar labels entre filtro y card). */
export const STATUS_OPTIONS = [
  { label: "Disponible", value: "Available" },
  { label: "Bajo oferta", value: "Under_Offer" },
  { label: "Vendido", value: "Sold" },
  { label: "Rentado", value: "Rented" },
] as const;

export const CURRENCY_OPTIONS = ["MXN", "USD"] as const;

export const PAGE_SIZE = 12;

/** Estado de todos los filtros del catálogo. Refleja los searchParams de la URL. */
export interface Filters {
  q: string;
  tipo: string | null; // operación (Venta/Renta) — URL: tipo
  uso: string | null; // Residencial/Comercial/Industrial — URL: uso
  propiedad: string | null; // tipo de inmueble (Casa/Local/…) — URL: propiedad
  estatus: string | null; // URL: estatus
  moneda: string | null; // URL: moneda
  precioMin: string; // URL: precio_min
  precioMax: string; // URL: precio_max
  m2Min: string; // URL: m2_min
  orden: string; // URL: orden
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  tipo: null,
  uso: null,
  propiedad: null,
  estatus: null,
  moneda: null,
  precioMin: "",
  precioMax: "",
  m2Min: "",
  orden: "newest",
};

/** Construye el estado inicial desde la URL (incluye deep-link `?brand=`). */
export function parseFilters(sp: ReadonlyURLSearchParams | URLSearchParams): Filters {
  const brand = sp.get("brand");
  const brandUse = brand ? BRAND_TO_USE[brand] ?? null : null;
  return {
    q: sp.get("q") ?? "",
    tipo: sp.get("tipo"),
    uso: sp.get("uso") ?? brandUse,
    propiedad: sp.get("propiedad"),
    estatus: sp.get("estatus"),
    moneda: sp.get("moneda"),
    precioMin: sp.get("precio_min") ?? "",
    precioMax: sp.get("precio_max") ?? "",
    m2Min: sp.get("m2_min") ?? "",
    orden: sp.get("orden") ?? "newest",
  };
}

/** Serializa los filtros a query string (omite vacíos y `brand`). */
export function serializeFilters(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.tipo) sp.set("tipo", f.tipo);
  if (f.uso) sp.set("uso", f.uso);
  if (f.propiedad) sp.set("propiedad", f.propiedad);
  if (f.estatus) sp.set("estatus", f.estatus);
  if (f.moneda) sp.set("moneda", f.moneda);
  if (f.precioMin) sp.set("precio_min", f.precioMin);
  if (f.precioMax) sp.set("precio_max", f.precioMax);
  if (f.m2Min) sp.set("m2_min", f.m2Min);
  if (f.orden && f.orden !== "newest") sp.set("orden", f.orden);
  return sp.toString();
}

/** Nº de filtros activos dentro del panel (excluye búsqueda y orden del toolbar). */
export function panelActiveCount(f: Filters): number {
  return [f.tipo, f.uso, f.propiedad, f.estatus, f.moneda, f.precioMin, f.precioMax, f.m2Min].filter(
    Boolean,
  ).length;
}

export function hasAnyFilter(f: Filters): boolean {
  return (
    Boolean(f.q) ||
    panelActiveCount(f) > 0 ||
    (f.orden !== "newest" && Boolean(f.orden))
  );
}

const money = (v: string) => new Intl.NumberFormat("es-MX").format(Number(v));

export interface ActiveChip {
  key: keyof Filters;
  label: string;
}

/** Deriva los chips de filtros activos (removibles individualmente). */
export function buildChips(f: Filters): ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (f.q) chips.push({ key: "q", label: `“${f.q}”` });
  if (f.tipo) chips.push({ key: "tipo", label: f.tipo });
  if (f.uso) chips.push({ key: "uso", label: f.uso });
  if (f.propiedad) chips.push({ key: "propiedad", label: f.propiedad });
  if (f.estatus) {
    const s = STATUS_OPTIONS.find((o) => o.value === f.estatus);
    chips.push({ key: "estatus", label: s?.label ?? f.estatus });
  }
  if (f.moneda) chips.push({ key: "moneda", label: f.moneda });
  if (f.precioMin) chips.push({ key: "precioMin", label: `Desde $${money(f.precioMin)}` });
  if (f.precioMax) chips.push({ key: "precioMax", label: `Hasta $${money(f.precioMax)}` });
  if (f.m2Min) chips.push({ key: "m2Min", label: `${money(f.m2Min)}+ m²` });
  if (f.orden && f.orden !== "newest") {
    const s = SORT_OPTIONS.find((o) => o.value === f.orden);
    chips.push({ key: "orden", label: s?.label ?? f.orden });
  }
  return chips;
}

/** Valor "vacío" por clave, para remover un chip individual. */
export function clearedValue(key: keyof Filters): string | null {
  if (key === "q" || key === "precioMin" || key === "precioMax" || key === "m2Min") return "";
  if (key === "orden") return "newest";
  return null;
}

/* ── Estilos de pill compartidos ── */
export const pillBase =
  "inline-flex min-h-10 items-center justify-center px-4 property-tag-type transition-colors duration-200 ease-out";
export const pillActive = "gold-gradient text-black";
export const pillInactive =
  "border border-white/[0.1] bg-white/[0.02] text-white/62 hover:border-white/25 hover:text-white active:scale-[0.98]";
