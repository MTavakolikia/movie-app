/* ============================================================
   Static genre maps — TMDb genre ids are stable, so cards and
   filters resolve names without an extra API round-trip.
   Movie and TV ids overlap (16 = Animation in both), but some
   ids are TV-only, hence two lists.
   ============================================================ */

export interface Genre {
  id: number;
  name: string;
}

export const movieGenres: readonly Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const tvGenres: readonly Genre[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

/** Every genre a movie or show can carry, sorted for filter controls. */
export const allGenres: readonly Genre[] = [
  ...new Map([...movieGenres, ...tvGenres].map((genre) => [genre.id, genre])).values(),
].sort((a, b) => a.name.localeCompare(b.name));

const NAME_BY_ID = new Map(allGenres.map((genre) => [genre.id, genre.name]));

/** Resolves genre ids to display names, preserving order, up to `limit`. */
export function genreNames(genreIds: readonly number[] | undefined, limit = 3): string[] {
  if (!genreIds?.length) return [];
  const names: string[] = [];
  for (const id of genreIds) {
    const name = NAME_BY_ID.get(id);
    if (name) names.push(name);
    if (names.length === limit) break;
  }
  return names;
}

export function genresFor(type: "movie" | "tv" | "all"): readonly Genre[] {
  return type === "movie" ? movieGenres : type === "tv" ? tvGenres : allGenres;
}
