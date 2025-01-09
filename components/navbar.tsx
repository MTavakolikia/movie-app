import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import SearchBox from "./search/SearchBox";
import { IoHomeOutline } from "react-icons/io5";
import { BiCameraMovie } from "react-icons/bi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { RiContactsBookLine } from "react-icons/ri";

export default function Navbar() {
    return (
        <div className="navbar shadow-lg bg-slate-800 text-slate-200 sticky top-0 z-50">
            <div className="">
                <Link href={"/"} className="btn btn-ghost text-xl font-bold">🎬 MovieApp</Link>
            </div>
            <div className=" flex-1 hidden lg:block">
                <ul className="menu menu-horizontal flex-1 hidden px-1  lg:flex">
                    <li>

                        <Link href={"/"} className="hover:text-primary"><IoHomeOutline />Home</Link>
                    </li>
                    <li>

                        <Link href={"/movies"} className="hover:text-primary"> <BiCameraMovie />Movies</Link>
                    </li>
                    <li>

                        <Link href={"/about"} className="hover:text-primary"> <IoMdInformationCircleOutline />About</Link>
                    </li>
                    <li>

                        <Link href={"/contact"} className="hover:text-primary">  <RiContactsBookLine />Contact</Link>
                    </li>
                </ul>
            </div>
            <div className="flex gap-4">
                <SearchBox />
                <ThemeSwitcher />

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
                        <Link href={"/"} >Home</Link>
                    </li>
                    <li>
                        <Link href={"/movies"} >Movies</Link>
                    </li>
                    <li>
                        <Link href={"/about"} >About</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
