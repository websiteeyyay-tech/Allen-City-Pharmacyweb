import React, { useState, useEffect, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  avatar?: string;
}

// ✅ Toast Notification
const Toast: React.FC<{
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color = {
    success: "bg-green-50 border-green-400 text-green-700",
    error: "bg-red-50 border-red-400 text-red-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  }[type];

  const icon = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️",
  }[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          z-50 px-8 py-6 rounded-2xl border shadow-2xl w-[90%] max-w-[30%] text-center font-semibold ${color}`}
      >
        <div className="text-3xl mb-2">{icon}</div>
        <p>{message}</p>
      </motion.div>
    </AnimatePresence>
  );
};

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    avatar: "",
  });
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [shakeFields, setShakeFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile");
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setToast({ message: "Failed to fetch profile data.", type: "error" });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setFormData({ ...formData, avatar: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const hasChanges = () => {
    if (!originalData) return true;
    for (const key of Object.keys(formData) as Array<keyof ProfileData>) {
      if (key === "avatar") {
        if (avatarFile) return true;
        continue;
      }
      if (formData[key] !== originalData[key]) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for empty required fields
    const emptyFields = Object.keys(formData).filter(
      (key) =>
        ["fullName", "email", "phone", "city", "state", "zip", "country"].includes(key) &&
        !formData[key as keyof ProfileData]
    );

    if (emptyFields.length > 0) {
      setShakeFields(emptyFields);
      setToast({ message: "Please fill in all required fields.", type: "error" });

      // Reset shake after animation
      setTimeout(() => setShakeFields([]), 700);
      return;
    }

    if (!hasChanges()) {
      setToast({ message: "No changes detected. Update not necessary.", type: "info" });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      ["fullName", "email", "phone", "city", "state", "zip", "country"].forEach((key) => {
        data.append(key, formData[key as keyof ProfileData] || "");
      });
      if (avatarFile) data.append("avatar", avatarFile);

      const response = await axios.put("/api/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedProfile = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), ...updatedProfile })
      );
      window.dispatchEvent(new Event("storage"));

      setToast({ message: "Profile updated successfully!", type: "success" });
      setOriginalData({ ...formData });
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({ message: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-tr from-emerald-400 via-green-400 to-lime-300 min-h-screen font-[Segoe_UI] text-gray-800 py-20 relative">
      <motion.div
        className="w-4/5 mx-auto bg-white rounded-3xl shadow-2xl p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-green-700 mb-10 text-center">Edit Profile</h1>

        <div className="flex justify-center mb-10">
          <div className="relative">
            <img
              src={formData.avatar || "https://via.placeholder.com/120"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-green-200 object-cover shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-green-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm cursor-pointer hover:bg-green-700 transition">
              ✎
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["fullName", "email", "phone", "city", "state", "zip", "country"].map((field) => {
              const isEmpty = !formData[field as keyof ProfileData];
              const shouldShake = shakeFields.includes(field);
              return (
                <motion.div
                  key={field}
                  animate={shouldShake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={field === "country" ? "md:col-span-2" : ""}
                >
                  <label className="text-sm text-gray-600 capitalize">{field}</label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    value={formData[field as keyof ProfileData] as string}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 mt-1 shadow-sm focus:outline-none ${
                      isEmpty && shakeFields.includes(field)
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:ring-2 focus:ring-green-400"
                    }`}
                  />
                </motion.div>
              );
            })}
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
              disabled={loading}
              className={`bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-800 transition font-semibold ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EditProfilePage;
