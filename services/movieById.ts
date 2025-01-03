import { IMovieGallery, Movie } from "@/types/moveTypes";
import { apiClient } from "./api";


export const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
};

export const fetchMovieImageById = async (movieId: string): Promise<IMovieGallery> => {
    console.log(`/movie/${movieId}/images/`);

    const response = await apiClient.get(`/movie/${movieId}/images`);
    return response.data;
};


