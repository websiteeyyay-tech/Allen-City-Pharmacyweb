import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart as RePieChart,
  Cell,
} from "recharts";

interface SalesData {
  month: string;
  sales: number;
}

// 👇 Updated type to make Recharts happy
interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // ✅ Added index signature
}

interface Summary {
  totalProducts: number;
  lowStockCount: number;
  totalStock: number;
  totalSales: number;
}

const PharmacistReports: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [inventoryData, setInventoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const invRes = await axios.get("http://127.0.0.1:5272/api/Products");
        const products = invRes.data;

        const categoryMap: Record<string, number> = {};
        let totalStock = 0;
        let lowStockCount = 0;

        products.forEach((p: any) => {
          const category = p.category || "Uncategorized";
          const stock = p.stock || 0;

          totalStock += stock;
          if (stock < 10) lowStockCount++;

          categoryMap[category] = (categoryMap[category] || 0) + stock;
        });

        const categoryData: CategoryData[] = Object.entries(categoryMap).map(
          ([name, value]) => ({ name, value })
        );

        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const generatedSales = months.map((m) => ({
          month: m,
          sales: Math.floor(Math.random() * 10000 + 2000),
        }));

        setSalesData(generatedSales);
        setInventoryData(categoryData);
        setSummary({
          totalProducts: products.length,
          totalStock,
          lowStockCount,
          totalSales: generatedSales.reduce((sum, s) => sum + s.sales, 0),
        });
      } catch (err) {
        console.error("Error fetching pharmacist reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        Loading pharmacist reports...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <motion.div
        className="bg-white rounded-2xl shadow p-6 mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Pharmacist Reports & Insights
          </h1>
        </div>
        <p className="text-gray-400 text-sm">
          Updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      {summary && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white p-5 rounded-2xl shadow flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-600">Total Products</h2>
              <FileText className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.totalProducts}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-600">Total Stock</h2>
              <TrendingUp className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.totalStock}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-600">Low Stock Items</h2>
              <TrendingDown className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.lowStockCount}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-600">Total Sales (₱)</h2>
              <PieChart className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₱{summary.totalSales.toLocaleString()}
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Sales Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Inventory Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label
              >
                {inventoryData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacistReports;
