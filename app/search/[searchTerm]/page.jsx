import Results from "@/components/Results";
import { apiClient } from "@/services/api";

export const fetchSearchedMovie = async (page = 1, searchParam = "") => {
  const response = await apiClient.get("/search/movie", {
    params: {
      query: searchParam,
      include_adult: false,
      language: "en-US",
      primary_release_year: "",
      page,
      region: "popularity.desc",
      year: "",
    },
  });
  return response.data;
};

export default async function SearchPage({ params }) {
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
