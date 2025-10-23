import React, { useEffect, useMemo, useState } from "react";
import Visa from "../assets/Visa.png";
import Mastercard from "../assets/Mastercard.png";
import Amex from "../assets/amex.png";
import Googleplay from "../assets/Googleplay.png";
import Paypal from "../assets/Paypal.png";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CheckoutPageProps {
  cart: CartItem[];
  setQty: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  setQty,
  removeFromCart,
  clearCart,
}) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    deliveryMethod: "standard",
    orderNotes: "",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCVC: "",
    tos: false,
  });

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cart]
  );

  useEffect(() => {
    const updateCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const items = JSON.parse(storedCart) as CartItem[];
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
        const shipping = items.length > 0 ? 120 : 0;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        setCheckoutData({
          items,
          subtotal,
          shipping,
          tax,
          total,
        });
      }
    };

    updateCart(); // initial load
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePlaceOrder = () => {
    if (!formData.tos) {
      alert("Please agree to the terms and privacy policy.");
      return;
    }

    alert("✅ Order placed successfully! Thank you for trusting Allen City Pharmacy.");

    // 🧹 Clear both checkout data and global cart
    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutData");

    // 🔁 Redirect back to home
    window.location.href = "/";
  };

  return (
    <div className="text-gray-800 font-sans bg-[linear-gradient(135deg,#22c55e_0%,#f97316_100%)] bg-fixed min-h-screen flex flex-col">
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        {/* Progress Tracker */}
        <div className="flex justify-center items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-700 text-white font-bold">
              1
            </div>
            <span className="text-green-800 font-medium">Cart</span>
            <div className="w-10 h-[2px] bg-green-700"></div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-700 text-white font-bold">
              2
            </div>
            <span className="text-green-800 font-medium">Checkout</span>
            <div className="w-10 h-[2px] bg-green-700"></div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white font-bold">
              3
            </div>
            <span className="text-gray-400 font-medium">Order Complete</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Secure Checkout
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Your health and safety are our priority. Please review your order carefully,
          enter accurate information, and complete your secure payment below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-xl font-semibold text-green-800 border-b pb-2">
                Billing Information
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                Please provide your complete billing and delivery information.
                Fields marked with * are required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name *"
                  className="p-3 border rounded-md"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name *"
                  className="p-3 border rounded-md"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <input
                id="email"
                type="email"
                placeholder="Email *"
                className="p-3 border rounded-md w-full"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <input
                id="address"
                type="text"
                placeholder="Street Address *"
                className="p-3 border rounded-md w-full"
                required
                value={formData.address}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  id="city"
                  type="text"
                  placeholder="City *"
                  className="p-3 border rounded-md"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  id="state"
                  type="text"
                  placeholder="State/Region *"
                  className="p-3 border rounded-md"
                  required
                  value={formData.state}
                  onChange={handleChange}
                />
                <input
                  id="zip"
                  type="text"
                  placeholder="ZIP / Postal *"
                  className="p-3 border rounded-md"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>

              <input
                id="phone"
                type="tel"
                placeholder="Phone (for delivery updates) *"
                className="p-3 border rounded-md w-full"
                required
                value={formData.phone}
                onChange={handleChange}
              />

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Delivery Method
                </label>
                <select
                  id="deliveryMethod"
                  className="p-3 border rounded-md w-full"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                >
                  <option value="standard">Standard (2–4 days) - ₱120</option>
                  <option value="express">Express (1–2 days) - ₱250</option>
                  <option value="pickup">In-store Pickup (Free)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Free same-day pickup available at select Allen City Pharmacy branches.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="orderNotes"
                  rows={3}
                  className="p-3 border rounded-md w-full"
                  placeholder="Leave delivery instructions or special requests..."
                  value={formData.orderNotes}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Details */}
              <h2 className="text-xl font-semibold text-green-800 border-b pb-2">
                Payment Details
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                All transactions are encrypted and secured with SSL technology.
              </p>

              <input
                id="cardName"
                type="text"
                placeholder="Name on Card"
                className="p-3 border rounded-md w-full"
                value={formData.cardName}
                onChange={handleChange}
              />
              <input
                id="cardNumber"
                type="text"
                placeholder="Card number (e.g. 4242 4242 4242 4242)"
                className="mt-3 p-3 border rounded-md w-full"
                value={formData.cardNumber}
                onChange={handleChange}
              />

              <div className="grid grid-cols-3 gap-3 mt-3">
                <input
                  id="cardExp"
                  type="text"
                  placeholder="MM/YY"
                  className="p-3 border rounded-md"
                  value={formData.cardExp}
                  onChange={handleChange}
                />
                <input
                  id="cardCVC"
                  type="text"
                  placeholder="CVC"
                  className="p-3 border rounded-md"
                  value={formData.cardCVC}
                  onChange={handleChange}
                />
                <div className="p-3 border rounded-md text-sm text-gray-600 flex items-center justify-center">
                  🔒 Secure
                </div>
              </div>

              {/* Accepted Payment Methods */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">
                  Accepted Payment Methods:
                </p>
                <div className="flex gap-3 items-center flex-wrap">
                  <a href="https://www.visa.com" target="_blank">
                    <img
                      src={Visa}
                      alt="Visa"
                      className="h-5 hover:scale-110 transition-transform"
                    />
                  </a>
                  <a href="https://www.mastercard.com" target="_blank">
                    <img
                      src={Mastercard}
                      alt="Mastercard"
                      className="h-5 hover:scale-110 transition-transform"
                    />
                  </a>
                  <a href="https://www.americanexpress.com" target="_blank">
                    <img
                      src={Amex}
                      alt="Amex"
                      className="h-5 hover:scale-110 transition-transform"
                    />
                  </a>
                  <a href="https://pay.google.com" target="_blank">
                    <img
                      src={Googleplay}
                      alt="Google Pay"
                      className="h-5 hover:scale-110 transition-transform"
                    />
                  </a>
                  <a href="https://www.paypal.com" target="_blank">
                    <img
                      src={Paypal}
                      alt="PayPal"
                      className="h-5 hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your card will not be charged until your order has been confirmed.
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-3 mt-5">
                <input
                  id="tos"
                  type="checkbox"
                  checked={formData.tos}
                  onChange={handleChange}
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-green-700 underline">
                    Terms & Privacy Policy
                  </a>{" "}
                  and confirm my order details are correct.
                </label>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="bg-green-700 text-white px-6 py-3 rounded-md w-full mt-6 hover:bg-green-800 transition"
              >
                Place Order Securely
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By placing this order, you consent to Allen City Pharmacy’s secure
                payment processing and agree to our refund policy.
              </p>
            </form>
          </section>

          {/* Right Side - Summary */}
          <aside className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 h-fit">
            <h2 className="text-xl font-semibold text-green-800 mb-4 border-b pb-2">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-56 overflow-auto mb-3">
              {checkoutData && checkoutData.items.length > 0 ? (
                checkoutData.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm border-b pb-2"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₱{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              )}
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₱{checkoutData ? checkoutData.subtotal.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  ₱{checkoutData ? checkoutData.shipping.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>
                  ₱{checkoutData ? checkoutData.tax.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-green-800">
                ₱{checkoutData ? checkoutData.total.toFixed(2) : "0.00"}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 border-t pt-3 leading-relaxed">
              Payments are processed through secure, PCI-certified gateways ensuring complete data protection. Accepted: Visa, Mastercard, AmEx, PayPal, and Google Pay. 
              <br />
              Allen City Pharmacy is a government-licensed healthcare provider committed to quality, authenticity, and your wellbeing.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;