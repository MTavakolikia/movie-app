export type Movie = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    backdrop_path?: string; // Optional
    overview?: string; // Optional
    adult?: boolean; // Optional
    genre_ids?: number[]; // Optional
    original_language?: string; // Optional
    original_title?: string; // Optional
    popularity?: number; // Optional
    video?: boolean; // Optional
    vote_count?: number; // Optional
};
