import ImageGalleryModal from "@/components/image-gallery-modal";
import { fetchMovieDetails, fetchMovieImageById } from "@/services/movieById";
import { IMovieGallery, Movie } from "@/types/moveTypes";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";

interface Params {
    id: string;
}

export default async function MovieDetails({
    params,
}: {
    params: Promise<Params>
}) {
    const { id } = await params;

    let movie: Movie | null = null;
    let movieGallery: IMovieGallery = { backdrops: [] };

    try {
        movie = await fetchMovieDetails(id);
        movieGallery = await fetchMovieImageById(id);
    } catch (err) {
        console.error("Error fetching movie details:", err);
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-lg">Failed to load movie details. Please try again later.</p>
            </div>
        );
    }


    return (
        <div className="flex ">
            <div className="relative w-full h-[88vh] rounded">
                <div className="absolute top-5 right-5">
                    <ImageGalleryModal movieGallery={movieGallery.backdrops} />
                </div>

                <Image
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path
                        }`}
                    alt={`Poster for ${movie?.title}`}
                    width={500}
                    height={300}
                    className=" object-contain h-full mx-auto"
                />
            </div>

            <div className="card shadow-lg p-4 bg-base-100 m-4">
                <div className="card-body">
                    <h2 className="card-title text-3xl">{movie?.title}</h2>
                    <div className="flex flex-wrap gap-2 flex-col">
                        <p>{movie?.tagline}</p>
                        <span>
                            {movie?.genres?.map((item) => (
                                <span key={item.id} className="badge badge-outline badge-secondary">{item.name}</span>
                            ))}
                        </span>
                    </div>
                    <p className="text-lg mt-4">{movie?.overview}</p>
                    <div className="text-yellow-500 flex items-center gap-2">
                        <FaStar /> {movie?.vote_average}/10 <span>({movie?.vote_count} votes)</span>
                    </div>
                    <div className="mt-2">
                        <p className="font-bold">Budget: ${movie?.budget}</p>
                        <div className="flex gap-2 mt-4 ">
                            {movie?.production_companies?.map(
                                (item) =>
                                    item.logo_path && (
                                        <Image
                                            key={item.id}
                                            src={`https://image.tmdb.org/t/p/original/${item.logo_path}`}
                                            alt={movie?.title}
                                            width={16}
                                            height={16}
                                            className="w-16 h-16 p-1 object-contain rounded-lg bg-white shadow-md bg-opacity-40  border border-white"
                                        />
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
