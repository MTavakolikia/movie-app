"use client";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import { apiClient, authenticate } from "./services/api";
import { Movie } from "./types/moveTypes";


export default function Home() {
  const [movies, setMovies] = useState([])
  useEffect(() => {
    getMovies()
  }, [])

  const getMovies = async () => {
    await authenticate();
    const res = await apiClient.get("/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc");
    setMovies(res.data.results);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies?.map((movie: Movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
