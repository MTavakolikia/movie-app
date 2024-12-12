import { motion } from "framer-motion";
import { Movie } from "../types/moveTypes";

export default function MovieCard({ movie }: { movie: Movie }) {
    const imgUrlPath = "https://image.tmdb.org/t/p/original";
    return (
        <motion.div
            whileHover={{ scale: 0.95 }}
            className="border rounded shadow-md p-4 hover:shadow-lg transition-shadow"
        >
            {/* <Image
                src="https://image.tmdb.org/t/p/original/nOoGIymGBNtA7AEN0B6nshSEQ1p.jpg"
                alt="Test Image"
                className="rounded mb-4"
                width={500}
                height={300}
            /> */}

            <img
                src={`${imgUrlPath}${movie.backdrop_path}`}
                alt={movie.title}
                className="rounded mb-4 "
                style={{ width: "500px", height: "250px" }}
            />
            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-600 mb-1">Release Date: {movie.release_date}</p>
            <p className="text-sm text-yellow-500">Rating: {movie.vote_average.toFixed(1)}</p>
        </motion.div>
    );
}
