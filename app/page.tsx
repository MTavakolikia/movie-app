import Carousel from "@/components/carousel";
import MovieCard from "@/components/MovieCard";
import { fetchPopularMovies } from "@/services/popularMovies";
import { PopularMovie } from "@/types/popularMoviesTypes";

export default async function Home() {
  const movies = await fetchPopularMovies();

  return (
    <div className="container mx-auto p-4">
      <div className="my-10">
        <h1 className="text-5xl font-bold mb-10 text-center bg-gradient-to-b from-violet-800 to-violet-400 bg-clip-text text-transparent">Welcome To MovieApp</h1>
        <Carousel movies={movies} />
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-10 text-center bg-gradient-to-b from-violet-800 to-violet-400 bg-clip-text text-transparent">🔥Popular Movies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3">
          {movies.map((movie: PopularMovie, index: number) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      </div>


    </div>
  );
}
