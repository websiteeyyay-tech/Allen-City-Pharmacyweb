import React from "react";
import { useNavigate } from "react-router-dom";

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-['Segoe_UI',sans-serif] flex flex-col">
      {/* Header Section */}
      <section
        className="relative border-b border-gray-200 py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600959907703-125ba1374b0a?auto=format&fit=crop&w=1200&q=80')", // 💊 Pharmacy-themed background
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-80"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            If you’re interested in learning more about Allen City Pharmacy or
            have questions about any of our services, please complete the form
            below and one of our team members will reach out soon.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="relative flex flex-col lg:flex-row max-w-6xl mx-auto w-full py-16 px-6 gap-12 items-start bg-cover bg-center rounded-xl shadow-lg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1598966734798-0c54fe7c0641?auto=format&fit=crop&w=1200&q=80')", // 🧴 Soft healthcare background
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl"></div>

        {/* Left Info */}
        <div className="flex-1 relative z-10">
          <div className="border-t-4 border-green-500 w-12 mb-6"></div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            If you’re interested in receiving more information about Allen City
            Pharmacy or have questions about any of our services, please fill
            out the form. You’ll hear from one of our team members soon.
          </p>

          {/* Contact Info with Icons */}
          <div className="space-y-5 text-gray-700">
            <div className="flex items-start gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/535/535188.png"
                alt="Address Icon"
                className="w-6 h-6 mt-1"
              />
              <div>
                <span className="font-semibold">Address:</span>
                <p>123 Main Street</p>
                <p>Allen, TX 75002</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                alt="Phone Icon"
                className="w-6 h-6"
              />
              <div>
                <span className="font-semibold">Phone:</span>
                <p className="text-green-700 font-bold">+1 (972) 555-7890</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/646/646094.png"
                alt="Email Icon"
                className="w-6 h-6"
              />
              <div>
                <span className="font-semibold">Email:</span>
                <p>support@allencitypharmacy.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white bg-opacity-90 backdrop-blur-md shadow-md rounded-xl p-8 relative z-10">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent successfully!");
            }}
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">
                Are you currently a client?
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" name="client" value="yes" />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" name="client" value="no" />
                  No
                </label>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div className="col-span-2 flex justify-start">
              <button
                type="submit"
                className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-600 hover:text-white transition font-semibold"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Find Us Section */}
    <section
  className="w-full py-20 bg-cover bg-center bg-no-repeat text-center relative"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1580281657521-6a7b3b4ab2a5?auto=format&fit=crop&w=1200&q=80')", // 💊 Replace this with your preferred image
  }}
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-white bg-opacity-80"></div>

  <div className="relative z-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Us</h2>
    <p className="text-gray-700 mb-8 max-w-xl mx-auto">
      Looking for the nearest Allen City Pharmacy? Click below to view our
      store locator and find the most convenient location for you.
    </p>
    <button
      onClick={() => navigate("/store-locator")}
      className="border border-green-600 text-green-600 px-10 py-3 rounded-full hover:bg-green-600 hover:text-white transition font-semibold shadow-sm"
    >
      Find Us
    </button>
  </div>
</section>

    </div>
  );
};

export default ContactPage;
