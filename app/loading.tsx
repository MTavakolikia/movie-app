export default function Loading() {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (

                    <>


                        <div key={index}
                            className="card w-[100%] sm:w-80 lg:w-96 rounded-lg shadow-xl flex h-[412px] flex-col gap-4">
                            <div className="skeleton h-[216px] w-full"></div>
                            <div className="card-body">
                                <div className="skeleton h-8 w-28"></div>

                                <div className="skeleton h-16 w-full"></div>

                                <div className="flex justify-between items-center mt-2">
                                    <div className="skeleton h-4 w-44"></div>
                                    <div className="skeleton h-4 w-16"></div>
                                </div>
                            </div>
                        </div>
                    </>



                ))}
            </div>
        </div>
    );
}



// export default function Loading() {
//     // Or a custom loading skeleton component
//     return <span className="loading loading-bars loading-lg"></span>

// }