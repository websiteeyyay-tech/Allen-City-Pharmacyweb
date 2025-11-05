import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  PackageCheck,
  XCircle,
  Clock,
  PlusCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

interface Order {
  id: number;
  productId: number;
  customerName: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: string;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api",
  headers: { "Content-Type": "application/json" },
});

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    productId: "",
    customerName: "",
    quantity: "",
    totalPrice: "",
    status: "Pending",
  });

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Create or Update Order
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderPayload = {
      id: selectedOrder?.id || 0,
      productId: parseInt(form.productId),
      customerName: form.customerName,
      quantity: parseInt(form.quantity),
      totalPrice: parseFloat(form.totalPrice),
      orderDate: new Date().toISOString(),
      status: form.status,
    };

    try {
      let res;
      if (selectedOrder) {
        res = await api.put(`/Orders/${selectedOrder.id}`, orderPayload);
      } else {
        res = await api.post("/Orders", orderPayload);
      }

      // ✅ Handle message response
      if (res.data?.message) {
        setMessage(res.data.message);
        setTimeout(() => setMessage(null), 3000);
      }

      await fetchOrders();
      setForm({
        productId: "",
        customerName: "",
        quantity: "",
        totalPrice: "",
        status: "Pending",
      });
      setSelectedOrder(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving order:", err);
      setMessage("Failed to save order. Check API connection.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // ✅ Delete Order
  const confirmDelete = async () => {
    try {
      if (selectedOrder) {
        await api.delete(`/Orders/${selectedOrder.id}`);
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
        setSelectedOrder(null);
        setIsDeleteOpen(false);
        setMessage("Order deleted successfully.");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      setMessage("Failed to delete order.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-lg p-6 mb-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <ClipboardList className="w-7 h-7 text-white" />
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-green-100 text-sm">
              Manage and monitor all customer orders
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSelectedOrder(null);
            setForm({
              productId: "",
              customerName: "",
              quantity: "",
              totalPrice: "",
              status: "Pending",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-white text-green-600 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Order
        </motion.button>
      </motion.div>

      {/* ✅ Success / Error Message */}
      {message && (
        <div className="mb-4 text-center bg-green-100 text-green-700 py-2 rounded-xl font-medium shadow-sm">
          {message}
        </div>
      )}

      {/* Orders Table */}
      <motion.div
        className="bg-white rounded-3xl shadow-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Clock className="mx-auto mb-3 w-10 h-10 text-gray-400" />
            <p>No orders to display yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Product ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50 transition`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {order.productId}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {order.quantity}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      ₱{order.totalPrice.toFixed(2)}
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
                    <td className="py-3 px-4 text-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setForm({
                            productId: order.productId.toString(),
                            customerName: order.customerName,
                            quantity: order.quantity.toString(),
                            totalPrice: order.totalPrice.toString(),
                            status: order.status,
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Edit order"
                      >
                        <PackageCheck className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDeleteOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete order"
                      >
                        <XCircle className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 🟢 Modal - Add/Edit Order */}
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
                <PlusCircle className="text-green-500" />
                {selectedOrder ? "Edit Order" : "Create New Order"}
              </h2>

              <form onSubmit={handleSaveOrder} className="space-y-5">
                {[
                  { name: "productId", label: "Product ID", type: "number" },
                  { name: "customerName", label: "Customer Name", type: "text" },
                  { name: "quantity", label: "Quantity", type: "number" },
                  {
                    name: "totalPrice",
                    label: "Total Price (₱)",
                    type: "number",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={(form as any)[field.name]}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder={`Enter ${field.label}`}
                    />
                  </div>
                ))}

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg shadow-md"
                >
                  {selectedOrder ? "Save Changes" : "Create Order"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 Delete Confirmation */}
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
                Delete Order
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete order #
                <span className="font-semibold">{selectedOrder?.id}</span>?
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

export default Orders;
