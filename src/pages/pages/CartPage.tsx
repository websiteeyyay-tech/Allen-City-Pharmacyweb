import React, { useEffect, useState } from "react";

interface CartItem {
  name: string;
  price: number;
  qty: number;
  image: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { name: "Vitamin C 500mg", price: 12.99, qty: 1, image: "vitaminc.jpg" },
    { name: "Ibuprofen 200mg Tablets", price: 9.49, qty: 2, image: "Ibuprofen.jpg" },
    { name: "Daily Multivitamin Capsules", price: 15.99, qty: 1, image: "Multivitamin.jpg" },
    { name: "Allergy Relief Tablets", price: 8.75, qty: 1, image: "Allergy.jpg" },
    { name: "Hand Sanitizer (500ml)", price: 5.5, qty: 3, image: "Sanitizer.jpg" },
  ]);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(4.99);
  const [total, setTotal] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const newTax = newSubtotal * 0.06;
    const newShipping = cartItems.length > 0 ? 4.99 : 0;
    const newTotal = newSubtotal + newTax + newShipping;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setShipping(newShipping);
    setTotal(newTotal);

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ items: cartItems, subtotal: newSubtotal, tax: newTax, shipping: newShipping, total: newTotal })
    );
  }, [cartItems]);

  const handleQtyChange = (index: number, qty: number) => {
    setCartItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, qty: Math.max(1, qty) } : item))
    );
  };

  const handleRemove = (index: number) => setCartItems(prev => prev.filter((_, i) => i !== index));
  const handleClear = () => setCartItems([]);
  const handleApplyCoupon = () => alert(`Promo code "${couponCode}" applied (demo only).`);
  const handleCheckout = () => window.location.href = "/checkout";

  return (
    <div className="bg-gradient-to-br from-green-400 to-orange-400 min-h-screen flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-green-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="AllenCity Pharmacy Logo.png" alt="Allen City Pharmacy" className="h-12" />
            <span className="font-bold text-lg text-green-800">Allen City Pharmacy</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/" className="text-gray-600 hover:text-green-700 transition">Home</a>
            <a href="/about" className="text-gray-600 hover:text-green-700 transition">About</a>
            <a href="/shop" className="text-gray-600 hover:text-green-700 transition">Shop</a>
            <a href="/contact" className="text-gray-600 hover:text-green-700 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex-grow">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Your Cart</h1>
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-green-100 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Cart Items */}
            <section className="w-full lg:w-2/3 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md" />
                      <div>
                        <h3 className="font-semibold text-green-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                        className="w-16 border border-green-300 rounded-md text-center"
                      />
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">Your cart is empty.</p>
              )}

              {/* Coupon */}
              <div className="mt-6">
                <label htmlFor="couponCode" className="text-sm font-semibold text-green-800">Have a promo code?</label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="couponCode"
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <a href="/shop" className="text-sm text-green-700 hover:underline">← Continue Shopping</a>
                <button
                  onClick={handleClear}
                  className="bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-200 transition"
                >
                  Clear Cart
                </button>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="w-full lg:w-1/3">
              <div className="bg-green-50 p-5 rounded-lg border border-green-200 space-y-4 shadow-inner">
                <h2 className="text-lg font-semibold text-green-800 mb-2">Order Summary</h2>
                <div className="flex justify-between text-sm text-gray-700"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-gray-700"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-gray-700"><span>Estimated tax (6%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t border-green-200 my-4"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-2xl font-bold text-green-900">${total.toFixed(2)}</div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-gray-100 py-6 mt-10 text-center text-sm">
        <p>
          &copy; 2025 <span className="text-orange-400 font-semibold">Allen City Pharmacy</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default CartPage;