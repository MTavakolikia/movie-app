export type Genre = {
    id: number;
    name: string;
};

export type ProductionCompany = {
    id: number;
    logo_path?: string; // Optional as not all companies may have a logo
    name: string;
    origin_country: string;
};

export type ProductionCountry = {
    iso_3166_1: string;
    name: string;
};

export type SpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
};

export type BelongsToCollection = {
    id: number;
    name: string;
    poster_path?: string; // Optional
    backdrop_path?: string; // Optional
};

export type Movie = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    backdrop_path?: string; // Optional
    overview?: string; // Optional
    adult?: boolean; // Optional
    genre_ids?: number[]; // Optional (if genres are not fully fetched)
    genres?: Genre[]; // Optional (if genres are fully fetched)
    original_language?: string; // Optional
    original_title?: string; // Optional
    popularity?: number; // Optional
    video?: boolean; // Optional
    vote_count?: number; // Optional
    budget?: number; // Optional
    revenue?: number; // Optional
    runtime?: number; // Optional
    status?: string; // Optional
    tagline?: string; // Optional
    belongs_to_collection?: BelongsToCollection; // Optional
    production_companies?: ProductionCompany[]; // Optional
    production_countries?: ProductionCountry[]; // Optional
    spoken_languages?: SpokenLanguage[]; // Optional
    homepage?: string; // Optional
    imdb_id?: string; // Optional
    origin_country?: string[]; // Optional (from TMDB data)
};


export interface IMovieGallery {
    backdrops: { file_path: string; aspect_ratio: number }[];
}