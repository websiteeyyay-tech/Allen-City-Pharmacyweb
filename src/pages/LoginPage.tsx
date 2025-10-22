import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "verify">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendAvailable, setIsResendAvailable] = useState(false);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setTimeout(() => {
        setStep("verify");
        setTimer(60);
        setIsResendAvailable(false);
      }, 800);
    }
  };

  // Handle OTP verify
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      alert("✅ Login successful! Redirecting...");
      window.location.href = "/";
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  // Countdown timer
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
      style={{
        backgroundImage: `url('/src/assets/AllanCityPharmacyLogo.png')`,
      }}
    >
      {/* Gradient overlay with soft blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/90 via-[#00695c]/70 to-[#ff9800]/70 backdrop-blur-3xl"></div>

      {/* Decorative glowing orbs */}
      <div className="absolute w-96 h-96 bg-[#43a047]/30 blur-[150px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-[#ff9800]/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse delay-700"></div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden bg-white/15 border border-white/20 backdrop-blur-2xl"
      >
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12 relative overflow-hidden">
          <motion.img
            src="/src/assets/AllanCityPharmacyLogo.png"
            alt="Allen City Pharmacy"
            className="w-44 mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <motion.h1
            className="text-5xl font-extrabold mb-4 text-center tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Allen City Pharmacy
          </motion.h1>
          <p className="text-white/85 text-lg leading-relaxed text-center max-w-md">
            Secure access for healthcare professionals and patients. Manage
            prescriptions, track orders, and connect with our team seamlessly.
          </p>
          <div className="absolute bottom-6 text-xs text-white/70">
            © 2025 Allen City Pharmacy
          </div>
        </div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white/95 backdrop-blur-xl"
        >
          <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
            {step === "login" && (
              <>
                <h2 className="text-4xl font-extrabold text-[#004d40] mb-2 text-center">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Sign in to continue your journey
                </p>

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-4 mb-8">
                  <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:shadow-md hover:bg-gray-50 transition-all duration-300">
                    <FcGoogle size={22} />
                    <span className="text-gray-700 font-semibold">
                      Continue with Google
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-blue-50 hover:shadow-md transition-all duration-300">
                    <FaFacebook size={22} color="#1877F2" />
                    <span className="text-gray-700 font-semibold">
                      Continue with Facebook
                    </span>
                  </button>
                </div>

                <div className="flex items-center mb-8">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="mx-3 text-sm text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent transition-all duration-300"
                      placeholder="Username"
                      required
                    />
                    <label
                      htmlFor="username"
                      className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-[#43a047]"
                    >
                      Username
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ff9800] focus:border-transparent transition-all duration-300"
                      placeholder="Password"
                      required
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-[#ff9800]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input type="checkbox" className="accent-[#43a047]" />
                      <span>Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-[#ff9800] hover:text-[#f57c00] font-medium transition-all"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}

            {/* OTP Verification */}
            {step === "verify" && (
              <div>
                <h2 className="text-3xl font-bold text-[#004d40] mb-2 text-center">
                  Verify Your Identity
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Enter the 6-digit code sent to your email or phone
                </p>

                <form onSubmit={handleVerify} className="space-y-6">
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
                        className="w-11 h-12 text-center border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#ff9800] transition"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl font-semibold hover:opacity-95 transition duration-300 shadow-lg"
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
              </div>
            )}

            <p className="text-xs text-gray-400 mt-8 text-center md:hidden">
              © 2025 Allen City Pharmacy
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
