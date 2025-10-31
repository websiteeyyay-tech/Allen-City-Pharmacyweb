import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

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
import Products from "./admin/Products";
import Reports from "./admin/Reports";
import Settings from "./admin/Settings";
import Users from "./admin/Users";

// 🧩 Components
import Navbar from "./components/Navbar";
import PromoBar from "./components/PromoBar";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";
import ChatBot from "./components/ChatBot";

function App() {
  // 🛒 CART STATE
  const [cart, setCart] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // 🎁 PROMO BAR
  const [promoVisible, setPromoVisible] = useState(true);

  // 🧺 CART PANEL VISIBILITY
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🪟 Reference to detect outside clicks
  const cartRef = useRef<HTMLDivElement>(null);

  // 🔁 Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      setCart(parsed);
      updateCartCount(parsed);
    }
  }, []);

  // 🔄 Sync cart between tabs
  useEffect(() => {
    const syncCart = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // 💾 Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart);
  }, [cart]);

  // 🧠 Update total item count
  const updateCartCount = (cartItems: any[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  };

  // ➕ Add item to cart
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

  // 🔢 Update quantity
  const setQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item))
    );
  };

  // ❌ Remove from cart
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // 🧹 Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // 👇 Auto-close cart panel when clicking outside
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

      {/* ✅ Navbar with cart toggle */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen((prev) => !prev)}
      />

      <PromoBar visible={promoVisible} onClose={() => setPromoVisible(false)} />

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



          {/* 🧑‍💼 Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/users" element={<Users />} />

          {/* Fallback route → HomePage */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      {/* 🛒 Cart panel (desktop only) */}
      {isCartOpen && (
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

      <ChatBot />
    </div>
  );
}

export default App;
