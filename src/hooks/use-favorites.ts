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
  // SSR-safe: start empty to match the server-rendered HTML, then load the
  // persisted favorites after mount. Reading localStorage in the initializer
  // would make the first client render differ from the server (the user's
  // saved favorites vs []), causing a React hydration mismatch for returning
  // users. Consumers gate their visible state on `hydrated` to avoid a flash.
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(readFavorites());
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
