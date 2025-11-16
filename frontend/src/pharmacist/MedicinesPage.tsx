// src/pages/pharmacist/MedicinesPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  PlusCircle,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import axios from "axios";

interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api",
  headers: { "Content-Type": "application/json" },
});

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [search, setSearch] = useState("");

  // ✅ Fetch medicines from backend
  const fetchMedicines = async () => {
    try {
      const res = await api.get("/Products");
      const data = res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || "General",
        price: p.price || 0,
        stock: p.stock || 0,
      }));
      setMedicines(data);
    } catch (err) {
      console.error("❌ Error fetching medicines:", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ✅ Add or update medicine (SAVE TO DATABASE)
  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.stock) return;

    const newMedicine = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    try {
      if (selectedMedicine) {
        // Update existing medicine in DB
        await api.put(`/Products/${selectedMedicine.id}`, newMedicine);
      } else {
        // Create new medicine in DB
        await api.post("/Products", newMedicine);
      }

      // Refresh medicine list after saving
      await fetchMedicines();

      // Reset form and close modal
      setForm({ name: "", category: "", price: "", stock: "" });
      setSelectedMedicine(null);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("❌ Error saving medicine:", err.response || err);
      alert("Failed to save medicine. Check backend connection.");
    }
  };

  // ✅ Edit medicine
  const handleEdit = (item: Medicine) => {
    setSelectedMedicine(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
    });
    setIsModalOpen(true);
  };

  // ✅ Delete medicine
  const handleDelete = (item: Medicine) => {
    setSelectedMedicine(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedMedicine) {
        await api.delete(`/Products/${selectedMedicine.id}`);
        setMedicines((prev) =>
          prev.filter((i) => i.id !== selectedMedicine.id)
        );
        setSelectedMedicine(null);
        setIsDeleteOpen(false);
      }
    } catch (err) {
      console.error("❌ Error deleting medicine:", err);
    }
  };

  // ✅ Search filter
  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-lg p-6 mb-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-white/20 p-2 rounded-xl">
            <Pill className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pharmacist Medicines</h1>
            <p className="text-green-100 text-sm">
              Manage your medicine stock efficiently
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSelectedMedicine(null);
            setForm({ name: "", category: "", price: "", stock: "" });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-white text-green-600 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Medicine
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
        {filteredMedicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Pill className="w-16 h-16 mb-3 text-gray-300" />
            <p className="text-lg font-medium">No medicines found</p>
            <p className="text-sm text-gray-400 mt-1">
              Add new medicines to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-green-100 to-green-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMedicines.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-green-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {m.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{m.category}</td>
                    <td className="px-6 py-4 text-gray-600">
                      ₱{m.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{m.stock}</td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete"
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200"
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
                <PlusCircle className="text-green-500" />
                {selectedMedicine ? "Edit Medicine" : "Add New Medicine"}
              </h2>

              <form onSubmit={handleSaveMedicine} className="space-y-5">
                {["name", "category", "price", "stock"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "price" || field === "stock" ? "number" : "text"}
                      value={(form as any)[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter ${field}`}
                      required
                    />
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg shadow-md"
                >
                  {selectedMedicine ? "Save Changes" : "Add Medicine"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
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
                Delete Medicine
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedMedicine?.name}</span>?
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

export default MedicinesPage;
