"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bc_favorites";

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  hydrated: boolean;
}

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites(): UseFavoritesReturn {
  // ✅ Lazy initializer reads localStorage once, no setState in effect needed
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Sync to localStorage when favorites change (skip initial empty sync)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // quota exceeded or private mode
    }
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      }
      return [...prev, id];
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggle,
    count: favorites.length,
    hydrated,
  };
}
