import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* BRAND NAME / LOGO AREA */}
          <Link to="/" className="text-xl font-bold text-blue-700 tracking-tight hover:text-blue-800 transition">
            Allan City Pharmacy
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkStyles} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkStyles}>
              Shop
            </NavLink>
            <NavLink to="/services" className={navLinkStyles}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkStyles}>
              Contact
            </NavLink>
            <NavLink to="/store-locator" className={navLinkStyles}>
              Store Locator
            </NavLink>
            <NavLink to="/order" className={navLinkStyles}>
              Order
            </NavLink>
            <NavLink to="/checkout" className={navLinkStyles}>
              Checkout
            </NavLink>

            {/* CART ICON */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Open cart"
            >
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition-transform duration-200 hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* LOGIN BUTTON */}
            <Link
              to="/login"
              className="ml-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 animate-slideDown">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <NavLink
              to="/"
              className={navLinkStyles}
              end
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/services"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/store-locator"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Store Locator
            </NavLink>
            <NavLink
              to="/order"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Order
            </NavLink>
            <NavLink
              to="/checkout"
              className={navLinkStyles}
              onClick={() => setIsOpen(false)}
            >
              Checkout
            </NavLink>

            {/* CART ICON */}
            <button
              onClick={() => {
                setIsOpen(false);
                onCartClick();
              }}
              className="relative focus:outline-none self-start"
              aria-label="Open cart"
            >
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition-transform duration-200 hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* LOGIN BUTTON */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
