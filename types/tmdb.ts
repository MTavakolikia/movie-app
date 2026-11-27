/* ============================================================
   TMDb domain types — normalized for the app
   ============================================================ */

export type MediaType = "movie" | "tv";

/** Normalized list item shared by movies and TV shows. */
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string | null;
  genreIds: number[];
  voteAverage: number;
  voteCount: number;
  /** Movie release date or TV first air date (ISO "YYYY-MM-DD"). */
  releaseDate: string | null;
  popularity: number;
}

export interface Paginated<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatarPath: string | null;
  rating: number | null;
  content: string;
  createdAt: string;
  url: string;
}

export interface GalleryImage {
  filePath: string;
  aspectRatio: number;
}

/** Everything the details pages need, already appended server-side. */
export interface MediaDetails {
  id: number;
  mediaType: MediaType;
  title: string;
  tagline: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  releaseDate: string | null;
  runtime: number | null;
  status: string | null;
  genres: Genre[];
  originalLanguage: string | null;
  budget: number | null;
  revenue: number | null;
  homepage: string | null;
  imdbId: string | null;
  productionCompanies: ProductionCompany[];
  spokenLanguages: { englishName: string; name: string }[];
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  createdBy: { id: number; name: string }[];
  trailerKey: string | null;
  cast: CastMember[];
  crew: CrewMember[];
  similar: MediaItem[];
  recommendations: MediaItem[];
  backdrops: GalleryImage[];
  reviews: ReviewItem[];
}

/** Lightweight extras for the homepage hero. */
export interface FeaturedItem {
  item: MediaItem;
  genres: string[];
  runtime: number | null;
  trailerKey: string | null;
}

export interface Person {
  id: number;
  name: string;
  biography: string | null;
  birthday: string | null;
  placeOfBirth: string | null;
  profilePath: string | null;
  knownForDepartment: string | null;
  knownFor: MediaItem[];
}

/** Query params shared by /discover and the client search API. */
export interface DiscoverFilters {
  sort: string;
  genres: string;
  year: string;
  ratingGte: string;
  ratingLte: string;
  language: string;
  runtimeGte: string;
  runtimeLte: string;
  keywords: string;
}
