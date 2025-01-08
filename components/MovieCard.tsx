"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PopularMovie } from "@/types/popularMoviesTypes";
import Image from 'next/image';

export default function MovieCard({ movie }: { movie: PopularMovie }) {

    const router = useRouter();
    const handleMovieClick = async () => {
        router.push(`/movies/${movie.id}`);
    };
    return (
        <motion.div
            whileHover={{ scale: 0.95 }}
            className="card w-[100%] sm:w-80 lg:w-96 bg-base-100 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleMovieClick()}
        >
            <Image
                src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}` : '/default-image.png'}
                alt={movie?.title}
                width={500}
                height={300}
                className="rounded w-full mx=[200px] object-cover"
            />
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
