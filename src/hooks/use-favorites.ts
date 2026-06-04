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

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // localStorage access can fail in some browsers
    }
    setHydrated(true);
  }, []);

  // Sync to localStorage when favorites change
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
