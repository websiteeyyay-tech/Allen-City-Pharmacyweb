import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// 🧭 Public Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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
import AdminLayout from "./admin/AdminLayout"; // ✅ imported layout
import Dashboard from "./admin/Dashboard";
import Inventory from "./admin/Inventory";
import Orders from "./admin/Orders";
import Reports from "./admin/Reports";
import Settings from "./admin/Settings";
import Users from "./admin/Users";

// 💊 Pharmacist Pages
import PharmacistLayout from "./pharmacist/PharmacistLayout";
import MedicinesPage from "./pharmacist/MedicinesPage";
import PharmacistMedicines from "./pharmacist/PharmacistMedicines";
import PharmacistInventory from "./pharmacist/PharmacistInventory";
import PharmacistReports from "./pharmacist/PharmacistReports";
import PharmacistSettings from "./pharmacist/PharmacistSettings";

// 🧩 Components
import Navbar from "./components/Navbar";
import PromoBar from "./components/PromoBar";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";
import ChatBot from "./components/ChatBot";

/* -------------------------------------
 🌐 MAIN APP
-------------------------------------- */
function App() {
  const [cart, setCart] = useState<any[]>(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [cartCount, setCartCount] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const updateCartCount = (items: any[]) =>
    setCartCount(items.reduce((sum, item) => sum + (item.qty || 0), 0));

  useEffect(() => updateCartCount(cart), [cart]);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart((p) => p.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);
  const setQty = (id: number, qty: number) =>
    qty <= 0 ? removeFromCart(id) : setCart((p) => p.map((i) => (i.id === id ? { ...i, qty } : i)));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".cart-toggle-btn")
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = location.pathname.startsWith("/admin");
  const isPharmacist = location.pathname.startsWith("/pharmacist");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && !isPharmacist && (
        <>
          <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen((p) => !p)} />
          <PromoBar visible={promoVisible} onClose={() => setPromoVisible(false)} />
        </>
      )}

      <main className="flex-1">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage onAdd={addToCart} />} />
          <Route path="/order" element={<OrderPage />} />
          <Route
            path="/checkout"
            element={<CheckoutPage cart={cart} setQty={setQty} removeFromCart={removeFromCart} clearCart={clearCart} />}
          />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/address" element={<AddressPage />} />

          {/* 🧑‍💼 Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* 💊 Pharmacist Routes */}
          <Route path="/pharmacist" element={<PharmacistLayout />}>
            <Route path="dashboard" element={<PharmacistMedicines />} />
            <Route path="inventory" element={<PharmacistInventory />} />
            <Route path="medicines" element={<MedicinesPage />} />
            <Route path="reports" element={<PharmacistReports />} />
            <Route path="pharmacist-medicines" element={<PharmacistMedicines />} />
            <Route path="settings" element={<PharmacistSettings />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdmin && !isPharmacist && <Footer />}
      {isCartOpen && !isAdmin && !isPharmacist && (
        <div ref={cartRef} className="fixed right-6 top-24 z-50 hidden md:block animate-slide-in">
          <CartPanel cart={cart} setQty={setQty} removeFromCart={removeFromCart} clearCart={clearCart} />
        </div>
      )}
      {!isAdmin && !isPharmacist && <ChatBot />}
    </div>
  );
}

export default App;
