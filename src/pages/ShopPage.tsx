import { useState, useMemo, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  onAdd: (product: Product) => void;
}

const localProducts: Product[] = [
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
    image:
      "https://m.media-amazon.com/images/I/61OrvhuAJhL._UF1000,1000_QL80_.jpg",
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch from backend (merge with static)
  useEffect(() => {
    fetch("http://localhost:5272/api/Products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: undefined,
          rating: 4.5,
          reviews: 0,
          category: "Medicine",
          image:
            "https://images.unsplash.com/photo-1582719478171-2f9b6d2b9e8f?auto=format&fit=crop&w=600&q=60",
          description: p.description || "No description available.",
          stock: p.stockQuantity > 0 ? "In stock" : "Out of stock",
        }));
        setApiProducts(formatted);
      })
      .catch((err) => console.error("❌ Error fetching products:", err));
  }, []);

  // Combine backend + local products
  const combinedProducts = [...apiProducts, ...localProducts];

  const filteredProducts = useMemo(() => {
    let filtered = combinedProducts.filter(
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
  }, [category, search, sortBy, combinedProducts]);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-[Segoe_UI]">
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center justify-center text-center text-white overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Pharmacy background"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Trusted Health Essentials
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Everything your family needs for daily wellness — delivered with care.
          </p>
          <a
            href="#products"
            className="inline-block bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition shadow-md"
          >
            Shop Now
          </a>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-gray-200">
        <div className="max-w-6xl w-[80%] mx-auto flex flex-wrap justify-between gap-3 items-center">
          <input
            type="text"
            placeholder="Search for health essentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[220px] border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm"
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
            className="border border-gray-300 rounded-full px-4 py-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart size={18} />
            Checkout
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <main id="products" className="max-w-6xl w-[80%] mx-auto mt-12 mb-20">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 mt-12 text-lg">
            No products found. Try adjusting filters.
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelected(p)}
              >
                <div className="overflow-hidden rounded-t-3xl">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-green-800 text-lg mb-1 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#e56b1f] font-bold text-xl">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${p.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        p.stock === "Low stock"
                          ? "bg-orange-50 text-[#e67e22]"
                          : p.stock === "Out of stock"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-[#006d53]"
                      }`}
                    >
                      {p.stock}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd(p);
                      }}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-green-700 transition shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="bg-white text-green-800 px-4 py-2 rounded-full font-semibold shadow-md">
                    Quick View
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-[90%] relative border-t-4 border-green-500"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-4 text-gray-600 text-xl hover:text-gray-800"
              >
                ×
              </button>
              <img
                src={selected.image}
                alt={selected.name}
                className="rounded-2xl mb-5 max-h-64 object-cover mx-auto"
              />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                {selected.name}
              </h2>
              <p className="text-yellow-500 mb-2">
                ⭐ {selected.rating} ({selected.reviews.toLocaleString()} reviews)
              </p>
              <div className="flex gap-2 items-center mb-4">
                <span className="text-3xl font-bold text-[#e56b1f]">
                  ${selected.price.toFixed(2)}
                </span>
                {selected.oldPrice && (
                  <span className="text-gray-400 line-through">
                    ${selected.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                {selected.description}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    onAdd(selected);
                    setSelected(null);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
