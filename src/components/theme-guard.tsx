"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

/**
 * Triple protección anti light-mode en páginas públicas:
 * 1. Reacciona a cambios de ruta (SPA navigation)
 * 2. Reacciona a cambios de tema (incluso desde localStorage)
 * 3. Usa next-themes API para que el cambio persista correctamente
 *
 * Solo el admin (/admin/*) puede usar tema claro.
 */
export function ThemeGuard() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin && (theme === "light" || resolvedTheme === "light")) {
      setTheme("dark");
    }
  }, [pathname, theme, resolvedTheme, setTheme, isAdmin]);

  return null;
}
