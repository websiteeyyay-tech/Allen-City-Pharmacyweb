import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

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

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- LOGIN ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/Auth/login", {
        username,
        passwordHash: password,
      });

      console.log("✅ Login response:", response.data);
      const data = response.data;

      // Save user data
      const loggedUser = {
        id: data.id,
        username: data.username,
        role: data.role?.toLowerCase() || "user",
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      alert("✅ Login successful!");

      // Redirect based on role
      if (loggedUser.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      alert("❌ Login failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ---- SIGNUP ----
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      await api.post("/Auth/register", {
        username,
        passwordHash: password,
        role: "customer", // default role
      });
      alert("✅ Account created successfully! You can now log in.");
      setStep("login");
    } catch (error: any) {
      alert("❌ Signup failed: " + (error.response?.data?.message || error.message));
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
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative">
            {step === "login" ? (
              <>
                <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Sign in to continue your journey
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                    placeholder="Username"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800]"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
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
                </form>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center">
                  Create Account
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Join Allen City Pharmacy today
                </p>
                <form onSubmit={handleSignup} className="space-y-6">
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
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
                  >
                    {loading ? "Creating..." : "Sign Up"}
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
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;