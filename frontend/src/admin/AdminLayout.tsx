// src/layouts/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBoxes,
  FaChartLine,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import logo from "../assets/AllanCityPharmacyLogo.png";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Protect admin-only access
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      navigate("/"); // redirect non-admin users
    }
  }, [user, navigate]);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/admin/inventory" },
    { name: "Orders", icon: <FaClipboardList />, path: "/admin/orders" },
    { name: "Reports", icon: <FaChartLine />, path: "/admin/reports" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm">
        {/* Brand / Logo */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2 rounded-md" />
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 mb-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems
            .filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
        </nav>

        {/* Footer */}
        <div className="border-t mt-4 pt-3 text-sm text-gray-600 space-y-2">
          <button
            type="button"
            className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaQuestionCircle className="mr-2" /> Help Center
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 mt-2 rounded-lg hover:bg-gray-100 text-red-600"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>

          <div className="mt-3 text-center text-xs text-gray-400">
            © 2025 Allen City Pharmacy
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
