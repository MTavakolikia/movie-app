"use client";


import { motion } from "framer-motion";
import { Movie } from "../types/moveTypes";
import { useRouter } from "next/navigation";

export default function MovieCard({ movie }: { movie: Movie }) {
    const imgUrlPath = "https://image.tmdb.org/t/p/original";
    const router = useRouter();
    const handleMovieClick = async () => {
        router.push(`/movies/${movie.id}`);
    };
    return (
        <motion.div
            whileHover={{ scale: 0.95 }}
            className="card w-[100%] sm:w-80 lg:w-96 bg-base-100 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleMovieClick()}
        >
            {/* <Image
                src="https://image.tmdb.org/t/p/original/nOoGIymGBNtA7AEN0B6nshSEQ1p.jpg"
                alt="Test Image"
                className="rounded mb-4"
                width={500}
                height={300}
            /> */}
            <figure>
                <img
                    src={`${imgUrlPath}${movie?.backdrop_path}`}
                    alt={movie?.title}
                    className="rounded w-full mx=[200px] object-cover"
                />

            </figure>
            <div className="card-body">
                <h2 className="card-title">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie?.overview?.slice(0, 100)}...</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Release Date: {movie.release_date}</span>
                    <div className="badge badge-accent">⭐ {movie.vote_average.toFixed(1)}</div>
                </div>
            </div>
        </motion.div>



    );
}
