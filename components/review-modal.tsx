
"use client"

import { useState } from "react"
import { FaRegTimesCircle, FaRegUser } from "react-icons/fa"
import { GoCodeReview } from "react-icons/go";

import { Reviews } from "@/types/reviewTypes"
import { motion } from "framer-motion";
import Image from "next/image"

export default function ReviewModal({ reviews }: { reviews: Reviews }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button className="!border bg-white text-purple-500 bg-opacity-70 hover:bg-opacity-100 rounded-xl p-2" onClick={() => setShowModal(true)}><GoCodeReview size={26} />
            </button>
            {showModal &&
                <dialog className="modal  modal-open ">
                    <div className="modal-box w-11/12 p-0  max-w-full relative">
                        <div className="modal-action !m-0 ">
                            <button className="absolute z-50 left-3 top-3" onClick={() => setShowModal(false)}>
                                <FaRegTimesCircle size={26} />
                            </button>
                            <div className="container mx-auto p-4">
                                <h2 className="text-3xl font-bold text-center mb-8">⭐Reviews</h2>
                                <div className="grid grid-cols-1  gap-3">
                                    {reviews.map((review, index) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                        >
                                            <div className="card-body">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-full text-gray-700 bg-gray-300 flex items-center justify-center">
                                                            {review.author_details.avatar_path ? (
                                                                <Image
                                                                    src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
                                                                    alt={review.author}
                                                                    width={64}
                                                                    height={64}
                                                                    className="rounded-full"
                                                                    unoptimized={process.env.NODE_ENV === 'development'}
                                                                />
                                                            ) : (
                                                                <FaRegUser className="mx-auto mt-1" size={35} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold">{review.author}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {review.author_details.username}
                                                        </p>
                                                    </div>
                                                </div>




                                                <p className="my-4 text-gray-700">{review.content}</p>

                                                <div className=" text-sm w-full text-gray-500 flex items-center justify-between">


                                                    <p>Date: {new Date(review.created_at).toLocaleDateString()}</p>
                                                    <div>
                                                        {review.author_details.rating &&
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-yellow-500 text-lg">⭐</span>
                                                                <span className="font-semibold">
                                                                    {review.author_details.rating}/10
                                                                </span>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </dialog>
            }

        </>
    )
}
