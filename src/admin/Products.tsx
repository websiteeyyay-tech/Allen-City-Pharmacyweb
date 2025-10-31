import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, PlusCircle, Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const Products: React.FC = () => {
  const [search, setSearch] = useState("");

  const products: Product[] = [
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      price: 49,
      stock: 120,
      image: "https://images.unsplash.com/photo-1580281657521-4b7b66f1f2f0?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Antibiotics",
      price: 99,
      stock: 80,
      image: "https://images.unsplash.com/photo-1582719478181-2f0ff0a81f7e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Cetirizine",
      category: "Allergy",
      price: 39,
      stock: 150,
      image: "https://images.unsplash.com/photo-1582719478195-bb70b6f980b4?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Vitamin C",
      category: "Supplements",
      price: 59,
      stock: 200,
      image: "https://images.unsplash.com/photo-1602002444161-283b9c32f0a6?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Ibuprofen",
      category: "Pain Relief",
      price: 69,
      stock: 90,
      image: "https://images.unsplash.com/photo-1606813902917-1b5b2f94c693?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Loperamide",
      category: "Digestive Health",
      price: 45,
      stock: 70,
      image: "https://images.unsplash.com/photo-1610210269374-5b0a94cfb8a7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Multivitamin",
      category: "Supplements",
      price: 89,
      stock: 110,
      image: "https://images.unsplash.com/photo-1589276006214-6c8f2e85f9ee?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Omeprazole",
      category: "Stomach Care",
      price: 79,
      stock: 95,
      image: "https://images.unsplash.com/photo-1587049352846-4a6b86baec4b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 9,
      name: "Ascorbic Acid Syrup",
      category: "Vitamins",
      price: 99,
      stock: 60,
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484f8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 10,
      name: "Hydrocortisone Cream",
      category: "Topical",
      price: 89,
      stock: 40,
      image: "https://images.unsplash.com/photo-1615485298590-480c70c88231?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header Section */}
      <motion.div
        className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="bg-white rounded-2xl shadow p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  className="group border rounded-2xl p-4 bg-gradient-to-br from-white to-gray-100 hover:from-purple-50 hover:to-white shadow-sm hover:shadow-lg transition duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="overflow-hidden rounded-xl mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-600">
                      ₱{product.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500 font-medium"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <img
                src="https://illustrations.popsy.co/gray/shop.svg"
                alt="Empty"
                className="w-52 mb-6 opacity-90"
              />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for another item.
              </p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Products;
