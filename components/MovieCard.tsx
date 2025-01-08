"use client";


import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PopularMovie } from "@/types/popularMoviesTypes";
import Image from 'next/image';

export default function MovieCard({ movie }: { movie: PopularMovie }) {
    // const imgUrlPath = `https://image.tmdb.org/t/p/original${movie?.backdrop_path}`;
    // console.log(imgUrlPath);

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
                src={imgUrlPath}
                alt={movie?.title}
                className="rounded w-full object-cover"
                width={500} // عرض تصویر
                height={300} // ارتفاع تصویر
            /> */}
            <Image
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path
                    }`}
                alt={movie?.title}
                width={500}
                height={300}
                className='rounded-lg'
                style={{ maxWidth: '100%', height: '100%' }}
            />
            {/* <Image
                src="https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg"
                alt="Sample Movie Image"
                width={500} // عرض تصویر
                height={300} // ارتفاع تصویر
                className="rounded-lg" // استایل اختیاری
            /> */}
            <figure>
                {/* <img
                    src={imgUrlPath}
                    alt={movie?.title}
                    className="rounded w-full mx=[200px] object-cover"
                /> */}


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
