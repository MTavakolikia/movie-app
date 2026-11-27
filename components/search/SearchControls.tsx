"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa6";
import { LuArrowRight, LuCheck, LuClock, LuRotateCcw, LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";
import type { MediaType } from "@/types/tmdb";
import { genresFor } from "@/constants/genres";
import { discoverSortOptions } from "@/constants/sort";
import { languages } from "@/constants/languages";
import {
  activeFilterCount,
  hasAdvancedFilters,
  searchHref,
  type BrowseFilterState,
} from "@/lib/browse";
import { cn } from "@/lib/cn";
import { detailHref, formatRating, tmdbImage, year } from "@/lib/utils";

/* ============================================================
   SearchControls — the whole search surface.
     · debounced title search (server-rendered results)
     · keyboard-navigable suggestions from a server proxy
     · recent searches kept locally
     · discover filters that compose into the URL
   ============================================================ */

interface Suggestion {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

interface SearchControlsProps {
  initialQuery: string;
  type: MediaType;
  values: BrowseFilterState;
}

const HISTORY_KEY = "lumina:search-history:v1";
const MAX_HISTORY = 6;

/* Recent searches are an external system (localStorage), so they are
   read through useSyncExternalStore with a module-level cache. */
const EMPTY_HISTORY: string[] = [];
let historyCache: string[] | null = null;
const historyListeners = new Set<() => void>();

function readHistory(): string[] {
  if (historyCache !== null) return historyCache;
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    historyCache = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_HISTORY)
      : [];
  } catch {
    historyCache = [];
  }
  return historyCache;
}

function writeHistory(next: string[]): void {
  historyCache = next;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — the in-memory list still works for this session
  }
  historyListeners.forEach((listener) => listener());
}

function subscribeHistory(listener: () => void): () => void {
  historyListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === HISTORY_KEY) {
      historyCache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    historyListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
const SELECT =
  "h-10 w-full cursor-pointer appearance-none rounded-xl border border-line bg-canvas px-3 pr-7 text-xs text-ink transition-colors duration-300 hover:border-line-strong focus:border-accent focus:outline-none";
const LABEL = "mb-1.5 block text-[10px] font-semibold tracking-[0.16em] text-faint uppercase";

const EMPTY_FILTERS: BrowseFilterState = {
  genre: "",
  sort: "popularity.desc",
  year: "",
  rating: "",
  language: "",
  runtime: "",
};

export default function SearchControls({ initialQuery, type, values }: SearchControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const history = useSyncExternalStore(subscribeHistory, readHistory, () => EMPTY_HISTORY);
  const [yearDraft, setYearDraft] = useState(values.year);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Prop-synced drafts — adjusted during render (the pattern React
  // recommends over setState-in-effect).
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  if (prevInitialQuery !== initialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }
  const [prevYear, setPrevYear] = useState(values.year);
  if (prevYear !== values.year) {
    setPrevYear(values.year);
    setYearDraft(values.year);
  }

  const remember = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    writeHistory([trimmed, ...readHistory().filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HISTORY));
  }, []);

  const forget = useCallback(() => writeHistory([]), []);

  // Debounced URL sync — results are rendered on the server.
  useEffect(() => {
    if (query.trim() === initialQuery.trim()) return;
    const timer = window.setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed) remember(trimmed);
      startTransition(() => {
        router.replace(searchHref(trimmed, type, values), { scroll: false });
      });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [query, initialQuery, type, values, router, remember]);

  // Suggestions — aborted on every keystroke. Stale results stay in state
  // but are never rendered: `visibleSuggestions` gates the dropdown.
  useEffect(() => {
    const term = query.trim();
    if (!focused || term.length < 2) return;

    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggesting(true);
      try {
        const response = await fetch(
          `/api/suggest?q=${encodeURIComponent(term)}&type=${type}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Suggestion request failed");
        const payload = (await response.json()) as { results?: Suggestion[] };
        if (cancelled) return;
        setSuggestions(payload.results ?? []);
        setHighlight(-1);
      } catch (error) {
        if (!cancelled && (error as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        if (!cancelled) setSuggesting(false);
      }
    }, 240);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, focused, type]);

  // "/" focuses search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleSuggestions = focused && query.trim().length >= 2;

  const goToSuggestion = (suggestion: Suggestion) => {
    remember(query);
    setFocused(false);
    setSuggestions([]);
    router.push(detailHref(suggestion.mediaType, suggestion.id));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) remember(trimmed);
    setFocused(false);
    setSuggestions([]);
    startTransition(() => router.push(searchHref(trimmed, type, values)));
  };

  const chooseType = (nextType: MediaType) => {
    if (nextType === type) return;
    startTransition(() => {
      router.push(searchHref(query, nextType, { ...values, genre: "", runtime: "" }), { scroll: false });
    });
  };

  const updateFilter = (key: keyof BrowseFilterState, value: string) => {
    if (values[key] === value) return;
    startTransition(() => {
      router.push(searchHref(query, type, { ...values, [key]: value }), { scroll: false });
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push(searchHref(query, type, EMPTY_FILTERS), { scroll: false });
    });
  };

  const filters = activeFilterCount(values);
  const genres = genresFor(type);
  const hybrid = Boolean(query.trim()) && hasAdvancedFilters(values);

  return (
    <section className="relative rounded-2xl border border-line bg-surface/55 p-4 backdrop-blur-sm sm:p-6" aria-label="Search and filter">
      <div aria-hidden className={cn("absolute inset-x-0 top-0 h-px overflow-hidden rounded-t-2xl bg-accent/20 transition-opacity", pending ? "opacity-100" : "opacity-0")}>
        <span className="block h-full w-1/3 animate-pulse bg-accent" />
      </div>

      <div ref={wrapRef} className="relative">
        <form onSubmit={submit} role="search" className="relative flex items-center gap-2 rounded-2xl border border-line bg-canvas px-4 transition-[border-color,box-shadow] duration-300 focus-within:border-accent/70 focus-within:shadow-[0_0_0_4px_var(--accent-soft)] sm:px-5">
          <LuSearch className="size-5 shrink-0 text-faint" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={visibleSuggestions}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={highlight >= 0 ? `suggestion-${highlight}` : undefined}
            aria-label="Search films and series"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) {
                setFocused(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setFocused(true);
                setHighlight((current) => Math.min(current + 1, suggestions.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setHighlight((current) => Math.max(current - 1, -1));
              } else if (event.key === "Enter" && highlight >= 0 && suggestions[highlight]) {
                event.preventDefault();
                goToSuggestion(suggestions[highlight]);
              } else if (event.key === "Escape") {
                setFocused(false);
                setSuggestions([]);
                inputRef.current?.blur();
              }
            }}
            placeholder="Search films and series — try a title, a director, a mood…"
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint sm:text-[15px]"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <LuX className="size-4" aria-hidden />
            </button>
          )}
          <kbd className="hidden h-6 items-center rounded border border-line px-1.5 font-sans text-[10px] text-faint sm:inline-flex">/</kbd>
          <button
            type="submit"
            aria-label="Search"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-accent text-on-accent transition-[background-color,scale] duration-300 hover:bg-accent-strong active:scale-95"
          >
            <LuArrowRight className="size-4" aria-hidden />
          </button>
        </form>

        {visibleSuggestions && (suggesting || suggestions.length > 0) && (
          <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)]">
            <p className="flex items-center justify-between px-4 pt-3 pb-2 text-[10px] font-semibold tracking-[0.16em] text-faint uppercase">
              Quick matches
              {suggesting && <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-label="Loading suggestions" />}
            </p>
            <ul id="search-suggestions" role="listbox" aria-label="Search suggestions">
              {suggestions.map((suggestion, index) => {
                const poster = tmdbImage(suggestion.posterPath, "w185");
                return (
                  <li key={`${suggestion.mediaType}-${suggestion.id}`} role="option" aria-selected={index === highlight} id={`suggestion-${index}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(index)}
                      onClick={() => goToSuggestion(suggestion)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        index === highlight ? "bg-surface-2" : "hover:bg-surface-2/60",
                      )}
                    >
                      <span className="relative block h-12 w-8 shrink-0 overflow-hidden rounded bg-surface-2">
                        {poster && <Image src={poster} alt="" fill sizes="32px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{suggestion.title}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-faint tabular">
                          {year(suggestion.releaseDate)}
                          <span aria-hidden>·</span>
                          <FaStar className="size-2.5 text-accent" aria-hidden />
                          {formatRating(suggestion.voteAverage)}
                          <span aria-hidden>·</span>
                          {suggestion.mediaType === "tv" ? "Series" : "Film"}
                        </span>
                      </span>
                      <LuArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {!query && history.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-faint uppercase">
            <LuClock className="size-3" aria-hidden /> Recent
          </span>
          {history.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                inputRef.current?.focus();
              }}
              className="inline-flex h-8 cursor-pointer items-center rounded-full border border-line px-3 text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {term}
            </button>
          ))}
          <button
            type="button"
            onClick={forget}
            className="inline-flex h-8 cursor-pointer items-center px-1 text-xs text-faint underline decoration-line-strong underline-offset-4 transition-colors hover:text-danger"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mt-5 border-t border-line pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Media type" className="inline-flex rounded-full border border-line bg-canvas p-1">
            {(["movie", "tv"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={type === option}
                onClick={() => chooseType(option)}
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center rounded-full px-4 text-xs font-semibold transition-colors duration-300",
                  type === option ? "bg-accent text-on-accent" : "text-muted hover:text-ink",
                )}
              >
                {option === "movie" ? "Films" : "Series"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-faint uppercase">
              <LuSlidersHorizontal className="size-3 text-accent" aria-hidden />
              Refine
              {filters > 0 && (
                <span className="grid min-w-5 place-items-center rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent tabular">
                  {filters}
                </span>
              )}
            </p>
            {filters > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent"
              >
                <LuRotateCcw className="size-3" aria-hidden />
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className={LABEL} htmlFor="search-genre">
              Genre
            </label>
            <select id="search-genre" className={SELECT} value={values.genre} onChange={(event) => updateFilter("genre", event.target.value)}>
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL} htmlFor="search-year">
              Year
            </label>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                updateFilter("year", yearDraft.replace(/\D/g, "").slice(0, 4));
              }}
              className="flex gap-1.5"
            >
              <input
                id="search-year"
                type="text"
                inputMode="numeric"
                placeholder="Any"
                value={yearDraft}
                onChange={(event) => setYearDraft(event.target.value.replace(/\D/g, "").slice(0, 4))}
                className="h-10 w-full min-w-0 rounded-xl border border-line bg-canvas px-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Apply year"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <LuCheck className="size-3.5" aria-hidden />
              </button>
            </form>
          </div>

          <div>
            <label className={LABEL} htmlFor="search-rating">
              Minimum score
            </label>
            <select id="search-rating" className={SELECT} value={values.rating} onChange={(event) => updateFilter("rating", event.target.value)}>
              <option value="">Any</option>
              <option value="6">6.0+</option>
              <option value="7">7.0+</option>
              <option value="8">8.0+</option>
            </select>
          </div>

          <div>
            <label className={LABEL} htmlFor="search-sort">
              Sort by
            </label>
            <select id="search-sort" className={SELECT} value={values.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
              {discoverSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} · {option.hint}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL} htmlFor="search-language">
              Language
            </label>
            <select id="search-language" className={SELECT} value={values.language} onChange={(event) => updateFilter("language", event.target.value)}>
              <option value="">Any</option>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          {type === "movie" && (
            <div>
              <label className={LABEL} htmlFor="search-runtime">
                Runtime
              </label>
              <select id="search-runtime" className={SELECT} value={values.runtime} onChange={(event) => updateFilter("runtime", event.target.value)}>
                <option value="">Any</option>
                <option value="short">Under 90m</option>
                <option value="medium">90–120m</option>
                <option value="long">Over 2h</option>
              </select>
            </div>
          )}
        </div>

        {hybrid && (
          <p className="mt-4 text-[11px] leading-relaxed text-faint">
            With a title in the box, genre, score, sort and runtime are applied through TMDb&apos;s keyword matching. Clear
            the title to browse the full filtered catalogue.
          </p>
        )}
      </div>
    </section>
  );
}
