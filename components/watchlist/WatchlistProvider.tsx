"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { MediaType } from "@/types/tmdb";

/* ============================================================
   Local watchlist — persistent, no auth, cross-tab synced.

   localStorage is an external system, so it is read through
   useSyncExternalStore: the server snapshot is empty, the first
   client render hydrates with that same empty list, and the real
   entries stream in right after — no hydration mismatch, no
   "loaded" flag, and every consumer updates on writes from any
   tab or component.
   ============================================================ */

const STORAGE_KEY = "lumina:watchlist:v1";

export interface WatchlistEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  addedAt: number;
}

interface WatchlistContextValue {
  items: WatchlistEntry[];
  has: (id: number, mediaType: MediaType) => boolean;
  toggle: (entry: Omit<WatchlistEntry, "addedAt">) => void;
  remove: (id: number, mediaType: MediaType) => void;
  clear: () => void;
}

/* ---------------- external store ---------------- */

let cache: WatchlistEntry[] | null = null;
const listeners = new Set<() => void>();

function read(): WatchlistEntry[] {
  if (cache !== null) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is WatchlistEntry =>
            typeof item === "object" && item !== null && typeof (item as WatchlistEntry).id === "number",
        )
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: WatchlistEntry[]): void {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or unavailable — the in-memory value still applies
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: WatchlistEntry[] = [];
const getSnapshot = read;
const getServerSnapshot = () => EMPTY;

/* ---------------- actions (stable, module-level) ---------------- */

function hasEntry(id: number, mediaType: MediaType): boolean {
  return read().some((item) => item.id === id && item.mediaType === mediaType);
}

function toggleEntry(entry: Omit<WatchlistEntry, "addedAt">): void {
  const items = read();
  const exists = items.some((item) => item.id === entry.id && item.mediaType === entry.mediaType);
  write(
    exists
      ? items.filter((item) => !(item.id === entry.id && item.mediaType === entry.mediaType))
      : [{ ...entry, addedAt: Date.now() }, ...items],
  );
}

function removeEntry(id: number, mediaType: MediaType): void {
  write(read().filter((item) => !(item.id === id && item.mediaType === mediaType)));
}

function clearEntries(): void {
  write([]);
}

/* ---------------- context ---------------- */

const WatchlistContext = createContext<WatchlistContextValue>({
  items: EMPTY,
  has: hasEntry,
  toggle: toggleEntry,
  remove: removeEntry,
  clear: clearEntries,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // has/toggle/remove/clear are module-level and stable; only `items` changes.
  const value: WatchlistContextValue = {
    items,
    has: hasEntry,
    toggle: toggleEntry,
    remove: removeEntry,
    clear: clearEntries,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  return useContext(WatchlistContext);
}
