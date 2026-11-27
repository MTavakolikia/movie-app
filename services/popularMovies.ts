import { apiClient, describeTmdbError } from "./api";
import { PopularMovie } from "@/types/popularMoviesTypes";

export const fetchPopularMovies = async (page: number = 1): Promise<PopularMovie[]> => {

    try {
        const response = await apiClient.get("/movie/popular", {
            params: {
                // include_adult: false,
                // include_video: false,
                language: "en-US",
                page,
                // sort_by: "popularity.desc",
            },
        });
        return response.data.results;
    } catch (error) {
        console.log(error);
        throw new Error(`Failed to fetch popular movies — ${describeTmdbError(error)}`);
    }
};