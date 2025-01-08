export default function MovieByIdLoading() {
    return (
        <div className="flex animate-pulse">
            <div className="relative w-1/2 h-[88vh] rounded ">
                <div className="absolute top-5 right-5">
                    <div className="w-12 h-12  rounded-full"></div>
                </div>
                <div className="skeleton  bg-base-100 w-full h-full "></div>
            </div>

            <div className="card shadow-lg p-4 bg-base-100 m-4  w-full">
                <div className="card-body">
                    <div className="skeleton h-10 w-3/4 mb-4"></div>
                    <div className="skeleton h-6 w-1/2 mb-4"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="skeleton h-6 w-16"></div>
                        ))}
                    </div>
                    <div className="skeleton h-20 w-full mb-4"></div>
                    <div className="skeleton h-6 w-1/4 mb-4"></div>
                    <div className="skeleton h-6 w-1/3 mb-4"></div>
                    <div className="flex gap-2 mt-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="skeleton w-16 h-16 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}