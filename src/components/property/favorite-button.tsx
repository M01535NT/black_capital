"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  variant?: "icon" | "pill";
  className?: string;
}

export function FavoriteButton({
  propertyId,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = isFavorite(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(propertyId);
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 property-tag-type transition-colors",
          active
            ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            : "border-white/[0.08] bg-white/[0.025] text-white/60 hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)]",
          !hydrated && "opacity-0",
          className
        )}
        aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-pressed={active}
      >
        <Heart
          className={cn("w-4 h-4", active && "fill-current")}
        />
        {active ? "Guardado" : "Guardar"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-all",
        "bg-black/50 backdrop-blur-md border border-white/10",
        "hover:bg-black/70 hover:border-white/20",
        active
          ? "text-red-400"
          : "text-white/80",
        !hydrated && "opacity-0",
        className
      )}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
    >
      <Heart
        className={cn("w-5 h-5 transition-colors", active && "fill-current")}
      />
    </button>
  );
}
