import MovieCard from "@/components/MovieCard";
import { fetchPopularMovies } from "@/services/popularMovies";
import { PopularMovie } from "@/types/popularMoviesTypes";

export default async function Home() {
  const movies = await fetchPopularMovies();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3">
        {movies.map((movie: PopularMovie, index: number) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

    </div>
  );
}
