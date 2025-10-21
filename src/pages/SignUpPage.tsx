import React, { useState } from "react";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-emerald-700 via-teal-400 via-orange-400 to-yellow-400 bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] font-[Poppins]">
      <div className="bg-white/95 rounded-2xl shadow-xl backdrop-blur-md p-10 w-full max-w-md text-center animate-fadeIn">
        <img
          src="/Logo1.png"
          alt="Allen City Pharmacy Logo"
          className="w-28 mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-teal-900 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4 text-left">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-teal-900"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter your full name"
              required
              value={formData.fullname}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
            />
          </div>

          {/* Email */}
          <div className="mb-4 text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-teal-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
            />
          </div>

          {/* Username */}
          <div className="mb-4 text-left">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-teal-900"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4 text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-teal-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4 text-left">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-teal-900"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-900 text-white py-3 rounded-lg font-medium transition-transform transform hover:scale-[1.02] mt-2"
          >
            Create Account
          </button>

          {/* Login Link */}
          <a
            href="/login"
            className="block mt-4 text-teal-700 hover:text-teal-900 text-sm transition"
          >
            Already have an account? Login
          </a>
        </form>

        <p className="text-gray-500 text-xs mt-6">
          © 2025 Allen City Pharmacy. All rights reserved.
        </p>
      </div>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SignUpPage;