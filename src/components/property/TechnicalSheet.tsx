"use client";

import { FileDown } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/format";

export interface TechnicalSheetData {
    title: string;
    reference: string;
    businessType: string;
    propertyUse: string;
    propertyType?: string | null;
    status: string;
    statusLabel: string;
    price: number;
    currency: string;
    address?: string | null;
    m2Terrain?: number | null;
    m2Construction?: number | null;
    customAttributes: Record<string, string>;
}

function buildRows(d: TechnicalSheetData): [string, string][] {
    const rows: [string, string][] = [
        ["Operación", d.businessType],
        ["Uso", d.propertyUse],
        ...(d.propertyType ? ([["Tipo", d.propertyType]] as [string, string][]) : []),
        ["Estatus", d.statusLabel],
        ...(d.m2Terrain ? ([["Terreno", formatArea(d.m2Terrain, "")]] as [string, string][]) : []),
        ...(d.m2Construction ? ([["Construcción", formatArea(d.m2Construction, "")]] as [string, string][]) : []),
        ...(d.address ? ([["Zona", d.address]] as [string, string][]) : []),
        ...Object.entries(d.customAttributes),
        ["Referencia", d.reference],
    ];
    return rows;
}

/** Ventana imprimible con la ficha; el usuario la guarda como PDF desde el diálogo del navegador. */
function printSheet(d: TechnicalSheetData) {
    const rows = buildRows(d)
        .map(
            ([k, v]) =>
                `<tr><td style="padding:9px 14px;border-bottom:1px solid #e5e0d5;color:#6b675e;font-size:12px">${k}</td><td style="padding:9px 14px;border-bottom:1px solid #e5e0d5;font-weight:600;font-size:13px;text-align:right">${v}</td></tr>`,
        )
        .join("");

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Ficha técnica — ${d.title}</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;color:#141311;margin:0;padding:36px 42px}@media print{body{padding:12px 6px}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #c9a24b;padding-bottom:14px;margin-bottom:22px">
  <div><div style="font-weight:800;font-size:19px;letter-spacing:.02em">BLACK CAPITAL</div><div style="font-size:10px;letter-spacing:.24em;color:#6b675e">INMOBILIARIA · TIJUANA B.C.</div></div>
  <div style="text-align:right"><div style="font-size:10px;letter-spacing:.14em;color:#6b675e;text-transform:uppercase">Ficha técnica</div><div style="font-size:11px;color:#6b675e;margin-top:3px">${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div></div>
</div>
<h1 style="font-size:25px;margin:0 0 4px;text-transform:uppercase;letter-spacing:-.01em">${d.title}</h1>
<div style="font-size:13px;color:#6b675e;margin-bottom:18px">${d.address ?? "Tijuana, Baja California"} · Ref. ${d.reference}</div>
<div style="background:#faf7f0;border:1px solid #e5e0d5;padding:14px 18px;display:flex;justify-content:space-between;align-items:baseline;margin-bottom:22px">
  <span style="font-size:11px;letter-spacing:.14em;color:#6b675e;text-transform:uppercase">Precio de ${d.businessType.toLowerCase()}</span>
  <span style="font-size:23px;font-weight:800;color:#9a7a2e">${formatPrice(d.price, d.currency)}</span>
</div>
<table style="width:100%;border-collapse:collapse;border:1px solid #e5e0d5">${rows}</table>
<div style="margin-top:26px;font-size:11px;color:#6b675e;line-height:1.6">Información sujeta a disponibilidad y confirmación. Black Capital opera como intermediario inmobiliario.<br>Tijuana, Baja California · blackmx.vercel.app</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`;

    const win = window.open("", "_blank", "width=860,height=1000");
    if (!win) return;
    win.document.write(html);
    win.document.close();
}

export function FichaPdfButton({ data }: { data: TechnicalSheetData }) {
    return (
        <button
            type="button"
            onClick={() => printSheet(data)}
            className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 px-4 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
        >
            <FileDown className="size-4" aria-hidden="true" />
            Descargar PDF
        </button>
    );
}

/**
 * Ficha técnica editorial: filas clave-valor a dos columnas con hairlines,
 * como la sección 03 de la plantilla. Compacta a propósito.
 */
export function TechnicalSheet({ data }: { data: TechnicalSheetData }) {
    const rows = buildRows(data);
    return (
        <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {rows.map(([k, v]) => (
                <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 border-t border-white/[0.1] py-3.5"
                >
                    <span className="text-body-sm text-white/50">{k}</span>
                    <span className="text-right text-body-sm font-semibold text-white">{v}</span>
                </div>
            ))}
        </div>
    );
}
