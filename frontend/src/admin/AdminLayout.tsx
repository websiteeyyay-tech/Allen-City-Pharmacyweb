import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  FaChartLine,
  FaBoxes,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaBell,
  FaQuestionCircle,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../assets/AllanCityPharmacyLogo.png"; // ✅ correct path

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Protect admin access
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/admin/inventory" },
    { name: "Orders", icon: <FaClipboardList />, path: "/admin/orders" },
    { name: "Reports", icon: <FaChartLine />, path: "/admin/reports" },
    { name: "Products", icon: <FaBoxes />, path: "/admin/products" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm">
        {/* Brand */}
        <div className="flex items-center mb-6">
          <img src={Logo} alt="Logo" className="w-8 h-8 mr-2 rounded-md" />
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
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

          <div className="mt-3 text-center text-xs text-gray-400">
            © 2025 Allen City Pharmacy
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* ✅ TOP NAVBAR */}
        <header className="flex justify-between items-center bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome, {user?.username || "Admin"}
          </h2>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="flex items-center focus:outline-none"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-green-500"
              />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
