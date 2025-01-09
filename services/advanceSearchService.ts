import { apiClient } from "./api";
import { PopularMovie } from "@/types/popularMoviesTypes";

export const fetchAdvanceSearch = async (param = {}, page: number = 1): Promise<PopularMovie[]> => {

    try {
        const response = await apiClient.get("/discover/movie", {
            params: {
                ...param,
                page,
            },
        });
        return response.data.results;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch popular movies");
    }
};