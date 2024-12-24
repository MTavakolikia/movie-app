// import { Navigation, Autoplay } from 'swiper';
"use client"
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay"
import { Movie } from '../types/moveTypes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Controller, EffectCards, Mousewheel, Navigation } from 'swiper/modules';

type MovieSliderProps = {
    movies: Movie[];
};

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {

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
                    <div className="movie-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded-lg"
                        />
                        <h3 className="text-lg font-bold mt-2">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.release_date}</p>
                        <p className="text-yellow-500 font-semibold">
                            Rating: {movie.vote_average}/10
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default MovieSlider;
