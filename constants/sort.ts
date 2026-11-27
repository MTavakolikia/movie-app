import type { MediaType } from "@/types/tmdb";

/* ============================================================
   Sort options — kept in sync with what the TMDb APIs accept.
   ============================================================ */

export interface SortOption {
  value: string;
  label: string;
  /** Label suffix shown in the dropdown to make direction obvious. */
  hint: string;
}

/** Accepted by /discover — server-side sorting. */
export const discoverSortOptions: readonly SortOption[] = [
  { value: "popularity.desc", label: "Popularity", hint: "High → Low" },
  { value: "popularity.asc", label: "Popularity", hint: "Low → High" },
  { value: "vote_average.desc", label: "Rating", hint: "High → Low" },
  { value: "vote_average.asc", label: "Rating", hint: "Low → High" },
  { value: "primary_release_date.desc", label: "Release date", hint: "Newest first" },
  { value: "primary_release_date.asc", label: "Release date", hint: "Oldest first" },
];

/** TV discover uses a different date field. */
const TV_SORT_ALIASES: Record<string, string> = {
  "primary_release_date.desc": "first_air_date.desc",
  "primary_release_date.asc": "first_air_date.asc",
};

/** Translates a canonical sort value to the one the endpoint expects. */
export function sortForEndpoint(sort: string, mediaType: MediaType): string {
  if (mediaType === "tv" && sort in TV_SORT_ALIASES) return TV_SORT_ALIASES[sort];
  return sort;
}

export function isKnownSort(sort: string): boolean {
  return discoverSortOptions.some((option) => option.value === sort);
}

/** Rating floors offered as one-tap chips. */
export const ratingOptions = ["0", "6", "7", "8"] as const;
export type RatingOption = (typeof ratingOptions)[number];
