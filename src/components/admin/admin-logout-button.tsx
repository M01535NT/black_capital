"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminTooltip } from "@/components/admin/admin-tooltip";

export function AdminLogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const button = (
    <button
      type="button"
      onClick={logout}
      aria-label="Cerrar sesión"
      className={cn(
        "flex items-center gap-3 border border-transparent px-3 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300",
        compact ? "h-11 w-11 justify-center border-white/[0.08] px-0 text-white/70" : "w-full"
      )}
    >
      <LogOut className="h-4 w-4 text-white/38" />
      {!compact && <span>Cerrar sesión</span>}
    </button>
  );

  return compact ? <AdminTooltip label="Cerrar sesión">{button}</AdminTooltip> : button;
}
