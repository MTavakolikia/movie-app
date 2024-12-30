import Link from "next/link"
import { FaEnvelope, FaInstagram, FaTelegram } from "react-icons/fa6"
import { MdOutlinePhoneAndroid } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
            <nav className="grid grid-flow-col gap-4">
                <Link href={"/about"} className="link link-hover">About</Link>
                <Link href={"/contact"} className="link link-hover">Contact</Link>
                <Link href={"/movies"} className="link link-hover">Movies</Link>
                <a target="_blank" href="https://mtk-portfolio-gamma.vercel.app" className="link link-hover">My Portfolio</a>
            </nav>
            <nav>
                <div className="grid grid-flow-col gap-4 text-2xl">
                    <a className="tooltip  tooltip-bottom" data-tip="mtwebdev.ir" target="_blank" href="https://instagram.com/mtwebdev.ir">
                        <FaInstagram />
                    </a>
                    <a className="tooltip  tooltip-bottom" data-tip="mtwebdev_ir" target="_blank" href="https://t.me/mtwebdev_ir">
                        <FaTelegram />
                    </a>
                    <a className="tooltip  tooltip-bottom" data-tip="mtwebdev66@gmail.com" target="_blank" href="mailto:mtwebdev66@gmail.com">
                        <FaEnvelope />
                    </a>
                    <a className="tooltip  tooltip-bottom" data-tip="+989128048579" target="_blank" href="tel:+989128048579">
                        <MdOutlinePhoneAndroid />
                    </a>
                </div>
            </nav>
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by Mohammad Tavakolikia</p>
            </aside>
        </footer>
    )
}

export default Footer