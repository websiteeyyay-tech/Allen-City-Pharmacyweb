import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./LoginPage.css";

// ✅ AXIOS INSTANCE
const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((req) => {
  console.log("🟢 Request:", req.method?.toUpperCase(), req.url, req.data);
  return req;
});
api.interceptors.response.use(
  (res) => {
    console.log("✅ Response:", res.status, res.data);
    return res;
  },
  (err) => {
    console.error("❌ API Error:", err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

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
            className={`relative z-10 w-[90%] md:w-[23%] ${style.bg} border ${style.border} 
              rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center`}
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

// ✅ MAIN COMPONENT
const LoginPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // ---- LOGIN ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/Auth/login", { username, passwordHash: password });

      const user = response.data.user || response.data;
      const loggedUser = { id: user.id, username: user.username, role: user.role?.toLowerCase() || "user" };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setToast({ message: `Welcome back, ${loggedUser.username}!`, type: "success" });

      setTimeout(() => {
        window.location.href = loggedUser.role === "admin" ? "/admin/dashboard" : "/";
      }, 1200);

    } catch (error: any) {
      const message = error.response?.data?.message || error.message;

      // 🔍 If user doesn’t exist in DB, redirect to signup
      if (message.toLowerCase().includes("user not found") || message.toLowerCase().includes("invalid username")) {
        setToast({
          message: "Account not found. Please sign up first!",
          type: "error",
        });
        setTimeout(() => setStep("signup"), 2000);
      } else if (message.toLowerCase().includes("invalid password")) {
        setToast({ message: "Incorrect password. Try again.", type: "error" });
      } else {
        setToast({ message: "Login failed: " + message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // ---- SIGNUP ----
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match!", type: "error" });
      return;
    }
    try {
      setLoading(true);
      await api.post("/Auth/register", { username, email, passwordHash: password, role });
      setToast({ message: "Account created successfully! You can now log in.", type: "success" });
      setStep("login");
    } catch (error: any) {
      setToast({ message: "Signup failed: " + (error.response?.data?.message || error.message), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ---- GOOGLE LOGIN ----
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5272/api/Auth/google";
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url('/src/assets/AllanCityPharmacyLogo.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/90 via-[#00695c]/70 to-[#ff9800]/70 backdrop-blur-3xl"></div>

      {/* ✨ Floating Background Particles */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-md"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.8, 0.3],
              transition: { duration: Math.random() * 5 + 4, repeat: Infinity },
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white/15 border border-white/20 backdrop-blur-2xl"
      >
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12 relative">
          <motion.img
            src="/src/assets/AllanCityPharmacyLogo.png"
            alt="Allen City Pharmacy"
            className="w-44 mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl font-extrabold mb-4 text-center">Allen City Pharmacy</h1>
          <p className="text-white/85 text-lg text-center max-w-md">
            Secure access for healthcare professionals and patients.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white/95 backdrop-blur-xl"
        >
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
            {step === "login" ? (
              <>
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl font-extrabold text-[#004d40] mb-2 text-center drop-shadow-sm"
                >
                  Welcome Back!
                </motion.h2>
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
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold 
                      relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <span>{loading ? "Signing In..." : "Sign In"}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  </button>
                </form>

                <div className="flex items-center my-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="px-2 text-gray-500">or continue with</span>
                  <hr className="flex-1 border-gray-300" />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition w-full justify-center"
                  >
                    <img src="/src/assets/google-icon.png" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>
                </div>

                <p className="text-center text-gray-600 mt-4">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("signup")}
                    className="text-[#ff9800] hover:text-[#f57c00] font-semibold"
                  >
                    Sign Up
                  </button>
                </p>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-3xl"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-10 h-10 border-4 border-[#43a047] border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl font-extrabold text-[#004d40] mb-2 text-center drop-shadow-sm"
                >
                  Create Account
                </motion.h2>
                <p className="text-gray-600 text-center mb-6">Join Allen City Pharmacy today</p>

                <form onSubmit={handleSignup} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#43a047]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#43a047]"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#ff9800]"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#ff9800]"
                    required
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#43a047] bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold 
                      relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <span>{loading ? "Creating..." : "Sign Up"}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  </button>

                  <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setStep("login")}
                      className="text-[#43a047] hover:text-[#2e7d32] font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                </form>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-3xl"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-10 h-10 border-4 border-[#43a047] border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LoginPage;
