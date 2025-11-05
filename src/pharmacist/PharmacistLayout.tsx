import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  FaHome,
  FaBoxes,
  FaChartLine,
  FaCog,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import Logo from "../assets/AllanCityPharmacyLogo.png";

const PharmacistLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ Protect pharmacist access
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "doctor") {
      navigate("/"); // redirect non-pharmacists
    }
  }, [user, navigate]);

  // ✅ Pharmacist menu items
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/pharmacist/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/pharmacist/inventory" },
    { name: "Medicines", icon: <FaClipboardList />, path: "/pharmacist/medicines" },
    { name: "Reports", icon: <FaChartLine />, path: "/pharmacist/reports" },
    { name: "Settings", icon: <FaCog />, path: "/pharmacist/settings" },
  ];

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm">
        {/* Brand */}
        <div className="flex items-center mb-6">
          <img src={Logo} alt="Logo" className="w-8 h-8 mr-2 rounded-md" />
          <h1 className="text-xl font-semibold text-gray-800">Pharmacist Panel</h1>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
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
          <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FaQuestionCircle className="mr-2" /> Help Center
          </button>
          <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FaBell className="mr-2 text-red-500" /> Notifications
            <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              3
            </span>
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

export default PharmacistLayout;
