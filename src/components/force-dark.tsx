"use client";

import { useEffect } from "react";

/**
 * Fuerza el tema oscuro en páginas públicas.
 * Se ejecuta después de hidratación para asegurar que
 * next-themes no haya cambiado a light por una visita previa al admin.
 */
export function ForceDark() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("dark");
    html.classList.remove("light");
  }, []);

  return null;
}
