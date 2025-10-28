// src/pages/admin/Settings.tsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Save,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  CheckCircle2,
  Upload,
} from "lucide-react";

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div
      className={`p-6 min-h-screen transition-all ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
      }`}
    >
      {/* Header */}
      <motion.div
        className={`rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between backdrop-blur-md ${
          darkMode ? "bg-gray-800/60 border border-gray-700" : "bg-white/70"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <SettingsIcon
            className={`w-7 h-7 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h1
            className={`text-2xl font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            System Settings
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </motion.button>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          className={`rounded-2xl shadow-lg p-6 space-y-4 backdrop-blur-md ${
            darkMode ? "bg-gray-800/60 border border-gray-700" : "bg-white/70"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <User
              className={`w-6 h-6 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-700"
              }`}
            >
              Profile Settings
            </h2>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mt-3 space-y-3">
            <div className="relative group">
              <img
                src={
                  profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md group-hover:scale-105 transition-transform"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Inputs */}
          <div className="space-y-4 mt-4">
            {[
              { label: "Name", type: "text", placeholder: "Admin Name" },
              { label: "Email", type: "email", placeholder: "admin@email.com" },
              { label: "Password", type: "password", placeholder: "********" },
            ].map((field, i) => (
              <div key={i}>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`w-full rounded-xl p-2.5 border focus:ring-2 focus:outline-none ${
                    darkMode
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className={`rounded-2xl shadow-lg p-6 space-y-4 backdrop-blur-md ${
            darkMode ? "bg-gray-800/60 border border-gray-700" : "bg-white/70"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <Shield
              className={`w-6 h-6 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-700"
              }`}
            >
              System Preferences
            </h2>
          </div>

          <div className="space-y-6 mt-3">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between border-b pb-3 border-gray-300/40">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Dark Mode
                </span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-7 rounded-full p-1 transition-all ${
                  darkMode ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    darkMode ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email Notifications
                </span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-7 rounded-full p-1 transition-all ${
                  notifications ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    notifications ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          className={`rounded-2xl shadow-lg p-6 space-y-4 lg:col-span-2 backdrop-blur-md ${
            darkMode ? "bg-gray-800/60 border border-gray-700" : "bg-white/70"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <Shield
              className={`w-6 h-6 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            />
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-700"
              }`}
            >
              Security Settings
            </h2>
          </div>

          <div className="mt-3 space-y-3">
            {[
              "Two-factor Authentication",
              "Login Alerts",
              "Allow Passwordless Login via Email",
            ].map((setting, i) => (
              <label
                key={i}
                className={`flex items-center space-x-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-400"
                />
                <span>{setting}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
