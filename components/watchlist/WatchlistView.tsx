"use client";

import { useEffect, useMemo, useState } from "react";
import { LuBookmark, LuFilm, LuTrash2 } from "react-icons/lu";
import { FaTv } from "react-icons/fa6";
import type { MediaItem } from "@/types/tmdb";
import { useWatchlist, type WatchlistEntry } from "./WatchlistProvider";
import { useIsClient } from "@/lib/hooks/useIsClient";
import MediaGrid from "@/components/media/MediaGrid";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

/* ============================================================
   Watchlist view — local, instant, no account required.
   Entries already carry the display fields the poster cards
   need, so the page reads entirely from the browser.
   ============================================================ */

function toMediaItem(entry: WatchlistEntry): MediaItem {
  return {
    id: entry.id,
    mediaType: entry.mediaType,
    title: entry.title,
    posterPath: entry.posterPath,
    backdropPath: entry.backdropPath,
    overview: null,
    genreIds: [],
    voteAverage: entry.voteAverage,
    voteCount: 0,
    releaseDate: entry.releaseDate,
    popularity: 0,
  };
}

type SortMode = "recent" | "title";

export default function WatchlistView() {
  const { items, clear } = useWatchlist();
  const mounted = useIsClient();
  const [sort, setSort] = useState<SortMode>("recent");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sort === "title") copy.sort((a, b) => a.title.localeCompare(b.title));
    else copy.sort((a, b) => b.addedAt - a.addedAt);
    return copy.map(toMediaItem);
  }, [items, sort]);

  // The skeleton covers the one-paint window between hydration and the
  // first localStorage read, so users with saved titles never see the
  // empty state flash.
  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" aria-hidden>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index}>
            <div className="skeleton aspect-[2/3] w-full rounded-xl" />
            <div className="skeleton mt-3 h-4 w-3/4 rounded-md" />
            <div className="skeleton mt-2 h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<LuBookmark aria-hidden />}
        title="Your watchlist is a blank frame"
        description="Save anything that catches your eye — it stays in this browser, no account required. Start with what's trending or browse the full collection."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/movies" variant="primary">
              <LuFilm aria-hidden /> Browse films
            </Button>
            <Button href="/trending" variant="outline">
              See what&apos;s trending
            </Button>
          </div>
        }
      />
    );
  }

  const films = items.filter((item) => item.mediaType === "movie").length;
  const series = items.length - films;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-2 font-semibold text-ink tabular">
            <LuBookmark className="size-4 text-accent" aria-hidden />
            {items.length} saved
          </span>
          <span className="inline-flex items-center gap-1.5 tabular">
            <LuFilm className="size-3.5 text-faint" aria-hidden /> {films} films
          </span>
          <span className="inline-flex items-center gap-1.5 tabular">
            <FaTv className="size-3 text-faint" aria-hidden /> {series} series
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Sort watchlist" className="inline-flex rounded-full border border-line p-1">
            {(["recent", "title"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={sort === mode}
                onClick={() => setSort(mode)}
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-xs font-semibold transition-colors duration-300",
                  sort === mode ? "bg-surface-2 text-ink" : "text-faint hover:text-ink",
                )}
              >
                {mode === "recent" ? "Recently added" : "A–Z"}
              </button>
            ))}
          </div>

          {confirming ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  clear();
                  setConfirming(false);
                }}
                className="inline-flex h-9 cursor-pointer items-center rounded-full bg-danger/15 px-3 text-xs font-semibold text-danger transition-colors hover:bg-danger/25"
              >
                Yes, clear all
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-9 cursor-pointer items-center rounded-full px-3 text-xs font-medium text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-muted transition-colors duration-300 hover:border-danger hover:text-danger"
            >
              <LuTrash2 className="size-3.5" aria-hidden />
              Clear all
            </button>
          )}
        </div>
      </div>

      <MediaGrid items={sorted} showType />
    </div>
  );
}
