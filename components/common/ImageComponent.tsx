import Image from 'next/image'
interface ImagePropTypes {
    src?: string,
    alt?: string,
    className?: string,
    height: number,
    width: number,
}
const ImageComponent = ({ src, alt = "pic", className, width = 100, height = 100 }: ImagePropTypes) => {
    return (
        <Image
            src="https://image.tmdb.org/t/p/original/nOoGIymGBNtA7AEN0B6nshSEQ1p.jpg"
            alt={alt}
            className={`rounded mb-4 ${className}`}
            width={height}
            height={width}
        />
    )
}

export default ImageComponent