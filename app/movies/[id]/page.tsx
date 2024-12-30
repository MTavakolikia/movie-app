import { apiClient } from "@/services/api";
// import Image from "next/image";

export const fetchMovieDetails = async (movieId: string) => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
};

export default async function MovieDetails({ params }: { params: { id: string } }) {
    const { id } = await params;
    const movie = await fetchMovieDetails(id)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
            {/* <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                width={500}
                height={300}
                className='rounded-lg'
                alt={movie?.title}
                style={{ maxWidth: '100%', height: '100%' }}
                priority
            /> */}
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                alt={movie?.title}
                className="rounded mb-4"
                style={{ width: "100%", maxHeight: "470px", objectFit: "cover" }}
            />
            <p className="text-lg mb-4">{movie?.overview}</p>
            <p className="text-sm mb-2">Release Date: {movie?.release_date}</p>
            <p className="text-sm text-yellow-500">Rating: {movie?.vote_average}</p>
        </div>
    );
};

