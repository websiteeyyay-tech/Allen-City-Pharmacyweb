import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users as UsersIcon, UserPlus, Search, Mail, X } from "lucide-react";
import axios from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api", // adjust if backend runs on different port
  headers: { "Content-Type": "application/json" },
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  image?: string;
}

const Users: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Add new user to backend
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await api.post("/users", newUser);
      await fetchUsers();
      setShowModal(false);
      setNewUser({ name: "", email: "", role: "" });
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user. Check console for details.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <UsersIcon className="w-7 h-7 text-teal-500" />
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow transition-all"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
      </motion.div>

      {/* User Table */}
      <motion.div
        className="bg-white rounded-2xl shadow p-6 overflow-x-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filteredUsers.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-teal-50 transition-all cursor-pointer border-b"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-3">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "Admin"
                          ? "bg-teal-100 text-teal-700"
                          : user.role === "Pharmacist"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No users found. Try adding one!
          </p>
        )}
      </motion.div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600" /> Add New User
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="">Choose Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow transition"
                >
                  Save User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
