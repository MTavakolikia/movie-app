
"use client"

import { useState } from "react"
import { MdImageSearch } from "react-icons/md"
import MovieCarousel from "./movie-carousel"
import { FaRegTimesCircle } from "react-icons/fa"
type MoviePictures = {
    movieGallery: { file_path: string; aspect_ratio: number }[]
}
export default function ImageGalleryModal({ movieGallery }: MoviePictures) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button className="!border bg-white text-purple-500 bg-opacity-70 hover:bg-opacity-100 rounded-xl p-2" onClick={() => setShowModal(true)}><MdImageSearch size={26} />
            </button>
            {showModal &&
                <dialog className="modal  modal-open ">
                    <div className="modal-box w-11/12 p-0  max-w-full relative">
                        <div className="modal-action !m-0">
                            <form method="dialog">
                                {movieGallery?.length > 0 ? (
                                    <MovieCarousel images={movieGallery} />
                                ) : <p>loading</p>}
                                <button className="absolute left-3 top-3" onClick={() => setShowModal(false)}><FaRegTimesCircle size={26} />
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            }

        </>
    )
}
