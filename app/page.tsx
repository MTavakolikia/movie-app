"use client";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { apiClient, authenticate } from "./services/api";
import { Movie } from "./types/moveTypes";
import ThemeSwitcher from "@/components/theme-switcher";


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
    <div className="container mx-auto p-4">
      <ThemeSwitcher />
      <h1 className="text-3xl font-bold mb-6 text-center">Top Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
}
