import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, Navigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import type { JSX } from "react/jsx-runtime";

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
  avatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Hide navbar on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Load user on mount + listen for storage changes
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      } else setUser(null);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Login
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
          avatar: response.data.user.avatar,
        };
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect admin to dashboard
        if (loggedUser.role?.trim().toLowerCase() === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid username or password.");
    }
  };

  // Register
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <>
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

              {/* PROFILE / LOGIN */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="ml-4 text-gray-700 hover:text-blue-600 text-3xl transition transform hover:scale-110"
                  >
                    {user.avatar ? (
                      <motion.img
                        src={user.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="px-6 py-4 bg-green-50 border-b border-green-100 text-center">
                          {user.avatar && (
                            <img
                              src={user.avatar}
                              alt="Avatar"
                              className="w-16 h-16 rounded-full mx-auto mb-2 object-cover shadow-sm"
                            />
                          )}
                          <p className="font-semibold text-green-700">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email || user.role}</p>
                        </div>

                        {/* User Links */}
                        <div className="flex flex-col">
                          <Link
                            to="/edit-profile"
                            className="px-6 py-3 text-green-700 hover:bg-green-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Edit Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="px-6 py-3 text-green-700 hover:bg-green-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Settings
                          </Link>
                          <Link
                            to="/address"
                            className="px-6 py-3 text-green-700 hover:bg-green-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Address
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-6 py-3 text-green-700 hover:bg-green-50 transition"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg flex flex-col">
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
          </div>
        )}
      </nav>
    </>
  );
};

// =======================
// ✅ AdminRoute
// =======================
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role?.trim().toLowerCase() !== "admin") {
    alert("Access denied. Admins only.");
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Navbar;
