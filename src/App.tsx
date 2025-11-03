import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaBoxes,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaBell,
  FaQuestionCircle,
  FaHome,
} from "react-icons/fa";

// 🧭 Pages (Public)
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import StoreLocatorPage from "./pages/StoreLocatorPage";
import AboutPage from "./pages/AboutPage";
import EditProfilePage from "./pages/EditProfilePage";
import AddressPage from "./pages/AddressPage";

// 🧑‍💼 Admin Pages
import Dashboard from "./admin/Dashboard";
import Inventory from "./admin/Inventory";
import Orders from "./admin/Orders";
import Reports from "./admin/Reports";
import Settings from "./admin/Settings";
import Users from "./admin/Users";

// 🧩 Components
import Navbar from "./components/Navbar";
import PromoBar from "./components/PromoBar";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";
import ChatBot from "./components/ChatBot";

/* -------------------------------------
 🧱 ADMIN LAYOUT (Sidebar + Protected)
-------------------------------------- */
const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/admin/inventory" },
    { name: "Orders", icon: <FaClipboardList />, path: "/admin/orders" },
    { name: "Reports", icon: <FaChartLine />, path: "/admin/reports" },
    { name: "Products", icon: <FaBoxes />, path: "/admin/products" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm">
        <div className="flex items-center mb-6">
          <img src="/logo192.png" alt="Logo" className="w-8 h-8 mr-2 rounded-md" />
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t mt-4 pt-3 text-sm text-gray-600 space-y-2">
          <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FaQuestionCircle className="mr-2" /> Help Center
          </button>
          <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FaBell className="mr-2 text-red-500" /> Notifications
            <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              3
            </span>
          </button>

          <div className="flex items-center mt-3 px-3 py-2 bg-gray-100 rounded-lg">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium">{user?.username || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          <div className="mt-3 text-center text-xs text-gray-400">
            © 2025 Allen City Pharmacy
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

/* -------------------------------------
 🌐 MAIN APP COMPONENT
-------------------------------------- */
function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      setCart(parsed);
      updateCartCount(parsed);
    }
  }, []);

  useEffect(() => {
    const syncCart = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart);
  }, [cart]);

  const updateCartCount = (cartItems: any[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };

  const setQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".cart-toggle-btn")
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide Navbar in admin area */}
      {!location.pathname.startsWith("/admin") && (
        <>
          <Navbar
            cartCount={cartCount}
            onCartClick={() => setIsCartOpen((prev) => !prev)}
          />
          <PromoBar visible={promoVisible} onClose={() => setPromoVisible(false)} />
        </>
      )}

      <main className="flex-1">
        <Routes>
          {/* 🌐 Public Site Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage onAdd={addToCart} />} />
          <Route path="/order" element={<OrderPage />} />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                setQty={setQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            }
          />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/address" element={<AddressPage />} />

          {/* 🧑‍💼 Admin Routes (With Sidebar Layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!location.pathname.startsWith("/admin") && <Footer />}

      {isCartOpen && !location.pathname.startsWith("/admin") && (
        <div
          ref={cartRef}
          className="fixed right-6 top-24 z-50 hidden md:block animate-slide-in"
        >
          <CartPanel
            cart={cart}
            setQty={setQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        </div>
      )}

      {!location.pathname.startsWith("/admin") && <ChatBot />}
    </div>
  );
}

export default App;
