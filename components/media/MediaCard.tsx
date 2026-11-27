import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { LuArrowRight } from "react-icons/lu";
import { FaStar } from "react-icons/fa6";
import type { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/cn";
import { detailHref, formatRating, tmdbImage, year } from "@/lib/utils";
import { genreNames } from "@/constants/genres";
import WatchlistButton from "@/components/watchlist/WatchlistButton";

interface MediaCardProps {
  item: MediaItem;
  /** Position inside a <Reveal> — enables the staggered entrance. */
  index?: number;
  /** Tag TV shows (useful in mixed collections). */
  showType?: boolean;
  /** Rank badge for top-ten style rails. */
  rank?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Cinematic poster card. Server-rendered; every hover effect is CSS so
 * long grids stay light. The poster is one link; the watchlist toggle is
 * a sibling so it never nests interactive content.
 */
export default function MediaCard({
  item,
  index,
  showType = false,
  rank,
  priority = false,
  className,
}: MediaCardProps) {
  const poster = tmdbImage(item.posterPath, "w500");
  const reveals = index !== undefined;
  const genres = genreNames(item.genreIds, 2);

  return (
    <article
      className={cn("group relative", className)}
      data-reveal-item={reveals ? "" : undefined}
      style={reveals ? ({ "--i": index } as CSSProperties) : undefined}
    >
      <Link
        href={detailHref(item.mediaType, item.id)}
        aria-label={`${item.title} (${year(item.releaseDate)}) — view details`}
        className="block rounded-xl focus-visible:outline-none"
      >
        <div className="poster-shadow relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/[0.06] transition-[translate,box-shadow,ring-color] duration-500 ease-cinematic group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_55px_-26px_rgb(0_0_0/0.9)] group-hover:ring-white/20 group-focus-visible:ring-2 group-focus-visible:ring-accent">
          {poster ? (
            <Image
              src={poster}
              alt={`Poster for ${item.title}`}
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, (max-width: 1536px) 16vw, 220px"
              fetchPriority={priority ? "high" : "auto"}
              loading={priority ? "eager" : "lazy"}
              className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-surface-2 to-canvas p-4 text-center">
              <LuArrowRight className="size-5 text-faint" aria-hidden />
              <span className="font-display text-base leading-tight text-muted">{item.title}</span>
            </div>
          )}

          {rank !== undefined && (
            <span
              aria-hidden
              className="absolute top-2.5 left-2.5 z-10 grid size-8 place-items-center rounded-full border border-white/15 bg-black/55 font-display text-sm leading-none text-accent backdrop-blur-md tabular"
            >
              {rank}
            </span>
          )}

          {/* Hover scrim + reveal */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(4_5_9/0.94)_0%,rgb(4_5_9/0.66)_42%,transparent_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-3.5 opacity-0 transition-[opacity,translate] duration-500 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            {genres.length > 0 && (
              <p className="mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                {genres.join(" / ")}
              </p>
            )}
            {item.overview && <p className="line-clamp-3 text-xs leading-relaxed text-white/80">{item.overview}</p>}
            <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              View details
              <LuArrowRight className="size-3" />
            </span>
          </div>
        </div>

        <h3 className="mt-3 truncate font-sans text-sm font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-faint tabular">
          <FaStar className="size-3 text-accent" aria-hidden />
          <span>{formatRating(item.voteAverage)}</span>
          <span aria-hidden>·</span>
          <span>{year(item.releaseDate)}</span>
          {showType && (
            <span className="ml-0.5 rounded-full border border-line px-1.5 py-px text-[9px] font-semibold tracking-[0.14em] text-muted uppercase">
              {item.mediaType === "tv" ? "Series" : "Film"}
            </span>
          )}
        </p>
      </Link>

      <WatchlistButton revealOnHover entry={item} className="absolute top-3.5 right-3.5 z-10" />
    </article>
  );
}
