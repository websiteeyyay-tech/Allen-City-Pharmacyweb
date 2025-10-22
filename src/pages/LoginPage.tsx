import React, { useState, useEffect } from "react";

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "verify">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendAvailable, setIsResendAvailable] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      console.log("Logging in:", username);
      setTimeout(() => {
        setStep("verify");
        setTimer(60);
        setIsResendAvailable(false);
      }, 800);
    }
  };

  // Handle OTP Verify
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      alert("✅ Login successful! Redirecting...");
      window.location.href = "/";
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  // Countdown for resend
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
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(-45deg,#00796b,#43a047,#ff9800,#f57c00)] bg-[length:400%_400%] animate-[gradient_12s_ease_infinite] overflow-hidden">
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>

      {/* Left side */}
      <div className="hidden md:flex md:w-1/2 bg-[linear-gradient(135deg,rgba(0,77,64,0.95),rgba(255,152,0,0.9))] items-center justify-center text-white p-12 relative">
        <div className="max-w-md">
          <img
            src="Logo1.png"
            alt="Allen City Pharmacy Logo"
            className="w-36 mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold leading-snug mb-4">
            Allen City Pharmacy Portal
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Secure access for healthcare professionals and patients. Manage prescriptions, track orders, and connect with our team seamlessly.
          </p>
        </div>
        <div className="absolute bottom-6 left-12 text-xs text-white/70">
          © 2025 Allen City Pharmacy
        </div>
      </div>

      {/* Right side */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white/80 backdrop-blur-md shadow-inner">
        <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-2xl p-8 border border-gray-100 animate-fadeIn relative overflow-hidden">
          {step === "login" && (
            <>
              <h2 className="text-2xl font-semibold text-[#004d40] mb-2 text-center">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Please sign in to continue
              </p>

              <form
                onSubmit={handleLogin}
                className="space-y-6 animate-[fadeSlide_0.6s_ease]"
              >
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ff9800] focus:border-transparent transition"
                    placeholder="Username"
                    required
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-[#ff9800]"
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
                    className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent transition"
                    placeholder="Password"
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-[#43a047]"
                  >
                    Password
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input type="checkbox" className="accent-[#43a047]" />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-[#ff9800] hover:text-[#f57c00] transition"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-lg font-medium hover:opacity-90 transform hover:scale-[1.02] transition duration-300 shadow-lg"
                >
                  Sign In
                </button>
              </form>
            </>
          )}

          {step === "verify" && (
            <div className="animate-[fadeSlide_0.6s_ease]">
              <h2 className="text-2xl font-semibold text-[#004d40] mb-2 text-center">
                Verify Your Identity
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter the 6-digit verification code sent to your registered
                email or phone.
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
                          otp.substring(0, i) + e.target.value + otp.substring(i + 1);
                        setOtp(newOtp);
                      }}
                      className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#ff9800] transition"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-lg font-medium hover:opacity-90 transform hover:scale-[1.02] transition duration-300 shadow-lg"
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
      </div>
    </div>
  );
};

export default LoginPage;
