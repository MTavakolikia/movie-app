import ImageGalleryModal from "@/components/image-gallery-modal";
import MovieSlider from "@/components/MovieSlider";
import ReviewModal from "@/components/review-modal";
import { fetchMovieDetails, fetchMovieImageById, fetchRecommendationsById, fetchReviewsById } from "@/services/movieById";
import { IMovieGallery, Movie } from "@/types/moveTypes";
import { PopularMovie } from "@/types/popularMoviesTypes";
import { Reviews } from "@/types/reviewTypes";
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
    let recommendations: PopularMovie[] | null = null;
    let movieGallery: IMovieGallery = { backdrops: [] };
    let reviews: Reviews | null = null

    try {
        movie = await fetchMovieDetails(id);
        movieGallery = await fetchMovieImageById(id);
        recommendations = await fetchRecommendationsById(id);
        reviews = await fetchReviewsById(id)

    } catch (err) {
        console.error("Error fetching movie details:", err);
        return (
            <div className="container mx-auto p-4 flex items-center justify-center h-[50vh] text-center">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-lg">Failed to load movie details. Please try again later.</p>
            </div>
        );
    }


    return (<div>
        <div className="flex ">
            <div className="relative w-full h-[88vh] rounded">
                <div className="absolute top-5 right-5">
                    <ImageGalleryModal movieGallery={movieGallery.backdrops} />
                </div>
                {reviews.length > 0 &&
                    <div className="absolute top-20 right-5">
                        <ReviewModal reviews={reviews} />
                    </div>
                }


                <Image
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path || movie.backdrop_path
                        }` : '/default-image.png'}
                    alt={`Poster for ${movie?.title}`}
                    width={500}
                    height={300}
                    className=" object-contain h-full mx-auto"
                    unoptimized={process.env.NODE_ENV === 'development'}
                    priority
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
                        <FaStar /> {movie?.vote_average.toFixed(1)}/10 <span>({movie?.vote_count} votes)</span>
                    </div>
                    <div className="mt-2">
                        <p className="font-bold">Budget: ${movie?.budget}</p>
                        <div className="flex gap-2 mt-4 ">
                            {movie?.production_companies?.map(
                                (item) =>
                                    item.logo_path && (
                                        <Image
                                            key={item.id}
                                            src={item.logo_path ? `https://image.tmdb.org/t/p/original/${item.logo_path}` : '/default-image.png'}
                                            alt={movie?.title}
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 p-1 object-contain rounded-lg bg-white shadow-md bg-opacity-40  border border-white"
                                            unoptimized={process.env.NODE_ENV === 'development'}

                                        />
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div className="container mx-auto my-10">
            <h1 className="text-3xl font-bold mb-6 text-center">❤️ Recommendation Movies</h1>
            {<MovieSlider movies={recommendations} />}
        </div>
    </div>

    );
}
