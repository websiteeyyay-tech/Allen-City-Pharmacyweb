// src/pages/admin/Inventory.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  PlusCircle,
  Boxes,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import axios from "axios";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: string;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api",
  headers: { "Content-Type": "application/json" },
});

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ name: "", category: "", quantity: "" });
  const [search, setSearch] = useState("");

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get("/Products");
        const data = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || "General",
          quantity: p.stock || 0,
          status: (p.stock || 0) < 10 ? "Low Stock" : "In Stock",
        }));
        setInventoryItems(data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };
    fetchInventory();
  }, []);

  // ✅ Add or update item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.quantity) return;

    const newItem = {
      name: form.name,
      category: form.category,
      stock: parseInt(form.quantity),
    };

    try {
      if (selectedItem) {
        // Update existing item
        await api.put(`/Products/${selectedItem.id}`, newItem);
      } else {
        // Add new product
        await api.post("/Products", newItem);
      }

      // Refresh after save
      const res = await api.get("/Products");
      const data = res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || "General",
        quantity: p.stock || 0,
        status: (p.stock || 0) < 10 ? "Low Stock" : "In Stock",
      }));
      setInventoryItems(data);

      // Reset form
      setForm({ name: "", category: "", quantity: "" });
      setSelectedItem(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // ✅ Edit item
  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
    });
    setIsModalOpen(true);
  };

  // ✅ Delete item
  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedItem) {
        await api.delete(`/Products/${selectedItem.id}`);
        setInventoryItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
        setSelectedItem(null);
        setIsDeleteOpen(false);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ✅ Filter search
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg p-6 mb-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-white/20 p-2 rounded-xl">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-blue-100 text-sm">
              Track, manage, and monitor your stock effortlessly
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSelectedItem(null);
            setForm({ name: "", category: "", quantity: "" });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Item
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl shadow px-4 py-3">
        <div className="flex items-center space-x-2 w-full">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none outline-none bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-md p-6 backdrop-blur-sm"
      >
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Boxes className="w-16 h-16 mb-3 text-gray-300" />
            <p className="text-lg font-medium">No inventory items</p>
            <p className="text-sm text-gray-400 mt-1">
              Add new items to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4">
                      {item.status === "Low Stock" ? (
                        <span className="flex items-center text-red-500 font-medium text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium text-sm">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                        title="Edit item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <PlusCircle className="text-blue-500" />
                {selectedItem ? "Edit Item" : "Add New Item"}
              </h2>

              <form onSubmit={handleAddItem} className="space-y-5">
                {["name", "category", "quantity"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "quantity" ? "number" : "text"}
                      value={(form as any)[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field}`}
                      required
                    />
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg shadow-md"
                >
                  {selectedItem ? "Save Changes" : "Add Item"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Item
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedItem?.name}</span>?
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
