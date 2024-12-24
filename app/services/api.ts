import axios from "axios";

export const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
    },
});

export const authenticate = async () => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
        }
    };
    await fetch('https://api.themoviedb.org/3/authentication', options)
        .then(res => { console.log(res); return true })
        .catch(err => console.error(err));

};


