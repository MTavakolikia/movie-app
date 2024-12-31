import Results from "@/components/Results";
import { fetchSearchedMovie } from "@/services/movieBySearch";
type tParams = Promise<{ searchTerm: string }>;



export default async function SearchPage({ params }: { params: tParams }) {
  const { searchTerm } = await params;

  const data = await fetchSearchedMovie(1, searchTerm);
  const movies = data.results;

  return (
    <div>
      {movies.length === 0 ? (
        <h1 className="text-center pt-6">No results found</h1>
      ) : (
        <Results results={movies} />
      )}
    </div>
  );
}
