import ThemeSwitcher from "./theme-switcher";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl font-bold">🎬 MovieApp</a>
            </div>
            <div className="flex-none hidden lg:block">
                <ul className="menu menu-horizontal px-1 space-x-4">
                    <li>
                        <a className="hover:text-primary">Home</a>
                    </li>
                    <li>
                        <a className="hover:text-primary">Movies</a>
                    </li>
                    <li>
                        <a className="hover:text-primary">About</a>
                    </li>
                </ul>
            </div>

            <div className="dropdown dropdown-end lg:hidden">
                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </label>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li>
                        <a>Home</a>
                    </li>
                    <li>
                        <a>Movies</a>
                    </li>
                    <li>
                        <a>About</a>
                    </li>
                </ul>
            </div>
            <ThemeSwitcher />
        </div>
    );
}
