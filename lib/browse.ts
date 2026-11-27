import { genresFor } from "@/constants/genres";
import { discoverSortOptions } from "@/constants/sort";
import { languages } from "@/constants/languages";
import type { DiscoverFilters, MediaType } from "@/types/tmdb";
import { readParam, readYear, runtimeRange, type AnySearchParams } from "@/lib/params";

/* ============================================================
   Browse query model — one parser shared by /movies, /tv and
   /popular so filters behave identically everywhere.
   ============================================================ */

export interface BrowseFilterState {
  genre: string;
  sort: string;
  year: string;
  rating: string;
  language: string;
  runtime: string;
}

const RATINGS = new Set(["6", "7", "8"]);
const RUNTIMES = new Set(["short", "medium", "long"]);
const DEFAULT_SORT = "popularity.desc";

export function parseBrowseFilters(
  type: MediaType,
  params: AnySearchParams,
): { values: BrowseFilterState; filters: Partial<DiscoverFilters> } {
  const allowedGenres = new Set(genresFor(type).map((genre) => String(genre.id)));
  const requestedGenre = readParam(params, "genre");
  const requestedSort = readParam(params, "sort");
  const requestedRating = readParam(params, "rating");
  const requestedLanguage = readParam(params, "language");
  const requestedRuntime = readParam(params, "runtime");

  const values: BrowseFilterState = {
    genre: allowedGenres.has(requestedGenre) ? requestedGenre : "",
    sort: discoverSortOptions.some((option) => option.value === requestedSort) ? requestedSort : DEFAULT_SORT,
    year: readYear(params),
    rating: RATINGS.has(requestedRating) ? requestedRating : "",
    language: languages.some((language) => language.code === requestedLanguage) ? requestedLanguage : "",
    runtime: type === "movie" && RUNTIMES.has(requestedRuntime) ? requestedRuntime : "",
  };

  const runtime = runtimeRange(values.runtime);

  return {
    values,
    filters: {
      genres: values.genre,
      sort: values.sort,
      year: values.year,
      ratingGte: values.rating,
      language: values.language,
      runtimeGte: runtime.gte,
      runtimeLte: runtime.lte,
      keywords: "",
      ratingLte: "",
    },
  };
}

export function browseParams(values: BrowseFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (values.genre) params.set("genre", values.genre);
  if (values.sort && values.sort !== DEFAULT_SORT) params.set("sort", values.sort);
  if (values.year) params.set("year", values.year);
  if (values.rating) params.set("rating", values.rating);
  if (values.language) params.set("language", values.language);
  if (values.runtime) params.set("runtime", values.runtime);
  return params;
}

export function browseHref(basePath: string, values: BrowseFilterState, page = 1): string {
  const params = browseParams(values);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function activeFilterCount(values: BrowseFilterState): number {
  return [
    values.genre,
    values.year,
    values.rating,
    values.language,
    values.runtime,
    values.sort !== DEFAULT_SORT ? values.sort : "",
  ].filter(Boolean).length;
}

/** Filters that TMDb's title-search endpoint cannot apply. */
export function hasAdvancedFilters(values: BrowseFilterState): boolean {
  return Boolean(
    values.genre ||
      values.rating ||
      values.language ||
      values.runtime ||
      (values.sort && values.sort !== DEFAULT_SORT),
  );
}

export function parseMediaType(value: string): MediaType {
  return value === "tv" ? "tv" : "movie";
}

export function searchHref(
  query: string,
  type: MediaType,
  values: BrowseFilterState,
  page = 1,
): string {
  const params = browseParams(values);
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (type === "tv") params.set("type", "tv");
  if (page > 1) params.set("page", String(page));
  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}
