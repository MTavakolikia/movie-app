import axios from "axios";

export const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTEyNThlZWMwNDhhMjgyYjkxMDUwMGZkOWMyYTU4NSIsIm5iZiI6MTY4ODk3MjA3OS42Mywic3ViIjoiNjRhYmFiMmZmYTc4Y2QwMTFjZmIyYjIyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.bNunveyWVdjPQ8j7GY4pjT35XyxLPre5OruGwj-jt6g'
        }
    };
    await fetch('https://api.themoviedb.org/3/authentication', options)
        .then(res => { console.log(res); return true })
        .catch(err => console.error(err));

};


