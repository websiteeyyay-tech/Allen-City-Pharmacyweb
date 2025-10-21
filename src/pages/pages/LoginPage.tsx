import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(-45deg,#00796b,#26a69a,#ff7043,#fbc02d)] bg-[length:400%_400%] animate-[gradient_10s_ease_infinite]">
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 1s ease forwards;
            }
          `}
        </style>

        <img
          src="Logo1.png"
          alt="Allen City Pharmacy Logo"
          className="w-28 mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-[#004d40] mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#004d40]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] transition"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#004d40]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00796b] text-white py-3 rounded-lg font-medium hover:bg-[#004d40] transform hover:scale-[1.02] transition duration-300 mt-3"
          >
            Login
          </button>

          <a
            href="#"
            className="block text-center text-[#00796b] text-sm mt-4 hover:text-[#004d40] transition"
          >
            Forgot your password?
          </a>
        </form>

        <p className="text-xs text-gray-600 mt-6">
          © 2025 Allen City Pharmacy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;