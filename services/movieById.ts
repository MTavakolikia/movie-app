import { Movie } from "@/types/moveTypes";
import { apiClient } from "./api";


export const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
};
