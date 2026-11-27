"use client";

import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import Button from "@/components/ui/Button";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import type { WatchlistEntry } from "@/components/watchlist/WatchlistProvider";
import TrailerModal, { type TrailerTarget } from "./TrailerModal";

interface DetailsActionsProps {
  title: string;
  trailerKey: string | null;
  entry: Omit<WatchlistEntry, "addedAt">;
  homepage: string | null;
  imdbId: string | null;
}

const EXTERNAL =
  "inline-flex h-13 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-[background-color,border-color,scale] duration-300 hover:border-white/50 hover:bg-white/[0.16] active:scale-[0.97]";

export default function DetailsActions({ title, trailerKey, entry, homepage, imdbId }: DetailsActionsProps) {
  const [trailer, setTrailer] = useState<TrailerTarget | null>(null);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {trailerKey && (
          <Button variant="primary" size="lg" onClick={() => setTrailer({ key: trailerKey, title })}>
            <FaPlay className="size-3" aria-hidden />
            Watch trailer
          </Button>
        )}

        <WatchlistButton entry={entry} variant="label" />

        {homepage && (
          <a href={homepage} target="_blank" rel="noreferrer noopener" className={EXTERNAL}>
            Official site
            <FiExternalLink className="size-3.5" aria-hidden />
          </a>
        )}

        {imdbId && (
          <a href={`https://www.imdb.com/title/${imdbId}/`} target="_blank" rel="noreferrer noopener" className={EXTERNAL}>
            IMDb
            <FiExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>

      <TrailerModal trailer={trailer} onClose={() => setTrailer(null)} />
    </>
  );
}
