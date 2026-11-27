import axios from "axios";
import { isKnownSort, sortForEndpoint } from "@/constants/sort";
import type {
  CastMember,
  CrewMember,
  DiscoverFilters,
  FeaturedItem,
  GalleryImage,
  MediaType,
  MediaDetails,
  MediaItem,
  Paginated,
  Person,
  ProductionCompany,
  ReviewItem,
} from "@/types/tmdb";

/* ============================================================
   Unified TMDb service — server components and route handlers
   only. The API token never leaves this module.

   - Successful GETs are memoized for a short TTL; failures are
     never cached, so a blocked or flaky network self-heals.
   - Lists degrade to an empty page so pages can render a retry
     state instead of crashing.
   ============================================================ */

const API_BASE_URL =
  process.env.TMDB_API_BASE_URL?.replace(/\/+$/, "") ?? "https://api.themoviedb.org/3";
const CACHE_TTL_MS = 60_000;
const CACHE_MAX_ENTRIES = 400;

// Server-only by construction: without the NEXT_PUBLIC_ prefix, Next.js
// replaces this with undefined in any client bundle.
const TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  headers: {
    accept: "application/json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  },
});

/** Carries the HTTP status so callers can tell "missing" from "unreachable". */
export class TmdbError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

/* ---------------- Cached transport ---------------- */

type Params = Record<string, string | number | boolean>;

interface CacheEntry {
  expires: number;
  data: unknown;
}

const memory = new Map<string, CacheEntry>();

function cacheKey(path: string, params?: Params): string {
  if (!params) return path;
  const search = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
  return `${path}?${search.toString()}`;
}

async function get<T>(path: string, params?: Params): Promise<T> {
  const key = cacheKey(path, params);
  const hit = memory.get(key);
  if (hit && hit.expires > Date.now()) return hit.data as T;

  try {
    const { data } = await client.get<T>(path, { params });
    if (memory.size >= CACHE_MAX_ENTRIES) {
      const now = Date.now();
      for (const [entryKey, entry] of memory) {
        if (entry.expires <= now) memory.delete(entryKey);
      }
      if (memory.size >= CACHE_MAX_ENTRIES) memory.clear();
    }
    memory.set(key, { expires: Date.now() + CACHE_TTL_MS, data });
    return data;
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
    const detail = axios.isAxiosError(error)
      ? `${error.code ?? "network-error"}${status === null ? "" : ` (HTTP ${status})`}`
      : error instanceof Error
        ? error.message
        : String(error);
    console.warn(`[tmdb] ${path} failed — ${detail}${TOKEN ? "" : " [TMDB_API_TOKEN is not set]"}`);
    throw new TmdbError(`TMDb request failed: ${path}`, status);
  }
}

/* ---------------- Raw shapes ---------------- */

interface RawMedia {
  id?: number;
  title?: string | null;
  name?: string | null;
  original_title?: string | null;
  original_name?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string | null;
  genre_ids?: number[] | null;
  vote_average?: number | null;
  vote_count?: number | null;
  release_date?: string | null;
  first_air_date?: string | null;
  popularity?: number | null;
  media_type?: string | null;
}

interface RawList {
  page?: number;
  results?: RawMedia[] | null;
  total_pages?: number;
  total_results?: number;
}

interface RawVideo {
  id?: string;
  key?: string;
  name?: string;
  site?: string;
  type?: string;
  official?: boolean;
}

interface RawReview {
  id?: string;
  author?: string;
  content?: string;
  created_at?: string;
  url?: string;
  author_details?: {
    name?: string;
    username?: string;
    avatar_path?: string | null;
    rating?: number | null;
  } | null;
}

interface RawDetails extends RawMedia {
  tagline?: string | null;
  runtime?: number | null;
  episode_run_time?: number[] | null;
  status?: string | null;
  genres?: { id: number; name: string }[] | null;
  original_language?: string | null;
  budget?: number | null;
  revenue?: number | null;
  homepage?: string | null;
  imdb_id?: string | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  created_by?: { id: number; name: string }[] | null;
  production_companies?: { id: number; name: string; logo_path?: string | null }[] | null;
  spoken_languages?: { english_name?: string; name?: string }[] | null;
  videos?: { results?: RawVideo[] | null } | null;
  credits?: {
    cast?: { id: number; name: string; character?: string; profile_path?: string | null; order?: number }[] | null;
    crew?: { id: number; name: string; job: string }[] | null;
  } | null;
  similar?: RawList | null;
  recommendations?: RawList | null;
  images?: { backdrops?: { file_path?: string; aspect_ratio?: number }[] | null } | null;
  reviews?: { results?: RawReview[] | null } | null;
}

interface RawPerson {
  id?: number;
  name?: string;
  biography?: string | null;
  birthday?: string | null;
  place_of_birth?: string | null;
  profile_path?: string | null;
  known_for_department?: string | null;
  combined_credits?: { cast?: RawMedia[] | null } | null;
}

/* ---------------- Normalizers ---------------- */

function isMediaType(value: string | null | undefined): value is MediaType {
  return value === "movie" || value === "tv";
}

function toMediaItem(raw: RawMedia, fallbackType: MediaType): MediaItem {
  return {
    id: raw.id ?? 0,
    mediaType: isMediaType(raw.media_type) ? raw.media_type : fallbackType,
    title: raw.title || raw.name || raw.original_title || raw.original_name || "Untitled",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    overview: raw.overview || null,
    genreIds: raw.genre_ids ?? [],
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    releaseDate: raw.release_date || raw.first_air_date || null,
    popularity: raw.popularity ?? 0,
  };
}

export function emptyPage(page = 1): Paginated<MediaItem> {
  return { page, results: [], totalPages: 0, totalResults: 0 };
}

/** A page that also tells the UI whether the failure was the network or the query. */
export type ListResult = Paginated<MediaItem> & { unavailable: boolean };

function unavailablePage(page = 1): ListResult {
  return { ...emptyPage(page), unavailable: true };
}

function availablePage(data: RawList, page: number, fallbackType: MediaType): ListResult {
  return { ...toPage(data, page, fallbackType), unavailable: false };
}

function toPage(raw: RawList, page: number, fallbackType: MediaType): Paginated<MediaItem> {
  const results = (raw.results ?? [])
    .filter((item): item is RawMedia => Boolean(item) && typeof item.id === "number")
    .filter((item) => !item.media_type || isMediaType(item.media_type))
    .map((item) => toMediaItem(item, fallbackType));
  return {
    page: raw.page ?? page,
    results,
    totalPages: Math.min(raw.total_pages ?? 0, 500),
    totalResults: raw.total_results ?? 0,
  };
}

function pickTrailer(videos: RawVideo[]): string | null {
  const rank = (video: RawVideo): number => {
    if (video.type === "Trailer") return video.official ? 0 : 1;
    if (video.type === "Teaser") return video.official ? 2 : 3;
    return 4;
  };
  const youTube = videos.filter((video) => video.site === "YouTube" && Boolean(video.key));
  youTube.sort((a, b) => rank(a) - rank(b));
  return youTube[0]?.key ?? null;
}

function toDetails(data: RawDetails, mediaType: MediaType): MediaDetails {
  const cast: CastMember[] = (data.credits?.cast ?? [])
    .filter((person) => Boolean(person.name))
    .slice(0, 24)
    .map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character ?? "",
      profilePath: person.profile_path ?? null,
    }));

  const creditedJobs = new Set(["Director", "Screenplay", "Writer", "Story", "Creator"]);
  const seenCrew = new Set<string>();
  const crew: CrewMember[] = [];
  for (const person of data.credits?.crew ?? []) {
    if (!creditedJobs.has(person.job)) continue;
    const key = `${person.id}-${person.job}`;
    if (seenCrew.has(key)) continue;
    seenCrew.add(key);
    crew.push({ id: person.id, name: person.name, job: person.job });
  }

  const productionCompanies: ProductionCompany[] = (data.production_companies ?? [])
    .filter((company) => Boolean(company.name))
    .slice(0, 8)
    .map((company) => ({ id: company.id, name: company.name, logoPath: company.logo_path ?? null }));

  const backdrops: GalleryImage[] = (data.images?.backdrops ?? [])
    .filter((image) => Boolean(image.file_path))
    .slice(0, 18)
    .map((image) => ({ filePath: image.file_path as string, aspectRatio: image.aspect_ratio ?? 1.78 }));

  const reviews: ReviewItem[] = (data.reviews?.results ?? [])
    .filter((review) => Boolean(review.id) && Boolean(review.content))
    .slice(0, 20)
    .map((review) => ({
      id: review.id as string,
      author: review.author_details?.name || review.author || review.author_details?.username || "Anonymous",
      avatarPath: review.author_details?.avatar_path ?? null,
      rating: review.author_details?.rating ?? null,
      content: review.content ?? "",
      createdAt: review.created_at ?? "",
      url: review.url ?? "",
    }));

  return {
    id: data.id ?? 0,
    mediaType,
    title: data.title || data.name || data.original_title || data.original_name || "Untitled",
    tagline: data.tagline || null,
    overview: data.overview || null,
    posterPath: data.poster_path ?? null,
    backdropPath: data.backdrop_path ?? null,
    voteAverage: data.vote_average ?? 0,
    voteCount: data.vote_count ?? 0,
    releaseDate: data.release_date || data.first_air_date || null,
    runtime: data.runtime ?? data.episode_run_time?.[0] ?? null,
    status: data.status || null,
    genres: (data.genres ?? []).filter((genre) => Boolean(genre.name)),
    originalLanguage: data.original_language || null,
    budget: data.budget ?? null,
    revenue: data.revenue ?? null,
    homepage: data.homepage || null,
    imdbId: data.imdb_id || null,
    productionCompanies,
    spokenLanguages: (data.spoken_languages ?? [])
      .map((language) => ({ englishName: language.english_name || language.name || "", name: language.name || "" }))
      .filter((language) => Boolean(language.englishName)),
    numberOfSeasons: data.number_of_seasons ?? null,
    numberOfEpisodes: data.number_of_episodes ?? null,
    createdBy: (data.created_by ?? []).filter((person) => Boolean(person.name)),
    trailerKey: pickTrailer(data.videos?.results ?? []),
    cast,
    crew,
    similar: toPage(data.similar ?? {}, 1, mediaType).results.slice(0, 12),
    recommendations: toPage(data.recommendations ?? {}, 1, mediaType).results.slice(0, 12),
    backdrops,
    reviews,
  };
}

/* ---------------- Lists ---------------- */

export type MovieList = "popular" | "top_rated" | "now_playing" | "upcoming";
export type TvList = "popular" | "top_rated" | "airing_today" | "on_the_air";
export type TrendingType = "all" | MediaType;
export type TrendingWindow = "day" | "week";

async function list(path: string, page: number, fallbackType: MediaType): Promise<ListResult> {
  try {
    const data = await get<RawList>(path, { language: "en-US", page });
    return availablePage(data, page, fallbackType);
  } catch {
    return unavailablePage(page);
  }
}

export function getMovieList(listName: MovieList, page = 1): Promise<ListResult> {
  return list(`/movie/${listName}`, page, "movie");
}

export function getTvList(listName: TvList, page = 1): Promise<ListResult> {
  return list(`/tv/${listName}`, page, "tv");
}

export function getTrending(type: TrendingType = "all", window: TrendingWindow = "week", page = 1): Promise<ListResult> {
  return list(`/trending/${type}/${window}`, page, "movie");
}

/* ---------------- Discover & search ---------------- */

function discoverParams(type: MediaType, filters: Partial<DiscoverFilters>, page: number): Params {
  const sort = isKnownSort(filters.sort ?? "") ? (filters.sort as string) : "popularity.desc";
  const byRating = sort.startsWith("vote_average") || Boolean(filters.ratingGte) || Boolean(filters.ratingLte);

  const params: Params = {
    language: "en-US",
    page,
    sort_by: sortForEndpoint(sort, type),
    include_adult: false,
  };
  // A vote floor keeps obscure titles with a perfect 10/10 from three votes out of rating views.
  if (byRating) params["vote_count.gte"] = 100;
  if (filters.genres) params.with_genres = filters.genres;
  if (filters.ratingGte) params["vote_average.gte"] = filters.ratingGte;
  if (filters.ratingLte) params["vote_average.lte"] = filters.ratingLte;
  if (filters.language) params.with_original_language = filters.language;
  if (filters.keywords) params.with_keywords = filters.keywords;
  if (filters.year) params[type === "movie" ? "primary_release_year" : "first_air_date_year"] = filters.year;
  if (type === "movie") {
    if (filters.runtimeGte) params["with_runtime.gte"] = filters.runtimeGte;
    if (filters.runtimeLte) params["with_runtime.lte"] = filters.runtimeLte;
  }
  return params;
}

export async function discover(
  type: MediaType,
  filters: Partial<DiscoverFilters> = {},
  page = 1,
): Promise<ListResult> {
  try {
    const data = await get<RawList>(`/discover/${type}`, discoverParams(type, filters, page));
    return availablePage(data, page, type);
  } catch {
    return unavailablePage(page);
  }
}

export async function search(
  query: string,
  type: TrendingType = "all",
  page = 1,
  year?: string,
): Promise<ListResult> {
  const trimmed = query.trim();
  if (!trimmed) return { ...emptyPage(page), unavailable: false };
  const params: Params = { query: trimmed, include_adult: false, language: "en-US", page };
  if (year && type !== "all") params.year = year;
  try {
    const data = await get<RawList>(`/search/${type === "all" ? "multi" : type}`, params);
    return availablePage(data, page, type === "tv" ? "tv" : "movie");
  } catch {
    return unavailablePage(page);
  }
}

/** Resolves free-text keywords to TMDb keyword ids for `with_keywords`. */
export async function resolveKeywords(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (/^[\d,\s]+$/.test(trimmed)) return trimmed.replace(/\s+/g, "");
  try {
    const data = await get<RawList>("/search/keyword", { query: trimmed, page: 1 });
    return (data.results ?? [])
      .slice(0, 3)
      .map((keyword) => keyword.id)
      .filter((id): id is number => typeof id === "number")
      .join(",");
  } catch {
    return "";
  }
}

/* ---------------- Details & people ---------------- */

export type DetailsResult =
  | { status: "ok"; details: MediaDetails }
  | { status: "not-found" }
  | { status: "unavailable" };

export async function getDetails(mediaType: MediaType, id: string): Promise<DetailsResult> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return { status: "not-found" };

  try {
    const data = await get<RawDetails>(`/${mediaType}/${numericId}`, {
      language: "en-US",
      append_to_response: "videos,credits,similar,recommendations,images,reviews",
      include_image_language: "en,null",
    });
    return { status: "ok", details: toDetails(data, mediaType) };
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : null;
    const isMissing = status === 404 || status === 422;
    return { status: isMissing ? "not-found" : "unavailable" };
  }
}

/** Runtime, full genre names and trailer for a hero slide — one request. */
export async function getFeatured(item: MediaItem): Promise<FeaturedItem | null> {
  try {
    const data = await get<RawDetails>(`/${item.mediaType}/${item.id}`, {
      language: "en-US",
      append_to_response: "videos",
    });
    return {
      item,
      genres: (data.genres ?? []).map((genre) => genre.name).filter(Boolean),
      runtime: data.runtime ?? data.episode_run_time?.[0] ?? null,
      trailerKey: pickTrailer(data.videos?.results ?? []),
    };
  } catch {
    return null;
  }
}

export async function getRecommendations(mediaType: MediaType, id: number): Promise<MediaItem[]> {
  try {
    const data = await get<RawList>(`/${mediaType}/${id}/recommendations`, { language: "en-US", page: 1 });
    return toPage(data, 1, mediaType).results.slice(0, 20);
  } catch {
    return [];
  }
}

export async function getPerson(id: number): Promise<Person | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const data = await get<RawPerson>(`/person/${id}`, {
      language: "en-US",
      append_to_response: "combined_credits",
    });
    const knownFor = (data.combined_credits?.cast ?? [])
      .filter((credit) => isMediaType(credit.media_type) && Boolean(credit.id))
      .filter((credit) => Boolean(credit.poster_path || credit.backdrop_path))
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 12)
      .map((credit) => toMediaItem(credit, "movie"));
    return {
      id: data.id ?? id,
      name: data.name || "Unknown",
      biography: data.biography || null,
      birthday: data.birthday || null,
      placeOfBirth: data.place_of_birth || null,
      profilePath: data.profile_path ?? null,
      knownForDepartment: data.known_for_department || null,
      knownFor,
    };
  } catch {
    return null;
  }
}
