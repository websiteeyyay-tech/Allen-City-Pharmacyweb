import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void; // ✅ Added prop for cart toggle
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false); // for mobile menu

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FLEX CONTAINER */}
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            Allen City Pharmacy
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-6 items-center">
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

            {/* 🛒 CART ICON (Click toggles panel) */}
            <button
              onClick={onCartClick}
              className="relative focus:outline-none"
            >
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 hover:text-blue-600"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <NavLink to="/" className={navLinkStyles} end onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/services" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/store-locator" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Store Locator
            </NavLink>
            <NavLink to="/order" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Order
            </NavLink>
            <NavLink to="/checkout" className={navLinkStyles} onClick={() => setIsOpen(false)}>
              Checkout
            </NavLink>

            {/* 🛒 CART ICON in MOBILE */}
            <button
              onClick={() => {
                setIsOpen(false);
                onCartClick(); // ✅ open cart on mobile too
              }}
              className="relative focus:outline-none"
            >
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;