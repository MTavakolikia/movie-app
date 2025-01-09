"use client"


import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { PopularMovie } from '@/types/popularMoviesTypes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


// import required modules
type MovieSliderProps = {
    movies: PopularMovie[];
};

const Carousel: React.FC<MovieSliderProps> = ({ movies }) => {
    const router = useRouter();

    const handleMovieClick = async (id: number) => {
        router.push(`/movies/${id}`);
    };
    return (
        <Swiper
            effect={'coverflow'}
            modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
            grabCursor={true}
            centeredSlides={true}
            navigation={{
                enabled: true
            }}
            slidesPerView={'auto'}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
            }}
            keyboard={{
                enabled: true,
            }}
            autoplay={{ delay: 3000 }}
            className="mySwiper"
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 2 },
            }}

        >
            {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                    <div className="movie-card relative">
                        <Image
                            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path
                                }`}
                            alt={movie?.title}
                            width={1000}
                            height={800}
                            className="rounded-lg"
                            unoptimized={process.env.NODE_ENV === 'development'}
                        />
                        <h3 className="text-base font-bold absolute bottom-3 left-3 drop-shadow-2xl bg-slate-600 bg-opacity-50 rounded-xl px-2 border border-slate-500">{movie.title}</h3>
                        <span className='cursor-pointer absolute bottom-3 right-3 drop-shadow-2xl bg-slate-600 bg-opacity-50 rounded-xl px-2 border border-slate-500' onClick={() => handleMovieClick(movie.id)}>View More</span>
                    </div>
                </SwiperSlide>
            ))}

        </Swiper>
    );
};

export default Carousel;