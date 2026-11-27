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

/**
 * Turns an axios error into a short human-readable cause, so the generic
 * "Failed to fetch ..." messages thrown by services also say why they failed.
 */
export function describeTmdbError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const { status, statusText } = error.response;
            if (status === 401) {
                return "TMDB returned 401 Unauthorized — check NEXT_PUBLIC_TMDB_API_TOKEN in .env.local (use the v4 Read Access Token) and restart the dev server";
            }
            return `TMDB responded with HTTP ${status} ${statusText}`.trim();
        }
        if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED" || error.code === "ECONNRESET") {
            return "connection to api.themoviedb.org was reset/timed out — it is likely blocked on this network; turn on your VPN or set HTTPS_PROXY in .env.local";
        }
        if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
            return `cannot reach ${API_BASE_URL} (${error.code}) — check your connection, VPN, or HTTPS_PROXY in .env.local`;
        }
        return error.message;
    }
    return error instanceof Error ? error.message : String(error);
}
