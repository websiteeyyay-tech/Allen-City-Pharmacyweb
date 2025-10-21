import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-10">

            {/* TOP SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* LOGO / ABOUT */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Allen City Pharmacy</h2>
                    <p className="text-gray-300">
                        Providing quality health and wellness products with exceptional service.
                    </p>
                </div>

                {/* NAVIGATION LINKS */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="hover:text-blue-400">Home</Link>
                        </li>
                        <li>
                            <Link to="/shop" className="hover:text-blue-400">Shop</Link>
                        </li>
                        <li>
                            <Link to="/services" className="hover:text-blue-400">Services</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-blue-400">Contact</Link>
                        </li>
                        <li>
                            <Link to="/store-locator" className="hover:text-blue-400">Store Locator</Link>
                        </li>
                        <li>
                            <Link to="/order" className="hover:text-blue-400">Order</Link>
                        </li>
                        <li>
                            <Link to="/checkout" className="hover:text-blue-400">Checkout</Link>
                        </li>
                    </ul>
                </div>

                {/* SOCIAL MEDIA */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-blue-400 text-2xl">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="text-gray-300 hover:text-pink-400 text-2xl">
                            <FaInstagram />
                        </a>
                        <a href="#" className="text-gray-300 hover:text-sky-400 text-2xl">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

            </div>

            {/* BOTTOM SECTION */}
            <div className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} Allen City Pharmacy. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;