import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  PlusCircle,
  XCircle,
  Filter,
  ChevronDown,
  Clock,
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  brand?: string;
  price: number;
  stock: number;
  category?: string;
}

const PharmacistMedicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5272/api/Medicines");
        const data = await res.json();
        setMedicines(data);
      } catch (err) {
        console.error("Error loading medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Add new medicine (placeholder example)
  const handleAddMedicine = async () => {
    try {
      const newMedicine = {
        name: "New Medicine",
        price: 0,
        stock: 0,
      };

      const res = await fetch("http://127.0.0.1:5272/api/Medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMedicine),
      });

      if (res.ok) {
        const data = await res.json();
        alert("✅ " + data.message);
        setMedicines((prev) => [...prev, data.medicine]);
      } else {
        console.error("Failed to add medicine:", res.statusText);
      }
    } catch (err) {
      console.error("Error adding medicine:", err);
    }
  };

  // Delete medicine
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5272/api/Medicines/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMedicines((prev) => prev.filter((m) => m.id !== id));
      } else {
        console.error("Failed to delete medicine:", res.statusText);
      }
    } catch (err) {
      console.error("Error deleting medicine:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Medicines</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddMedicine}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Medicine</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Medicines Table */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading medicines...</div>
        ) : medicines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Brand</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {medicines.map((med, i) => (
                    <motion.tr
                      key={med.id}
                      className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">{med.id}</td>
                      <td className="py-3 px-4 text-gray-700">{med.name}</td>
                      <td className="py-3 px-4 text-gray-600">{med.brand || "—"}</td>
                      <td className="py-3 px-4 text-gray-800">₱{med.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-800">{med.stock}</td>
                      <td className="py-3 px-4 text-gray-600">{med.category || "—"}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <XCircle className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Clock className="mx-auto mb-3 w-10 h-10 text-gray-400" />
            <p>No medicines to display yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PharmacistMedicines;
