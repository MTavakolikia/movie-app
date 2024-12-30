import { apiClient } from "@/services/api";
import { Movie } from "@/types/moveTypes";

export const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
};

export default async function MovieDetails({ params }: { params: { id: string } }) {
    const { id } = params;

    let movie: Movie | null = null;

    try {
        movie = await fetchMovieDetails(id);
    } catch (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-lg">Failed to load movie details. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                alt={`Backdrop or poster of the movie ${movie.title}`}
                className="rounded mb-4"
                style={{ width: "100%", maxHeight: "470px", objectFit: "cover" }}
            />
            {/* <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                width={500}
                height={300}
                className='rounded-lg'
                alt={movie?.title}
                style={{ maxWidth: '100%', height: '100%' }}
                priority
            /> */}
            <p className="text-lg mb-4">{movie.overview}</p>
            <p className="text-sm mb-2">Release Date: {movie.release_date}</p>
            <p className="text-sm text-yellow-500">Rating: {movie.vote_average}</p>
        </div>
    );
}
