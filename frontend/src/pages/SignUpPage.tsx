// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Toast, { ToastType } from "../components/Toast";

interface FormState {
  fullname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  fullname: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: ToastType } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined })); // clears error when typing
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};

    if (!formData.fullname.trim()) errs.fullname = "Full name is required";
    if (!formData.username.trim() || formData.username.length < 3)
      errs.username = "Username must be at least 3 characters";

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email address";

    const strong = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) errs.password = "Password is required";
    else if (!strong.test(formData.password))
      errs.password = "Password must be 8+ chars, include an uppercase letter and number";

    if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = "Passwords do not match";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        fullname: formData.fullname.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password, // name adjusted for backend
        role: "customer",
      };

      const response = await api.post("/Auth/register", payload);

      setToast({ message: "Account created successfully!", type: "success" });
      setTimeout(() => navigate("/login"), 1500);

    } catch (err: any) {
      console.error("Registration error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to register. Please try again.";

      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-emerald-700 via-teal-400 via-orange-400 to-yellow-400 bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] font-[Poppins] p-4">

      <div className="bg-white/95 rounded-2xl shadow-xl backdrop-blur-md p-8 max-w-lg w-full">
        <img src="/Logo1.png" alt="Allen City Pharmacy Logo" className="w-24 mx-auto mb-4" />

        <h2 className="text-2xl font-semibold text-teal-900 mb-4 text-center">Create Your Account</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* --- Full Name --- */}
          <div>
            <label className="block text-sm font-medium text-teal-900">Full Name</label>
            <input
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              disabled={loading}
              className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 ${
                fieldErrors.fullname ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-teal-700"
              }`}
              placeholder="Enter your full name"
            />
            {fieldErrors.fullname && <p className="text-red-500 text-sm">{fieldErrors.fullname}</p>}
          </div>

          {/* --- Email --- */}
          <div>
            <label className="block text-sm font-medium text-teal-900">Email</label>
            <input
              name="email"
              type="email"
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 ${
                fieldErrors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-teal-700"
              }`}
              placeholder="Enter your email"
            />
            {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
          </div>

          {/* --- Username --- */}
          <div>
            <label className="block text-sm font-medium text-teal-900">Username</label>
            <input
              name="username"
              disabled={loading}
              value={formData.username}
              onChange={handleChange}
              className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 ${
                fieldErrors.username ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-teal-700"
              }`}
              placeholder="Choose a username"
            />
            {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username}</p>}
          </div>

          {/* --- Password --- */}
          <div>
            <label className="block text-sm font-medium text-teal-900">Password</label>
            <input
              name="password"
              type="password"
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 ${
                fieldErrors.password ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-teal-700"
              }`}
              placeholder="Enter a strong password"
            />
            {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
          </div>

          {/* --- Confirm Password --- */}
          <div>
            <label className="block text-sm font-medium text-teal-900">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              disabled={loading}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 ${
                fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-teal-700"
              }`}
              placeholder="Re-enter your password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-900 text-white py-3 rounded-lg font-medium transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-3 text-sm text-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/login")}
              className="text-teal-700 hover:text-teal-900"
            >
              Already have an account? Login
            </button>
          </p>
        </form>

        <p className="text-gray-500 text-xs mt-6 text-center">© 2025 Allen City Pharmacy. All rights reserved.</p>
      </div>

      {/* Toast Messages */}
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

export default SignUpPage;
