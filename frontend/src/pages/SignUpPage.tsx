import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Toast, { ToastType } from "../components/Toast";

const asset = (path: string) => path;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/Auth/register", {
        username,
        email,
        password,
      });

      if (response?.success === false) {
        setToast({ message: response.message ?? "Registration failed", type: "error" });
        return;
      }

      // SUCCESS → show toast
      setToast({ message: "Account created! Verify your email.", type: "success" });

      // Redirect to verification page WITH EMAIL
      setTimeout(() => {
        navigate("/verify-email", {
          state: { email },
        });
      }, 1200);

    } catch (error: any) {
      const msg = error?.response?.data?.message ?? "Signup failed. Try again.";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('${asset("/assets/AllanCityPharmacyLogo.png")}')`,
      }}
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
            <h2 className="text-4xl font-extrabold text-[#004d40] text-center">
              Create Your Account
            </h2>

            <form onSubmit={handleSignup} className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border w-full p-3 rounded-xl"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account?
              <button
                onClick={() => navigate("/login")}
                className="text-[#ff9800] ml-1 font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default SignupPage;
