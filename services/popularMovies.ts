import { apiClient } from "./api";

export const fetchPopularMovies = async (page: number = 1): Promise<any> => {

    try {
        const response = await apiClient.get("/discover/movie", {
            params: {
                include_adult: false,
                include_video: false,
                language: "en-US",
                page,
                sort_by: "popularity.desc",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch popular movies");
    }
};