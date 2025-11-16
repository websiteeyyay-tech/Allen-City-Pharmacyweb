// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Toast, { ToastType } from "../components/Toast";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // -----------------------------
  // HANDLE LOGIN
  // -----------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setToast({ message: "Please enter your username and password.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/Auth/login", { username, password });
      const data = response?.data ?? {};
      const user = data.user ?? data;

      if (!user?.id) {
        setToast({ message: "Invalid credentials.", type: "error" });
        return;
      }

      const loggedUser = {
        id: user.id,
        username: user.username ?? "User",
        role: (user.role ?? "customer").toLowerCase(),
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setToast({ message: `Welcome back, ${loggedUser.username}!`, type: "success" });

      // Role-based redirect
      setTimeout(() => {
        if (loggedUser.role === "admin") navigate("/admin/dashboard");
        else if (loggedUser.role === "doctor") navigate("/pharmacist/dashboard");
        else navigate("/");
      }, 1200);
    } catch (error: any) {
      console.error("Login error:", error);
      const status = error?.response?.status;
      const msg = error?.response?.data?.message ?? "Unable to reach server.";

      if (status === 404) {
        setToast({ message: "Account not found. Redirecting to Sign Up...", type: "info" });
        setTimeout(() => navigate("/signup"), 1400);
      } else if (status === 401) {
        setToast({ message: "Incorrect username or password.", type: "error" });
      } else {
        setToast({ message: msg, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // HANDLE GOOGLE LOGIN
  // -----------------------------
  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/Auth/google`;
  };

  // -----------------------------
  // HELPER TO LOAD ASSETS
  // -----------------------------
  const asset = (path: string) => `${process.env.PUBLIC_URL}${path}`;

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${asset("/assets/AllanCityPharmacyLogo.png")}')` }}
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
          <motion.img src={asset("/assets/AllanCityPharmacyLogo.png")} className="w-44 mb-6" />
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
              <img src={asset("/assets/google-icon.png")} className="w-5" />
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
