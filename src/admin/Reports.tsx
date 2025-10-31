// src/pages/admin/Reports.tsx
import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, PieChart, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, PieChart as RePieChart, Cell } from "recharts";

const Reports: React.FC = () => {
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 8000 },
  ];

  const pieData = [
    { name: "Medicines", value: 55 },
    { name: "Supplements", value: 25 },
    { name: "Medical Devices", value: 20 },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

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
          <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
        </div>
        <p className="text-gray-400 text-sm">Updated: October 2025</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          {
            icon: <TrendingUp className="text-green-500" />,
            title: "Total Sales",
            value: "$42,300",
            change: "+8.2%",
          },
          {
            icon: <TrendingDown className="text-red-500" />,
            title: "Returns",
            value: "$1,200",
            change: "-3.1%",
          },
          {
            icon: <PieChart className="text-blue-500" />,
            title: "Top Category",
            value: "Medicines",
            change: "55%",
          },
          {
            icon: <FileText className="text-purple-500" />,
            title: "Reports Generated",
            value: "18",
            change: "This Month",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex flex-col space-y-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600">{card.title}</h2>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-400">{card.change}</p>
          </div>
        ))}
      </motion.div>

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

        {/* Category Distribution Pie Chart */}
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
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-6 text-sm text-gray-600">
            {pieData.map((item, i) => (
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
