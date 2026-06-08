"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminBackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => router.back()}
      className="inline-flex h-9 w-9 shrink-0 rounded-full border-white/[0.12] bg-white/[0.025] px-0 text-xs font-bold uppercase tracking-[0.12em] text-white/60 hover:text-[var(--color-accent)] sm:w-auto sm:px-4"
    >
      <ArrowLeft className="h-3.5 w-3.5 sm:mr-2" />
      <span className="hidden sm:inline">Hoja anterior</span>
    </Button>
  );
}
