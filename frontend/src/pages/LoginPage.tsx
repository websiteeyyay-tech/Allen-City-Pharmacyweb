// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // <== Use your global axios instance
import "./LoginPage.css";

// Toast Component (unchanged)
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
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className={`relative z-10 w-[90%] md:w-[23%] ${style.bg} border ${style.border} rounded-2xl shadow-2xl p-8 text-center`}
          >
            <div className="text-5xl mb-3">{style.icon}</div>
            <p className={`text-lg font-semibold ${style.text}`}>{message}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-white/80 rounded-xl shadow-md hover:bg-white"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// MAIN LOGIN PAGE
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setToast({ message: "Please enter your username and password.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      // 🔥 Correct backend login payload
      const response = await api.post("/Auth/login", {
        username,
        passwordHash: password,
      });

      // 🔥 Support both wrapped & unwrapped responses
      const user = response?.data?.user ?? response?.data ?? null;

      if (!user || !user.id) {
        setToast({ message: "Invalid credentials.", type: "error" });
        return;
      }

      const loggedUser = {
        id: user.id,
        username: user.username,
        role: user.role?.toLowerCase() || "customer",
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setToast({ message: `Welcome back, ${loggedUser.username}!`, type: "success" });

      setTimeout(() => {
        navigate(loggedUser.role === "admin" ? "/admin/dashboard" : "/");
      }, 1200);
    } catch (error: any) {
      console.error("Login error:", error);

      const status = error?.response?.status;
      const msg = error?.response?.data?.message;

      if (status === 404) {
        setToast({ message: "Account not found. Redirecting to Sign Up...", type: "info" });
        setTimeout(() => navigate("/signup"), 1400);
      } else if (status === 401) {
        setToast({ message: "Incorrect username or password.", type: "error" });
      } else {
        setToast({ message: msg || "Unable to reach server.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/Auth/google`;
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/AllanCityPharmacyLogo.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/90 via-[#00695c]/70 to-[#ff9800]/70 backdrop-blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col md:flex-row max-w-6xl w-full rounded-3xl bg-white/15 border backdrop-blur-2xl"
      >
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12">
          <motion.img src="/src/assets/AllanCityPharmacyLogo.png" className="w-44 mb-6" />
          <h1 className="text-5xl font-extrabold mb-4">Allen City Pharmacy</h1>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white/95">
          <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-extrabold text-[#004d40] text-center">Welcome Back!</h2>

            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border w-full p-3 rounded-xl"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full p-3 rounded-xl"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-1" />
              <span className="px-2 text-gray-500">or</span>
              <hr className="flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full border p-2 rounded-xl flex justify-center gap-2 hover:bg-gray-100"
            >
              <img src="/src/assets/google-icon.png" className="w-5" />
              Continue with Google
            </button>

            <p className="text-center mt-4">
              Don’t have an account?
              <button onClick={() => navigate("/signup")} className="text-[#ff9800] font-semibold ml-1">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LoginPage;
