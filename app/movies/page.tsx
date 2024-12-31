import MovieSlider from "@/components/MovieSlider";
import { fetchPopularMovies } from "@/services/popularMovies";

export default async function page() {
    const data = await fetchPopularMovies();
    const movies = data.results;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Top Movies</h1>
            {<MovieSlider movies={movies} />}
        </div>
    )
}
