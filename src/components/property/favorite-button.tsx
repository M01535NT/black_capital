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
          "inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border transition-all",
          active
            ? "bg-gold-500/10 border-gold-500/30 text-gold-500"
            : "bg-foreground/5 border-foreground/10 text-foreground/70 hover:text-gold-500 hover:border-gold-500/30",
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
