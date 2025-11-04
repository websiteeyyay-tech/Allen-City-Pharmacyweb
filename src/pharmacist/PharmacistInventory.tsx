import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Package, AlertTriangle, Search } from "lucide-react";
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

const PharmacistInventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch products
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

  // ✅ Filter search
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl shadow-lg p-6 mb-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-white/20 p-2 rounded-xl">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pharmacist Inventory</h1>
            <p className="text-blue-100 text-sm">
              View and monitor medicine stock levels
            </p>
          </div>
        </div>
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

      {/* Inventory Table */}
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
              Please check back later or contact the admin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-green-100 to-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-green-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "Low Stock" ? (
                        <span className="flex items-center text-red-500 font-medium text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium text-sm">
                          In Stock
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PharmacistInventory;
