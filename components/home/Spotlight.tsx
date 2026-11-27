import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { FaStar } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import type { MediaItem } from "@/types/tmdb";
import { genreNames } from "@/constants/genres";
import { detailHref, formatCount, formatRating, tmdbImage, year } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import RatingRing from "@/components/ui/RatingRing";
import WatchlistButton from "@/components/watchlist/WatchlistButton";

/* ============================================================
   Spotlight — an editorial full-bleed feature, deliberately
   different from the poster rails so the page has rhythm.
   ============================================================ */

export default function Spotlight({ item }: { item: MediaItem }) {
  const backdrop = tmdbImage(item.backdropPath, "w1280") ?? tmdbImage(item.posterPath, "w780");
  const poster = tmdbImage(item.posterPath, "w500");
  const genres = genreNames(item.genreIds, 3);

  return (
    <Reveal className="my-8 sm:my-12">
      <section className="relative overflow-hidden border-y border-line bg-elevated/60 py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-52 right-0 h-96 w-[640px] rounded-full bg-accent-soft blur-3xl" />
        <div className="page-px relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p data-reveal-item style={{ "--i": 0 } as CSSProperties} className="eyebrow mb-4 flex items-center gap-2.5">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden />
              In the spotlight
            </p>
            <h2
              data-reveal-item
              style={{ "--i": 1 } as CSSProperties}
              className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-ink text-balance"
            >
              {item.title}
            </h2>

            <div
              data-reveal-item
              style={{ "--i": 2 } as CSSProperties}
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted"
            >
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink tabular">
                <FaStar className="size-3.5 text-accent" aria-hidden />
                {formatRating(item.voteAverage)}
              </span>
              <span aria-hidden className="size-1 rounded-full bg-line-strong" />
              <span className="tabular">{year(item.releaseDate)}</span>
              {item.voteCount > 0 && (
                <>
                  <span aria-hidden className="size-1 rounded-full bg-line-strong" />
                  <span className="tabular">{formatCount(item.voteCount)} ratings</span>
                </>
              )}
              <span aria-hidden className="size-1 rounded-full bg-line-strong" />
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase">
                {item.mediaType === "tv" ? "Series" : "Film"}
              </span>
            </div>

            {item.overview && (
              <p
                data-reveal-item
                style={{ "--i": 3 } as CSSProperties}
                className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]"
              >
                {item.overview}
              </p>
            )}

            {genres.length > 0 && (
              <ul
                data-reveal-item
                style={{ "--i": 4 } as CSSProperties}
                className="mt-5 flex flex-wrap gap-2"
              >
                {genres.map((genre) => (
                  <li key={genre} className="rounded-full border border-line px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            <div data-reveal-item style={{ "--i": 5 } as CSSProperties} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={detailHref(item.mediaType, item.id)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent shadow-[0_14px_34px_-14px_rgb(232_185_84/0.6)] transition-[background-color,scale] duration-300 ease-cinematic hover:bg-accent-strong active:scale-[0.97]"
              >
                Explore the feature
                <LuArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
              <WatchlistButton entry={item} variant="label" tone="surface" />
            </div>
          </div>

          <div data-reveal-item style={{ "--i": 2 } as CSSProperties} className="relative">
            <Link
              href={detailHref(item.mediaType, item.id)}
              className="group relative block rounded-2xl focus-visible:outline-none"
              aria-label={`Explore ${item.title}`}
            >
              <div className="poster-shadow relative aspect-[16/11] overflow-hidden rounded-2xl bg-surface ring-1 ring-white/[0.06]">
                {backdrop ? (
                  <Image
                    src={backdrop}
                    alt={`Artwork from ${item.title}`}
                    fill
                    sizes="(max-width: 1024px) 92vw, 48vw"
                    className="object-cover transition-transform duration-[1.2s] ease-cinematic group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-surface-2 to-canvas" />
                )}
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
                <div aria-hidden className="absolute inset-0 ring-1 ring-white/10 ring-inset" />
                <div className="absolute top-4 right-4 rounded-full bg-black/45 p-1 backdrop-blur-md">
                  <RatingRing value={item.voteAverage} size={62} tone="artwork" />
                </div>
                <p className="absolute bottom-4 left-5 max-w-[70%] font-display text-xl leading-tight text-white drop-shadow-lg sm:text-2xl">
                  {item.title}
                </p>
              </div>

              {poster && (
                <div className="absolute -bottom-10 left-5 hidden w-28 overflow-hidden rounded-xl border border-white/15 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] sm:block lg:-left-12 lg:w-32">
                  <div className="relative aspect-[2/3]">
                    <Image src={poster} alt={`Poster for ${item.title}`} fill sizes="128px" className="object-cover" />
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
