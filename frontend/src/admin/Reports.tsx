// src/pages/admin/Reports.tsx
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

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const Reports: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [inventoryData, setInventoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesRes, invRes] = await Promise.all([
          axios.get("http://127.0.0.1:5272/api/Reports/sales"),
          axios.get("http://127.0.0.1:5272/api/Reports/inventory"),
        ]);

        setSalesData(salesRes.data.monthlySales || []);
        setSummary(salesRes.data.summary || {});
        setInventoryData(invRes.data.categoryData || []);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl shadow p-6 mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-7 h-7 text-orange-500" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Reports & Analytics
          </h1>
        </div>
        <p className="text-gray-400 text-sm">
          Updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600">Total Sales</h2>
              <TrendingUp className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₱{summary.totalSales?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600">Returns</h2>
              <TrendingDown className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.totalReturns || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600">Top Category</h2>
              <PieChart className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.topCategory || "N/A"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600">Reports Generated</h2>
              <FileText className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary.reportCount || 0}
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
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
              <Bar dataKey="sales" fill="#F97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inventory Pie Chart */}
        <motion.div
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Product Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-6 text-sm text-gray-600">
            {inventoryData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                ></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
