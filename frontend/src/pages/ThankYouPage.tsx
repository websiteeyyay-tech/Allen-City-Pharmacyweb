import React from "react";
import { CheckCircle2 } from "lucide-react";

const ThankYouPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[linear-gradient(135deg,#22c58f_0%,#af9f11_100%)] bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] font-sans text-gray-800 p-4 text-center">
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-10 max-w-lg w-full animate-fadeIn">
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

        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-green-600 w-20 h-20" />
        </div>

        <h1 className="text-3xl font-semibold text-[#004d40] mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-700 text-base mb-6">
          Your order has been successfully placed and is being processed.  
          You’ll receive a confirmation email shortly.
        </p>

        <a
          href="/"
          className="inline-block bg-[#00796b] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004d40] transform hover:scale-[1.02] transition duration-300"
        >
          Return to Home
        </a>

        <p className="mt-8 text-sm text-gray-600">
          © 2025 Allen City Pharmacy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;