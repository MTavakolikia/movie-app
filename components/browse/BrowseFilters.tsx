"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuCheck, LuRotateCcw, LuSlidersHorizontal } from "react-icons/lu";
import type { Genre } from "@/constants/genres";
import type { MediaType } from "@/types/tmdb";
import { discoverSortOptions } from "@/constants/sort";
import { languages } from "@/constants/languages";
import { cn } from "@/lib/cn";
import type { BrowseFilterState } from "@/lib/browse";

/* ============================================================
   BrowseFilters — URL-driven discover controls.
   The server does the filtering; this component only composes
   the next query string, which keeps every result shareable
   and back-button friendly.
   ============================================================ */

export interface BrowseFilterValues {
  genre: string;
  sort: string;
  year: string;
  rating: string;
  language: string;
  runtime: string;
}

interface BrowseFiltersProps {
  type: MediaType;
  genres: readonly Genre[];
  values: BrowseFilterState;
  basePath: string;
}

const SELECT =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-canvas px-3.5 pr-8 text-sm text-ink transition-colors duration-300 hover:border-line-strong focus:border-accent focus:outline-none";

const LABEL = "mb-2 block text-[10px] font-semibold tracking-[0.18em] text-faint uppercase";

export default function BrowseFilters({ type, genres, values, basePath }: BrowseFiltersProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [yearDraft, setYearDraft] = useState(values.year);

  useEffect(() => {
    setYearDraft(values.year);
  }, [values.year]);

  const navigate = (next: BrowseFilterState) => {
    const params = new URLSearchParams();
    const merged: Record<string, string> = { ...next };
    if (merged.sort === "popularity.desc") delete merged.sort;
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
    });
  };

  const update = <K extends keyof BrowseFilterState>(key: K, value: BrowseFilterState[K]) => {
    if (values[key] === value) return;
    navigate({ ...values, [key]: value });
  };

  const activeCount = [
    values.genre,
    values.year,
    values.rating,
    values.language,
    values.runtime,
    values.sort !== "popularity.desc" ? values.sort : "",
  ].filter(Boolean).length;

  return (
    <section
      aria-label="Filter results"
      className="rounded-2xl border border-line bg-surface/55 p-4 backdrop-blur-sm sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
          <LuSlidersHorizontal className="size-3.5 text-accent" aria-hidden />
          Refine
          {activeCount > 0 && (
            <span className="grid min-w-5 place-items-center rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent tabular">
              {activeCount}
            </span>
          )}
          {pending && <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-label="Updating results" />}
        </p>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => navigate({ genre: "", sort: "popularity.desc", year: "", rating: "", language: "", runtime: "" })}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <LuRotateCcw className="size-3" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar" role="group" aria-label="Genre">
        <button
          type="button"
          aria-pressed={values.genre === ""}
          onClick={() => update("genre", "")}
          className={cn(
            "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-4 text-xs font-semibold transition-colors duration-300",
            values.genre === ""
              ? "border-accent bg-accent text-on-accent"
              : "border-line text-muted hover:border-line-strong hover:text-ink",
          )}
        >
          All genres
        </button>
        {genres.map((genre) => {
          const active = values.genre === String(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              aria-pressed={active}
              onClick={() => update("genre", active ? "" : String(genre.id))}
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-colors duration-300",
                active
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {active && <LuCheck className="size-3" aria-hidden />}
              {genre.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label className={LABEL} htmlFor="filter-sort">
            Sort by
          </label>
          <select
            id="filter-sort"
            className={SELECT}
            value={values.sort}
            onChange={(event) => update("sort", event.target.value)}
          >
            {discoverSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} · {option.hint}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="filter-year">
            Release year
          </label>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const value = yearDraft.replace(/\D/g, "").slice(0, 4);
              update("year", value);
            }}
          >
            <div className="flex gap-1.5">
              <input
                id="filter-year"
                type="text"
                inputMode="numeric"
                placeholder="Any year"
                value={yearDraft}
                onChange={(event) => setYearDraft(event.target.value.replace(/\D/g, "").slice(0, 4))}
                className="h-11 w-full min-w-0 rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Apply release year"
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <LuCheck className="size-4" aria-hidden />
              </button>
            </div>
          </form>
        </div>

        <div>
          <label className={LABEL} htmlFor="filter-rating">
            Minimum score
          </label>
          <select
            id="filter-rating"
            className={SELECT}
            value={values.rating}
            onChange={(event) => update("rating", event.target.value)}
          >
            <option value="">Any score</option>
            <option value="6">6.0 and above</option>
            <option value="7">7.0 and above</option>
            <option value="8">8.0 and above</option>
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="filter-language">
            Original language
          </label>
          <select
            id="filter-language"
            className={SELECT}
            value={values.language}
            onChange={(event) => update("language", event.target.value)}
          >
            <option value="">Any language</option>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        {type === "movie" && (
          <div>
            <label className={LABEL} htmlFor="filter-runtime">
              Runtime
            </label>
            <select
              id="filter-runtime"
              className={SELECT}
              value={values.runtime}
              onChange={(event) => update("runtime", event.target.value)}
            >
              <option value="">Any length</option>
              <option value="short">Under 90 minutes</option>
              <option value="medium">90 – 120 minutes</option>
              <option value="long">Over two hours</option>
            </select>
          </div>
        )}

        <div className="col-span-2 flex items-end sm:col-span-1">
          <p className="pb-2.5 text-[11px] leading-snug text-faint">
            Filters are applied by TMDb&apos;s discover engine and stay in the URL.
          </p>
        </div>
      </div>
    </section>
  );
}
