import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Truck,
  XCircle,
  PackageCheck,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";

interface Order {
  id: string;
  customerName?: string;
  customer?: string;
  date?: string;
  orderDate?: string;
  total?: string;
  totalPrice?: number;
  status: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5272/api/Orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Create new order
  const handleNewOrder = async () => {
    try {
      const newOrder = {
        productId: 1, // TODO: change to a real product ID in your DB
        quantity: 1,
        customerName: "Guest Customer",
      };

      const res = await fetch("http://127.0.0.1:5272/api/Orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        const data = await res.json();
        alert("✅ " + data.message);
        setOrders((prev) => [...prev, data.order]);
      } else {
        console.error("Failed to create order:", res.statusText);
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  // ✅ Delete order
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5272/api/Orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        console.error("Failed to delete order:", res.statusText);
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const statusColors: Record<string, string> = {
    Processing: "bg-yellow-100 text-yellow-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewOrder}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            <PackageCheck className="w-5 h-5" />
            <span>New Order</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {orders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      className={`border-b ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.customerName || order.customer || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {order.orderDate?.split("T")[0] ||
                          order.date ||
                          "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        ₱
                        {order.totalPrice
                          ? order.totalPrice.toFixed(2)
                          : order.total || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button className="text-green-600 hover:text-green-800 transition">
                          <Truck className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
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
            <p>No orders to display yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Orders;
