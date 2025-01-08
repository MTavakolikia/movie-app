import Image from "next/image";

interface Image {
    aspect_ratio: number;
    file_path: string;
}

interface IImages {
    images: Image[];
}

export default function MovieCarousel({ images }: IImages) {
    return (
        <div className="carousel w-full">
            {images.map((image, index) => (
                <div
                    key={`slide${index}`}
                    id={`slide${index}`}
                    className="carousel-item relative w-full h-[85vh]"
                >

                    <Image
                        src={`https://image.tmdb.org/t/p/original/${image.file_path}`}
                        alt={`Slide ${index + 1}`}
                        width={500}
                        height={300}
                        className="w-full  object-contain"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a
                            href={`#slide${(index - 1 + images.length) % images.length}`}
                            className="btn btn-circle"
                        >
                            ❮
                        </a>
                        <a
                            href={`#slide${(index + 1) % images.length}`}
                            className="btn btn-circle"
                        >
                            ❯
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
