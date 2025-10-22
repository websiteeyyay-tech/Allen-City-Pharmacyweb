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
  const [loading, setLoading] = useState(false);
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

  // 🧩 Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("https://localhost:5001/api/cart");
        if (!res.ok) throw new Error("Failed to load cart");
        const items: CartItem[] = await res.json();

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
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
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

  const handlePlaceOrder = async () => {
    if (!formData.tos) {
      alert("Please agree to the terms and privacy policy.");
      return;
    }

    if (!checkoutData || checkoutData.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Prepare order payload
      const orderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone,
        },
        deliveryMethod: formData.deliveryMethod,
        orderNotes: formData.orderNotes,
        paymentInfo: {
          nameOnCard: formData.cardName,
          cardNumber: formData.cardNumber,
          exp: formData.cardExp,
          cvc: formData.cardCVC,
        },
        items: checkoutData.items,
        totals: {
          subtotal: checkoutData.subtotal,
          shipping: checkoutData.shipping,
          tax: checkoutData.tax,
          total: checkoutData.total,
        },
      };

      // 🧾 Send to backend
      const response = await fetch("https://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const result = await response.json();
      alert(`✅ Order placed successfully! Order ID: ${result.orderId}`);

      clearCart(); // clear frontend cart state
      setCheckoutData(null);

      // Redirect to confirmation
      window.location.href = "/order-success";
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* --- existing form unchanged --- */}
              {/* ... all your inputs here ... */}

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
                disabled={loading}
                className={`${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                } text-white px-6 py-3 rounded-md w-full mt-6 transition`}
              >
                {loading ? "Processing..." : "Place Order Securely"}
              </button>
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
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
