import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Toast, { ToastType } from "../components/Toast";

const RESEND_DELAY = 30;

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email] = useState<string>(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [counter, setCounter] = useState<number>(0);

  // Countdown effect
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleResendVerification = async () => {
    if (!email) {
      setToast({ message: "Invalid email address.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/Auth/resend-verification", { email });

      setToast({
        message: "Verification email sent successfully!",
        type: "success",
      });

      setCounter(RESEND_DELAY);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Unable to resend verification email.";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-emerald-700 via-teal-400 via-orange-400 to-yellow-400 bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] p-4 font-[Poppins]">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="bg-white/95 rounded-2xl shadow-xl backdrop-blur-md p-8 max-w-lg w-full"
      >
        {/* Logo */}
        <img
          src="/Logo1.png"
          alt="Allen City Pharmacy Logo"
          className="w-24 mx-auto mb-4"
        />

        <h2 className="text-3xl font-extrabold text-teal-900 text-center">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-700 mt-3">
          We’ve sent a verification email to:
          <br />
          <strong className="text-teal-900">{email || "your email"}</strong>
        </p>

        <p className="text-center text-gray-600 mt-2 text-sm">
          Please check your inbox and spam folder.
        </p>

        <div className="mt-8 space-y-4">

          {/* Resend Button */}
          <button
            onClick={handleResendVerification}
            disabled={loading || counter > 0}
            className={`
              w-full py-3 rounded-lg font-medium text-white 
              transition-transform
              bg-teal-700 hover:bg-teal-900
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {loading
              ? "Sending..."
              : counter > 0
              ? `Resend in ${counter}s`
              : "Resend Verification Email"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full text-center text-teal-700 hover:text-teal-900 font-medium"
          >
            Back to Login
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-6 text-center">
          © 2025 Allen City Pharmacy. All rights reserved.
        </p>
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EmailVerificationPage;
