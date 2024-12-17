"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // استفاده از usePathname برای گرفتن شناسه فیلم از URL
import { apiClient, authenticate } from "@/app/services/api";

interface Movie {
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    backdrop_path: string;
}

const MovieDetails = () => {
    const pathname = usePathname();  // دریافت مسیر فعلی از URL
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // گرفتن شناسه فیلم از URL
    const id = pathname?.split('/').pop(); // شناسه فیلم باید آخرین قسمت از مسیر URL باشد

    const getMovie = async () => {
        await authenticate();
        const res = await apiClient.get(`/movie/${id}`);
        setMovie(res.data);
        setLoading(false)
    };
    useEffect(() => {
        if (!id) return;
        getMovie()
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!movie) {
        return <div onClick={() => console.log(movie)
        }>No movie data found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
            <img
                src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
                alt={movie?.title}
                className="rounded mb-4"
                style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
            />
            <p className="text-lg mb-4">{movie?.overview}</p>
            <p className="text-sm mb-2">Release Date: {movie?.release_date}</p>
            <p className="text-sm text-yellow-500">Rating: {movie?.vote_average}</p>
        </div>
    );
};

export default MovieDetails;
