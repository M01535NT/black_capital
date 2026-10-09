"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "bc_favorites";
export interface SavedProperty { id: string; title: string; href: string }
const serverSnapshot: { saved: SavedProperty[]; hydrated: boolean } = { saved: [], hydrated: false };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function savedHref(id: string, href?: unknown): string {
  // Public details resolve UUIDs as well as slugs; UUID links survive title/slug edits.
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return `/inventario/${id}`;
  return typeof href === "string" && /^\/(inventario\/|contacto\?)/.test(href) ? href : `/inventario/${encodeURIComponent(id)}`;
}

function readSaved(): SavedProperty[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    const seen = new Set<string>();
    return stored.flatMap((entry): SavedProperty[] => {
      const id = typeof entry === "string" ? entry : entry?.id;
      if (typeof id !== "string" || !id || seen.has(id)) return [];
      seen.add(id);
      const href = savedHref(id, entry?.href);
      return [{ id, href, title: typeof entry?.title === "string" ? entry.title : "Ver propiedad guardada" }];
    });
  } catch { return []; }
}

function emit() { listeners.forEach(listener => listener()); }
function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) {
    snapshot = { saved: readSaved(), hydrated: true };
    emit();
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  if (!snapshot.hydrated) { snapshot = { saved: readSaved(), hydrated: true }; emit(); }
  return () => { listeners.delete(listener); if (!listeners.size) window.removeEventListener("storage", onStorage); };
}
function toggle(id: string, property?: Omit<SavedProperty, "id">) {
  const saved = snapshot.saved.some(item => item.id === id)
    ? snapshot.saved.filter(item => item.id !== id)
    : [...snapshot.saved, { id, title: property?.title || "Ver propiedad guardada", href: savedHref(id, property?.href) }];
  snapshot = { saved, hydrated: true };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* Keep session state when storage is unavailable. */ }
  emit();
}

export function useFavorites() {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
  return { ...state, favorites: state.saved.map(item => item.id), count: state.saved.length,
    isFavorite: (id: string) => state.saved.some(item => item.id === id), toggle };
}
