import MovieCard from "./MovieCard";

export default function Results({ results }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3">
        {results.map((result) => (
          <MovieCard key={result.id} movie={result} />
        ))}
      </div>
    </div>
  );
}
