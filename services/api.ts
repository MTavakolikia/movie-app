// api/apiClient.ts
import axios from "axios";

export const API_BASE_URL = "https://api.themoviedb.org/3";
export const API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
    },
});
