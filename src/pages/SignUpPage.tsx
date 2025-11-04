// src/pages/SignUpPage.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"; // ✅ Reuse same CSS as login for gradient, font, etc.

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://localhost:5272/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Toast Component (reused for success/error/info)
const Toast: React.FC<{
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { bg: "bg-green-50/95", border: "border-green-400", text: "text-green-700", icon: "✅" },
    error: { bg: "bg-red-50/95", border: "border-red-400", text: "text-red-700", icon: "❌" },
    info: { bg: "bg-blue-50/95", border: "border-blue-400", text: "text-blue-700", icon: "ℹ️" },
  };
  const style = styles[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`relative z-10 w-[90%] md:w-[23%] ${style.bg} border ${style.border} rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center`}
          >
            <div className="text-5xl mb-3">{style.icon}</div>
            <p className={`text-lg font-semibold ${style.text}`}>{message}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-white/80 rounded-xl shadow-md text-gray-700 hover:bg-white"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ✅ Main Sign Up Page
const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit registration form
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setToast({ message: "Please fill out all required fields.", type: "error" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }

const payload = {
  fullname: formData.fullname,
  username: formData.username,
  email: formData.email,
  passwordHash: formData.password,
  role: "customer", // ✅ force all new users to be customers
};

    try {
      setLoading(true);
      const response = await api.post("/Auth/register", payload);

      if (response.status === 200 || response.status === 201) {
        setToast({ message: "Account created successfully!", type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setToast({ message: "Registration failed. Try again.", type: "error" });
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to connect to the backend. Make sure your API is running.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url('/src/assets/AllanCityPharmacyLogo.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/90 via-[#00695c]/70 to-[#ff9800]/70 backdrop-blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white/15 border border-white/20 backdrop-blur-2xl"
      >
        {/* Left Side (Branding) */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12 relative">
          <motion.img
            src="/src/assets/AllanCityPharmacyLogo.png"
            alt="Logo"
            className="w-44 mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl font-extrabold mb-4 text-center">
            Allen City Pharmacy
          </h1>
          <p className="text-white/85 text-lg text-center max-w-md">
            Register your account to access health services and track prescriptions securely.
          </p>
        </div>

        {/* Right Side (Sign Up Form) */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white/95 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
            <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center drop-shadow-sm">
              Create Account
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Join our pharmacy community today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800]"
                required
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800]"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#ff9800] hover:text-[#f57c00] font-semibold"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ✅ Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SignUpPage;
