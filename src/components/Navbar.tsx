import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, Navigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import axios from "axios";

// =======================
// ✅ Navbar Component
// =======================
interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

interface User {
  username: string;
  email?: string;
  role?: string;
  token?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // ✅ Load user on mount + listen for storage changes (reactive login/logout)
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ Handle Login (kept as-is)
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post("https://localhost:5272/api/Auth/login", {
        username,
        passwordHash: password,
      });

      if (response.data.user) {
        const loggedUser: User = {
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token,
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);

        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid username or password.");
    }
  };

  // ✅ Handle Register (unchanged)
  const handleRegister = async (username: string, email: string, password: string, role: string) => {
    try {
      const response = await axios.post("https://localhost:5272/api/Auth/register", {
        username,
        email,
        passwordHash: password,
        role,
      });

      if (response.data.user) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Try again.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* BRAND */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-700 tracking-tight hover:text-blue-800 transition"
          >
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

            {/* CONDITIONAL: Profile or Login */}
            {user ? (
              <div className="relative group">
                <button className="ml-4 text-gray-700 hover:text-blue-600 text-3xl transition">
                  <FaUserCircle />
                </button>

                {/* DROPDOWN MENU */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md hidden group-hover:block">
                  <div className="px-4 py-2 border-b text-sm text-gray-600">
                    <p>{user.username}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                  </div>

                  {/* ✅ Admin Dashboard link (case-insensitive) */}
                  {user.role?.toLowerCase() === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
            )}
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

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 animate-slideDown">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <NavLink to="/" className={navLinkStyles} onClick={() => setIsOpen(false)} end>
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

            {/* CART */}
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

            {/* CONDITIONAL LOGIN / PROFILE */}
            {user ? (
              <>
                {user.role?.toLowerCase() === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition text-center"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700 text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// =======================
// ✅ AdminRoute (Protection)
// =======================
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role?.toLowerCase() !== "admin") {
    alert("Access denied. Admins only.");
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Navbar;
