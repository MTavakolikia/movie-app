import MovieSlider from "@/components/MovieSlider";
import { fetchPopularMovies } from "@/services/popularMovies";
import { fetchTopMovies } from "@/services/topMovies";
import { fetchUpcomingMovies } from "@/services/upcomingMovies";

export default async function page() {
    const topMovies = await fetchTopMovies();
    const popularMovies = await fetchPopularMovies();
    const upcomingMovies = await fetchUpcomingMovies();
    return (
        <div className="container mx-auto p-4">
            <div>
                <h1 className="text-3xl font-bold mb-6 text-center">Top Movies</h1>
                {<MovieSlider movies={topMovies} />}
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-6 text-center">Popular Movies</h1>
                {<MovieSlider movies={popularMovies} />}
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Movies</h1>
                {<MovieSlider movies={upcomingMovies} />}
            </div>

        </div>
    )
}

