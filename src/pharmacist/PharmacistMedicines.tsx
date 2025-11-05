import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Package,
  ClipboardList,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const PharmacistDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalStock: 0,
    lowStockItems: 0,
    totalValue: 0,
  });

  const [chartData, setChartData] = useState<
    { month: string; stockIn: number; stockOut: number }[]
  >([]);

  // ✅ Fetch Product Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5272/api/Products");
        const products = res.data;

        let totalMedicines = products.length;
        let totalStock = 0;
        let lowStockItems = 0;
        let totalValue = 0;

        products.forEach((p: any) => {
          totalStock += p.stock || 0;
          if (p.stock < 10) lowStockItems++;
          totalValue += (p.price || 0) * (p.stock || 0);
        });

        // 🧮 Generate stock trend data (simulate monthly changes)
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const generatedTrends = months.map((m) => ({
          month: m,
          stockIn: Math.floor(Math.random() * 300 + 50),
          stockOut: Math.floor(Math.random() * 200 + 20),
        }));

        setStats({ totalMedicines, totalStock, lowStockItems, totalValue });
        setChartData(generatedTrends);
      } catch (err) {
        console.error("Error fetching pharmacist dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Smooth animated counter
  const CountUp = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
    const count = useMotionValue(0);
    const spring = useSpring(count, { stiffness: 100, damping: 15 });
    const display = useTransform(spring, (val) =>
      Math.floor(val).toLocaleString()
    );

    useEffect(() => {
      count.set(value);
    }, [value, count]);

    return (
      <motion.span className="tabular-nums">
        {prefix}
        <motion.span>{display}</motion.span>
      </motion.span>
    );
  };

  const cards = [
    {
      title: "Total Medicines",
      value: stats.totalMedicines,
      icon: <ClipboardList className="w-7 h-7 text-blue-500" />,
      gradient: "from-blue-100 via-blue-50 to-white",
    },
    {
      title: "Total Stock Units",
      value: stats.totalStock,
      icon: <Package className="w-7 h-7 text-purple-500" />,
      gradient: "from-purple-100 via-purple-50 to-white",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: <AlertTriangle className="w-7 h-7 text-red-500" />,
      gradient: "from-rose-100 via-rose-50 to-white",
    },
    {
      title: "Inventory Value",
      value: stats.totalValue,
      prefix: "₱",
      icon: <DollarSign className="w-7 h-7 text-green-500" />,
      gradient: "from-emerald-100 via-emerald-50 to-white",
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-8 rounded-3xl shadow-lg mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Pharmacist Dashboard
        </h1>
        <p className="text-emerald-100 mt-2">
          Manage medicines and inventory in real-time
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`relative rounded-3xl bg-gradient-to-br ${card.gradient} p-6 backdrop-blur-md shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-200`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-600 text-sm font-medium uppercase">
                  {card.title}
                </h2>
                <p className="text-3xl font-bold mt-2 text-gray-800">
                  <CountUp value={card.value} prefix={card.prefix} />
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-inner">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Stock Added (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Package className="text-indigo-500" /> Monthly Stock-In Overview
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="stockIn" fill="#10b981" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stock Usage (Line Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="text-green-500" /> Monthly Stock-Out Trend
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="stockOut"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
