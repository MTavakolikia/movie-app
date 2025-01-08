import { IMovieGallery, Movie } from "@/types/moveTypes";
import { apiClient } from "./api";
import { PopularMovie } from "@/types/popularMoviesTypes";
import { Reviews } from "@/types/reviewTypes";


export const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
};

export const fetchMovieImageById = async (movieId: string): Promise<IMovieGallery> => {
    const response = await apiClient.get(`/movie/${movieId}/images`);
    return response.data;
};

export const fetchRecommendationsById = async (movieId: string): Promise<PopularMovie[]> => {
    const response = await apiClient.get(`/movie/${movieId}/recommendations`);
    return response.data.results;
};

export const fetchReviewsById = async (movieId: string): Promise<Reviews> => {
    const response = await apiClient.get(`/movie/${movieId}/reviews`);
    return response.data.results;
};


