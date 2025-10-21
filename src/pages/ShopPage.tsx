  import React, { useState, useMemo } from "react";
  import { ShoppingCart, X, Trash2 } from "lucide-react";
  import { useNavigate } from "react-router-dom";

  interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    category: string;
    image: string;
    description: string;
    stock: "In stock" | "Low stock" | "Out of stock";
  }
  interface ShopPageProps {
    onAdd: (product: any) => void;
  }
  const products: Product[] = [
    {
      id: 1,
      name: "Pain Relief Tablets - 20 pack",
      price: 8.99,
      oldPrice: 11.99,
      rating: 4.8,
      reviews: 1200,
      category: "Medicine",
      image:
        "https://www.deepheat.com.au/cdn/shop/files/27933NAPROXENPAINRELIEF30PK3DHIRES_1200x1200.png?v=1731997526",
      description:
        "Fast-acting pain relief tablets ideal for headaches, muscle pain, and body aches. 20 tablets per pack.",
      stock: "In stock",
    },
    {
      id: 2,
      name: "Vitamin D3 - 60 softgels",
      price: 10.5,
      oldPrice: 13.0,
      rating: 4.7,
      reviews: 860,
      category: "Vitamins",
      image: "https://medlineplus.gov/images/Vitamins_share.jpg",
      description:
        "Vitamin D3 supports bone, immune, and mood health. 60 softgels per bottle.",
      stock: "Low stock",
    },
    {
      id: 3,
      name: "Cough Syrup - 150ml",
      price: 6.75,
      oldPrice: 8.0,
      rating: 4.6,
      reviews: 430,
      category: "Medicine",
      image: "https://pics.walgreens.com/prodimg/671386/900.jpg",
      description:
        "Provides fast relief from dry and chesty coughs. Non-drowsy formula suitable for daytime use.",
      stock: "In stock",
    },
    {
      id: 4,
      name: "Digital Thermometer",
      price: 9.99,
      rating: 4.7,
      reviews: 760,
      category: "Medical Devices",
      image: "https://m.media-amazon.com/images/I/61OrvhuAJhL._UF1000,1000_QL80_.jpg",
      description:
        "Accurate and fast-reading thermometer suitable for oral, rectal, and underarm use.",
      stock: "In stock",
    },
    {
      id: 5,
      name: "First Aid Kit - Compact",
      price: 24.99,
      oldPrice: 29.99,
      rating: 4.5,
      reviews: 320,
      category: "Safety",
      image:
        "https://target.scene7.com/is/image/Target/GUEST_e7f46325-c1a2-4baa-936d-d37de56b3ad7",
      description:
        "Compact first aid kit with essential supplies for home, office, and travel emergencies.",
      stock: "In stock",
    },
    {
      id: 6,
      name: "Baby Formula - 400g",
      price: 18.2,
      rating: 4.6,
      reviews: 540,
      category: "Baby Care",
      image:
        "https://www.forthepeople.com/sites/default/files/styles/mm-image/545x306/shutterstock_2387752027cabbd356dfd7c23de3f64833fdbdc651.webp",
      description:
        "Premium baby formula with essential nutrients for healthy development. Gentle and easy to digest.",
      stock: "Low stock",
    },
    {
      id: 7,
      name: "Hand Sanitizer 500 ml",
      price: 5.99,
      rating: 4.9,
      reviews: 2100,
      category: "Hygiene",
      image: "https://i.ebayimg.com/images/g/rAIAAOSwobtlWS4Q/s-l1200.jpg",
      description:
        "Kills 99.9% of germs and bacteria. Fast-drying formula with moisturizing ingredients.",
      stock: "In stock",
    },
  ];
  interface ShopPageProps {
    onAdd: (product: any) => void;
  }
  const products: Product[] = [
    {
      id: 1,
      name: "Pain Relief Tablets - 20 pack",
      price: 8.99,
      oldPrice: 11.99,
      rating: 4.8,
      reviews: 1200,
      category: "Medicine",
      image:
        "https://www.deepheat.com.au/cdn/shop/files/27933NAPROXENPAINRELIEF30PK3DHIRES_1200x1200.png?v=1731997526",
      description:
        "Fast-acting pain relief tablets ideal for headaches, muscle pain, and body aches. 20 tablets per pack.",
      stock: "In stock",
    },
    {
      id: 2,
      name: "Vitamin D3 - 60 softgels",
      price: 10.5,
      oldPrice: 13.0,
      rating: 4.7,
      reviews: 860,
      category: "Vitamins",
      image: "https://medlineplus.gov/images/Vitamins_share.jpg",
      description:
        "Vitamin D3 supports bone, immune, and mood health. 60 softgels per bottle.",
      stock: "Low stock",
    },
    {
      id: 3,
      name: "Cough Syrup - 150ml",
      price: 6.75,
      oldPrice: 8.0,
      rating: 4.6,
      reviews: 430,
      category: "Medicine",
      image: "https://pics.walgreens.com/prodimg/671386/900.jpg",
      description:
        "Provides fast relief from dry and chesty coughs. Non-drowsy formula suitable for daytime use.",
      stock: "In stock",
    },
    {
      id: 4,
      name: "Digital Thermometer",
      price: 9.99,
      rating: 4.7,
      reviews: 760,
      category: "Medical Devices",
      image: "https://m.media-amazon.com/images/I/61OrvhuAJhL._UF1000,1000_QL80_.jpg",
      description:
        "Accurate and fast-reading thermometer suitable for oral, rectal, and underarm use.",
      stock: "In stock",
    },
    {
      id: 5,
      name: "First Aid Kit - Compact",
      price: 24.99,
      oldPrice: 29.99,
      rating: 4.5,
      reviews: 320,
      category: "Safety",
      image:
        "https://target.scene7.com/is/image/Target/GUEST_e7f46325-c1a2-4baa-936d-d37de56b3ad7",
      description:
        "Compact first aid kit with essential supplies for home, office, and travel emergencies.",
      stock: "In stock",
    },
    {
      id: 6,
      name: "Baby Formula - 400g",
      price: 18.2,
      rating: 4.6,
      reviews: 540,
      category: "Baby Care",
      image:
        "https://www.forthepeople.com/sites/default/files/styles/mm-image/545x306/shutterstock_2387752027cabbd356dfd7c23de3f64833fdbdc651.webp",
      description:
        "Premium baby formula with essential nutrients for healthy development. Gentle and easy to digest.",
      stock: "Low stock",
    },
    {
      id: 7,
      name: "Hand Sanitizer 500 ml",
      price: 5.99,
      rating: 4.9,
      reviews: 2100,
      category: "Hygiene",
      image: "https://i.ebayimg.com/images/g/rAIAAOSwobtlWS4Q/s-l1200.jpg",
      description:
        "Kills 99.9% of germs and bacteria. Fast-drying formula with moisturizing ingredients.",
      stock: "In stock",
    },
  ];

  export default function ShopPage({ onAdd }: ShopPageProps) {
    const [selected, setSelected] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");

    const addToCart = (product: Product) => {
      setCart((prev) => [...prev, product]);
    };

    const removeFromCart = (id: number) => {
      setCart((prev) => prev.filter((p) => p.id !== id));
    };

    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

    // Filtering & Sorting Logic
    const filteredProducts = useMemo(() => {
      let filtered = products.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      );

      switch (sortBy) {
        case "priceLow":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "priceHigh":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
      return filtered;
    }, [category, search, sortBy]);

    return (
      <div className="min-h-screen bg-[linear-gradient(-45deg,#006d53,#e56b1f,#f8f8f8,#006d53)] bg-[length:400%_400%] animate-[smoothFlow_25s_ease_infinite] text-gray-800 font-sans relative overflow-x-hidden">

        {/* Hero Section */}
        <section className="relative overflow-hidden h-[400px] flex items-center justify-center text-center text-white">
          <img
            src="https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Pharmacy background"
            className="absolute inset-0 object-cover w-full h-full brightness-[0.5]"
          />
          <div className="relative z-10 px-4">
            <h1 className="text-5xl font-extrabold mb-3 drop-shadow-lg">
              Your Health, Our Priority
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-6 text-gray-100">
              Shop the finest healthcare essentials, from vitamins to medical
              tools, curated with care.
            </p>
            <a
              href="#products"
              className="bg-[#e56b1f] hover:bg-[#cf5d16] px-6 py-3 rounded-lg font-semibold shadow-lg"
            >
              Browse Products
            </a>
          </div>
        </section>

        {/* Top Controls */}
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3 items-center px-4 mt-6">
          <input
            type="text"
            placeholder="Search for health essentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[220px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006d53]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Medicine</option>
            <option>Vitamins</option>
            <option>Medical Devices</option>
            <option>Baby Care</option>
            <option>Hygiene</option>
            <option>Safety</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            className="relative flex items-center gap-2 bg-[#006d53] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#005743] transition"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={18} />
            Cart ({cart.length})
          </button>
        </div>

        {/* Product Grid */}
        <main id="products" className="max-w-7xl mx-auto px-4 mt-8">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-600 mt-10">
              No products found. Try adjusting filters.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 cursor-pointer transition-transform hover:-translate-y-1 group relative overflow-hidden"
                  onClick={() => setSelected(p)}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-[#006d53] text-sm mb-1 truncate">
                      {p.name}
                    </h3>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="text-yellow-500">
                        ⭐ {p.rating} ({p.reviews.toLocaleString()})
                      </div>
                      <div className="text-[#e56b1f] font-bold">
                        ${p.price.toFixed(2)}
                      </div>
                    </div>
                    {p.oldPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ${p.oldPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="flex items-center mt-2">
                      <div
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${p.stock === "Low stock"
                            ? "text-[#e67e22] bg-orange-50"
                            : p.stock === "Out of stock"
                              ? "text-red-600 bg-red-50"
                              : "text-[#006d53] bg-green-50"
                          }`}
                      >
                        {p.stock}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="ml-auto bg-[#006d53] text-white text-xs px-3 py-1 rounded-md font-bold hover:bg-[#005743] transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="bg-white text-[#006d53] px-4 py-2 rounded-md font-semibold shadow-md">
                      Quick View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Product Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 max-w-md w-[90%] relative animate-[popupIn_0.3s_ease]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-4 text-gray-600 text-xl"
              >
                ×
              </button>
              <img
                src={selected.image}
                alt={selected.name}
                className="rounded-lg mb-4 max-h-64 object-cover mx-auto"
              />
              <h2 className="text-xl font-bold text-[#006d53]">
                {selected.name}
              </h2>
              <p className="text-yellow-500 mt-1">
                ⭐ {selected.rating} ({selected.reviews.toLocaleString()} reviews)
              </p>
              <div className="flex gap-2 items-center my-3">
                <span className="text-2xl font-bold text-[#e56b1f]">
                  ${selected.price.toFixed(2)}
                </span>
                {selected.oldPrice && (
                  <span className="text-gray-400 line-through">
                    ${selected.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selected.description}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selected);
                    setSelected(null);
                  }}
                  className="bg-[#006d53] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#005743] transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-in Cart Panel */}
        {cartOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
            <div className="bg-white w-80 h-full p-6 shadow-xl overflow-y-auto animate-[slideIn_0.3s_ease] relative">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={() => setCartOpen(false)}
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold text-[#006d53] mb-4">
                Your Cart
              </h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 mt-10 text-center">
                  Your cart is empty.
                </p>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 border-b border-gray-200 py-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-[#e56b1f] font-bold text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="mt-5">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-[#e56b1f]">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <button className="mt-5 w-full bg-[#006d53] text-white py-2 rounded-md font-semibold hover:bg-[#005743] transition">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Keyframes */}
        <style>{`
          @keyframes smoothFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes popupIn {
            from { transform: scale(0.85); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Duplicate import and component removed.