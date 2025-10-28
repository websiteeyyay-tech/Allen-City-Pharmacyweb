import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

// ✅ AXIOS INSTANCE (Backend setup)
const api = axios.create({
  baseURL: "http://127.0.0.1:5272/api", // 👈 matches your Swagger port
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Log all requests & responses
api.interceptors.request.use((request) => {
  console.log("🟢 Sending Request:", request.method?.toUpperCase(), request.url, request.data);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
    } else {
      console.error("🚫 Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ✅ LOGIN PAGE COMPONENT
const LoginPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "verify" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---- LOGIN ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/Auth/login", { username, passwordHash: password });
      alert("✅ Login successful!");
      window.location.href = "/";
    } catch (error: any) {
      alert("❌ Login failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ---- SIGN UP ----
  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert("❌ Passwords do not match!");
    return;
  }
  try {
    setLoading(true);
    const response = await api.post("/Auth/register", {
      username,
      passwordHash: password, // ✅ matches backend
      role: email, // or assign a fixed role, e.g. "customer"
    });
    alert("✅ Account created successfully! You can now log in.");
    setStep("login");
  } catch (error: any) {
    alert("❌ Signup failed: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};


  // ---- VERIFY OTP ----
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      alert("✅ Login successful! Redirecting...");
      window.location.href = "/";
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  // ---- TIMER ----
  useEffect(() => {
    if (step === "verify" && timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsResendAvailable(true);
    }
  }, [timer, step]);

  const resendOtp = () => {
    setTimer(60);
    setIsResendAvailable(false);
    setOtp("");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('/src/assets/AllanCityPharmacyLogo.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/90 via-[#00695c]/70 to-[#ff9800]/70 backdrop-blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-[#43a047]/30 blur-[150px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-[#ff9800]/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden bg-white/15 border border-white/20 backdrop-blur-2xl"
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
          <div className="absolute bottom-6 text-xs text-white/70">
            © 2025 Allen City Pharmacy
          </div>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white/95 backdrop-blur-xl"
        >
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative">
            {/* LOGIN FORM */}
            {step === "login" && (
              <>
                <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Sign in to continue your journey
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#43a047]"
                      placeholder="Username"
                      required
                    />
                    <label className="absolute left-3 top-2.5 text-sm text-gray-500">
                      Username
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9800]"
                      placeholder="Password"
                      required
                    />
                    <label className="absolute left-3 top-2.5 text-sm text-gray-500">
                      Password
                    </label>
                  </div>

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
            )}

            {/* SIGNUP FORM */}
            {step === "signup" && (
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

            {/* VERIFY FORM */}
            {step === "verify" && (
              <form onSubmit={handleVerify} className="space-y-6">
                <h2 className="text-3xl font-bold text-[#004d40] text-center">
                  Verify Your Identity
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Enter the 6-digit code sent to your email
                </p>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const newOtp =
                          otp.substring(0, i) +
                          e.target.value +
                          otp.substring(i + 1);
                        setOtp(newOtp);
                      }}
                      className="w-11 h-12 text-center border border-gray-300 rounded-md text-lg font-medium focus:ring-2 focus:ring-[#ff9800]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold"
                >
                  Verify Code
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  {isResendAvailable ? (
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-[#ff9800] hover:text-[#f57c00] font-medium"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p>
                      Resend available in{" "}
                      <span className="font-medium text-[#004d40]">
                        {timer}s
                      </span>
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
