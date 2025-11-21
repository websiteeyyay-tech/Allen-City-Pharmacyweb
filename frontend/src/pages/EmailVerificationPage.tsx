import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Toast, { ToastType } from "../components/Toast";
import "./EmailVerificationPage.css";

const RESEND_DELAY = 30; // seconds

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from SignUpPage
  const passedEmail = location.state?.email || "";

  const [email] = useState<string>(passedEmail);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [counter, setCounter] = useState<number>(0);

  // 🔥 If email is missing → redirect back to SignupPage
  useEffect(() => {
    if (!passedEmail) {
      setToast({
        message: "No email found. Redirecting to Signup...",
        type: "error",
      });

      setTimeout(() => navigate("/signup"), 2000);
    }
  }, [passedEmail, navigate]);

  // Countdown effect
  useEffect(() => {
    let timer: number;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      setLoading(true);
      await api.post("/Auth/resend-verification", { email });
      setToast({ message: "Verification email has been sent!", type: "success" });
      setCounter(RESEND_DELAY); // start countdown
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? "Resend error occurred.";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

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
        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white p-12">
          <motion.img src={asset("/assets/AllanCityPharmacyLogo.png")} className="w-44 mb-6" />
          <h1 className="text-5xl font-extrabold mb-4">Allen City Pharmacy</h1>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white/95">
          <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-extrabold text-[#004d40] text-center">Email Verification</h2>

            <p className="text-center text-lg mt-4">
              A verification email has been sent to <strong>{email}</strong>.
            </p>

            <div className="flex flex-col items-center mt-6 space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={loading || counter > 0}
                className={`w-full bg-gradient-to-r from-[#43a047] to-[#ff9800] text-white py-3 rounded-xl ${
                  loading || counter > 0 ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? "Resending..."
                  : counter > 0
                  ? `Resend in ${counter}s`
                  : "Resend Verification Email"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="text-[#ff9800] font-semibold"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EmailVerificationPage;
