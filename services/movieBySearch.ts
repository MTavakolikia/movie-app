import { apiClient } from "./api";

export const fetchSearchedMovie = async (page = 1, searchParam = "") => {
    const response = await apiClient.get("/search/movie", {
        params: {
            query: searchParam,
            include_adult: false,
            language: "en-US",
            primary_release_year: "",
            page,
            region: "popularity.desc",
            year: "",
        },
    });
    return response.data;
};