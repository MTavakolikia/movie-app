import MovieCard from "@/components/MovieCard";
import { apiClient } from "@/services/api";
import { Movie } from "@/types/moveTypes";

export const fetchPopularMovies = async (page = 1) => {
  const response = await apiClient.get("/discover/movie", {
    params: {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page,
      sort_by: "popularity.desc",
    },
  });
  return response.data;
};

export default async function Home() {
  const data = await fetchPopularMovies();
  const movies = data.results;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3">
        {movies.map((movie: Movie, index: number) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

    </div>
  );
}
