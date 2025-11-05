// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./LoginPage.css";

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://localhost:5272/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Toast Component
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

// ✅ Main Login Page
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // ✅ Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setToast({ message: "Please enter your username and password.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/Auth/login", {
        username,
        passwordHash: password,
      });

      const user = response.data.user || response.data;

      if (!user || !user.id) {
        setToast({ message: "Invalid credentials or user not found.", type: "error" });
        return;
      }

      const loggedUser = {
        id: user.id,
        username: user.username,
        role: user.role?.toLowerCase() || "user",
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));

      setToast({ message: `Welcome back, ${loggedUser.username}!`, type: "success" });

      // ✅ Redirect by role
      setTimeout(() => {
        if (loggedUser.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (loggedUser.role === "doctor") {
          window.location.href = "/pharmacist/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1200);
    } catch (error: any) {
      console.error("❌ Login error:", error);

      if (error.response?.status === 404) {
        setToast({ message: "Account not found. Redirecting to Sign Up...", type: "info" });
        setTimeout(() => navigate("/signup"), 2000);
      } else if (error.response?.status === 401) {
        setToast({ message: "Incorrect username or password.", type: "error" });
      } else {
        setToast({
          message: error.response?.data?.message || "Unable to connect to backend.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5272/api/Auth/google";
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
        {/* Left Side (Logo + Branding) */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12 relative">
          <motion.img
            src="/src/assets/AllanCityPharmacyLogo.png"
            alt="Logo"
            className="w-44 mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl font-extrabold mb-4 text-center">Allen City Pharmacy</h1>
          <p className="text-white/85 text-lg text-center max-w-md">
            Secure access for healthcare professionals and patients.
          </p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white/95 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
            <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center drop-shadow-sm">
              Welcome Back!
            </h2>
            <p className="text-gray-600 text-center mb-6">Sign in to continue your journey</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="px-2 text-gray-500">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition w-full"
            >
              <img src="/src/assets/google-icon.png" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <p className="text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#ff9800] hover:text-[#f57c00] font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LoginPage;
