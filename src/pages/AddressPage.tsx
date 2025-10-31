import React, { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  label?: string;
}

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [newAddress, setNewAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    label: "",
  });
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([...addresses, newAddress]);
    setNewAddress({ street: "", city: "", state: "", zip: "", country: "", label: "" });
    setShowForm(false);
    alert("Address saved successfully!");
  };

  return (
    <div className="flex flex-col bg-gradient-to-tr from-emerald-400 via-green-400 to-lime-300 min-h-screen font-[Segoe_UI] text-gray-800 py-20">
      <motion.div
        className="w-4/5 mx-auto bg-white rounded-3xl shadow-2xl p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-green-700 mb-10 text-center">
          Manage Addresses
        </h1>

        {/* Existing Addresses */}
        {addresses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Your Addresses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((addr, idx) => (
                <motion.div
                  key={idx}
                  className="bg-green-50 p-6 rounded-2xl shadow-md border border-green-100"
                  whileHover={{ scale: 1.03 }}
                >
                  <p className="font-semibold text-green-800">{addr.label || "No Label"}</p>
                  <p className="text-gray-700">
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Button to show form */}
        {!showForm && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
            >
              Add New Address
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Address Label", name: "label" },
                { label: "Street Address", name: "street" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "ZIP Code", name: "zip" },
                { label: "Country", name: "country" },
              ].map((field) => (
                <div key={field.name} className={field.name === "label" || field.name === "street" ? "md:col-span-2" : ""}>
                  <label className="text-sm text-gray-600">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={newAddress[field.name as keyof AddressData]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Back to Home
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-800 transition font-semibold"
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AddressPage;
