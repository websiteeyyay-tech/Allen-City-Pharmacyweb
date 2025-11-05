import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Boxes,
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api",
  headers: { "Content-Type": "application/json" },
});

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalStockItems: 0,
    lowStock: 0,
  });

  const [salesData, setSalesData] = useState<
    { month: string; sales: number; orders: number }[]
  >([]);

  // ✅ Fetch data from Users, Products, and Orders APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/Users"),
          api.get("/Products"),
          api.get("/Orders"),
        ]);

        const users = usersRes.data || [];
        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        // ✅ Compute product stats
        const totalUsers = users.length;
        const totalProducts = products.length;
        const totalStockItems = products.reduce(
          (sum: number, p: any) => sum + (p.stock || 0),
          0
        );
        const lowStockCount = products.filter(
          (p: any) => p.stock !== undefined && p.stock < 10
        ).length;

        // ✅ Compute order stats
        const totalOrders = orders.length;
        const totalSales = orders.reduce(
          (sum: number, order: any) =>
            sum + (order.totalAmount || order.totalPrice || 0),
          0
        );

        setStats({
          totalSales,
          totalOrders,
          totalUsers,
          totalProducts,
          totalStockItems,
          lowStock: lowStockCount,
        });

        // 🔹 Optional: Mock sales chart (could be replaced with backend data later)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        setSalesData(
          months.map((m) => ({
            month: m,
            sales: Math.floor(Math.random() * 50000 + 5000),
            orders: Math.floor(Math.random() * 400 + 50),
          }))
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Animated counter
  const CountUp = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
    const count = useMotionValue(0);
    const spring = useSpring(count, { stiffness: 100, damping: 15 });
    const display = useTransform(spring, (val) => Math.floor(val).toLocaleString());

    useEffect(() => {
      count.set(0);
      const timeout = setTimeout(() => count.set(value), 200);
      return () => clearTimeout(timeout);
    }, [value, count]);

    return (
      <motion.span className="tabular-nums">
        {prefix}
        <motion.span>{display}</motion.span>
      </motion.span>
    );
  };

  // ✅ Dashboard cards
  const cards = [
    {
      title: "Total Sales (₱)",
      value: stats.totalSales,
      prefix: "₱",
      icon: <DollarSign className="w-7 h-7 text-green-500" />,
      gradient: "from-emerald-100 via-emerald-50 to-white",
      pulse: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag className="w-7 h-7 text-blue-500" />,
      gradient: "from-sky-100 via-sky-50 to-white",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-7 h-7 text-purple-500" />,
      gradient: "from-violet-100 via-violet-50 to-white",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="w-7 h-7 text-orange-500" />,
      gradient: "from-orange-100 via-orange-50 to-white",
    },
    {
      title: "Total Stock Items",
      value: stats.totalStockItems,
      icon: <Boxes className="w-7 h-7 text-teal-500" />,
      gradient: "from-teal-100 via-teal-50 to-white",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: <AlertTriangle className="w-7 h-7 text-red-500" />,
      gradient: "from-rose-100 via-rose-50 to-white",
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-lg mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-indigo-100 mt-2">
          Real-time pharmacy stats powered by your API
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`relative rounded-3xl bg-gradient-to-br ${card.gradient} p-6 backdrop-blur-md shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-200`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {card.pulse && (
              <span className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-600 text-sm font-medium uppercase">
                  {card.title}
                </h2>
                <p className="text-3xl font-bold mt-2 text-gray-800">
                  <CountUp value={card.value} prefix={card.prefix} />
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-inner">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Package className="text-indigo-500" /> Monthly Sales Overview
            </h2>
            <span className="text-sm text-gray-400">This Year</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar
                dataKey="sales"
                fill="url(#colorSales)"
                radius={[10, 10, 0, 0]}
                barSize={35}
              />
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="text-green-500" /> Orders Trend
            </h2>
            <span className="text-sm text-gray-400">Last 6 months</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
