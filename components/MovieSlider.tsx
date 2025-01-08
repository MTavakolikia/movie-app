"use client"
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Controller, EffectCards, Mousewheel, Navigation } from 'swiper/modules';
import { PopularMovie } from '@/types/popularMoviesTypes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type MovieSliderProps = {
    movies: PopularMovie[];
};

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {
    const router = useRouter();
    const handleMovieClick = async (id: number) => {
        router.push(`/movies/${id}`);
    };
    return (
        <Swiper
            modules={[Controller, Navigation, Autoplay, EffectCards, Mousewheel]}
            spaceBetween={10}
            slidesPerView={4}
            navigation
            autoplay={{ delay: 3000 }}
            effect="fade"
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            }}
        >
            {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                    <div className="movie-card cursor-pointer" onClick={() => handleMovieClick(movie.id)}>
                        <Image
                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path || movie.backdrop_path
                                }`}
                            alt={movie?.title}
                            width={600}
                            height={400}
                            className="rounded-lg"
                            unoptimized={process.env.NODE_ENV === 'development'}

                        />
                        <h3 className="text-lg font-bold mt-2">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.release_date}</p>
                        <p className="text-yellow-500 font-semibold">
                            Rating: {movie.vote_average.toFixed(1)}/10
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default MovieSlider;
