"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { AdminTooltip } from "@/components/admin/admin-tooltip";

const PUBLIC_SITE_ITEMS = [
  { title: "Inicio", href: "/" },
  { title: "Herramientas", href: "/herramientas" },
  { title: "Inventario", href: "/inventario" },
  { title: "Luxury", href: "/black-luxury" },
  { title: "Business", href: "/black-business" },
  { title: "Industrial", href: "/black-industrial" },
];

export function AdminPublicLinksMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <AdminTooltip label="Abrir páginas públicas">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-10 cursor-pointer items-center gap-2 border border-white/[0.08] bg-white/[0.025] px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 transition-colors hover:border-[var(--color-accent)]/45 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] focus:border-[var(--color-accent)]/45 focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] focus:outline-none"
        >
          Ir al sitio
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </AdminTooltip>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 border border-white/[0.08] bg-[#050505] text-white shadow-2xl shadow-black/60"
        >
          {PUBLIC_SITE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between border-b border-white/[0.06] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/58 transition-colors last:border-b-0 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] focus:outline-none"
            >
              {item.title}
              <ExternalLink className="h-3.5 w-3.5 text-white/35" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
