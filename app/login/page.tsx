import Image from "next/image";

export default function page() {
    return (
        <div className="hero bg-base-200 h-full p-6">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body">
                        <label className="label" htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="email" className="input" required />
                        <label className="label" htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="password" className="input" required />
                        <a href="#" className="label link link-hover">Forgot password?</a>
                        <button className="btn btn-primary mt-6">Login</button>
                    </form>
                </div>
                <Image
                    src="https://images.unsplash.com/photo-1635805737707-575885ab0820"
                    alt="Test Image"
                    width={500}
                    height={300}
                    className="rounded-lg"
                    unoptimized={process.env.NODE_ENV === 'development'}

                />
            </div>
        </div>
    )
}
