"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTooltip } from "@/components/admin/admin-tooltip";

export function AdminBackButton() {
  const router = useRouter();

  return (
    <AdminTooltip label="Regresar">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        aria-label="Regresar"
        className="inline-flex h-9 w-9 shrink-0 rounded-full border-white/[0.12] bg-white/[0.025] px-0 text-white/60 hover:text-[var(--color-accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </Button>
    </AdminTooltip>
  );
}
