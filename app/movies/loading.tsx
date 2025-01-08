"use client";

export default function MovieSliderSkeleton() {
    return (
        <div>
            <div className="h-10 w-64 my-4 rounded skeleton mx-auto "></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 lg:grid-cols-5 gap-2">
                {
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index}>
                            <div className="rounded-lg skeleton h-[380px]"></div>
                            <div className="h-6 w-3/4 mt-2 rounded skeleton "></div>
                            <div className="h-4 w-1/2 mt-2 rounded skeleton "></div>
                            <div className="h-4 w-1/4 mt-2 rounded skeleton "></div>
                        </div>
                    ))
                }
            </div>
        </div>

    );
}