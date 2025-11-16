import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Pill,
  RefreshCcw,
  Package,
  Syringe,
  Stethoscope,
  DollarSign,
  MapPin,
  CheckCircle,
} from "lucide-react";

// ✅ Import background image
import LocalBackground from "../assets/Local.jpg";

const OrderPage: React.FC = () => {
  const [step, setStep] = useState<
    "choose" | "upload" | "status" | "transfer" | "immunization" | "refill"
  >("choose");
const navigate = useNavigate();
  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  // Removed unused orderStatus state
  const [transferData, setTransferData] = useState({
    name: "",
    currentPharmacy: "",
    rxNumber: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
useEffect(() => {
    const user = localStorage.getItem("user"); // Or localStorage.getItem("token")
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);
  // ✅ Floating icons animation
  useEffect(() => {
    const icons = document.querySelectorAll(".float-icon");
    icons.forEach((icon) => {
      const animate = () => {
        const duration = 20 + Math.random() * 10;
        const delay = Math.random() * 10;
        const xMove = Math.random() * 80 - 40;
        (icon as HTMLElement).animate(
          [
            { transform: "translate(0, 0)", opacity: 0.3 },
            { transform: `translate(${xMove}px, -120vh)`, opacity: 0 },
          ],
          {
            duration: duration * 1000,
            delay: delay * 500,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      };
      animate();
    });
  }, []);

  // ✅ Simple reusable confirmation modal
  const ConfirmModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg animate-fadeIn">
        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
        <p className="text-lg font-semibold mb-4 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition"
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col text-gray-800 overflow-hidden">
      {/* ✅ Floating Icons */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        {[Pill, Syringe, Stethoscope, Package, Camera, DollarSign].map(
          (Icon, index) => (
            <div
              key={index}
              className="float-icon absolute text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Icon size={48} />
            </div>
          )
        )}
      </div>

{/* 🌿 Elegant & Modern Hero Section */}
<section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full text-center overflow-hidden">

  {/* 🖼️ Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fadeIn"
    style={{
      backgroundImage: `url(${LocalBackground})`,
      filter: "brightness(0.55) contrast(1.2)",
      transform: "scale(1.05)",
    }}
  />

  {/* 🌈 Gradient Layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-800/50 via-emerald-600/40 to-green-900/60 mix-blend-overlay" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 opacity-70" />

  {/* ✨ Ambient Glow Orbs */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-64 h-64 bg-green-400/20 rounded-full blur-3xl top-10 -left-12 animate-pulse" />
    <div className="absolute w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl bottom-0 -right-20 animate-float-slow" />
    <div className="absolute w-48 h-48 bg-lime-400/10 rounded-full blur-3xl top-[40%] left-[60%] animate-float" />
  </div>

  {/* 🌤️ Moving Light Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(241, 241, 241, 0.15),transparent_70%)] animate-lightMove" />

  {/* 💎 Hero Content */}
  <div className="relative z-10 max-w-3xl mx-4 px-8 py-10 md:px-16 md:py-14 rounded-3xl backdrop-blur-lg bg-white/5 border border-white/15 shadow-xl animate-fadeSlideUp">
    <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 drop-shadow-lg mb-5 tracking-tight leading-tight">
      Manage Your Prescriptions & Health Services
    </h1>

    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
      Refill, transfer, or track prescriptions — plus book vaccines, explore savings, and access care, all in one place.
    </p>

    <a
      href="#main"
      className=" bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-3 px-10 rounded-full transition-transform transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-orange-400/50"
    >
      Explore Services ↓
    </a>
  </div>

  {/* 🎨 Custom Animations */}
  <style>{`
    @keyframes float-slow {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-20px) translateX(10px); }
    }

    @keyframes lightMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .animate-float-slow {
      animation: float-slow 10s ease-in-out infinite;
    }

    .animate-lightMove {
      animation: lightMove 15s ease-in-out infinite;
      background-size: 200% 200%;
    }
  `}</style>
</section>



      {/* ✅ Main Section */}
      <main id="main" className="relative z-10 flex-1 bg-white rounded-t-3xl py-16 animate-fadeInSlow">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* ✅ Step 1 — Choose an Action */}
          {step === "choose" && (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
                {[
                  {
                    icon: Camera,
                    title: "Upload Prescription",
                    desc: "Snap or upload your prescription to start a new order.",
                    onClick: () => setStep("upload"),
                  },
                  {
                    icon: Pill,
                    title: "Refill Prescription",
                    desc: "Quickly refill by entering your prescription number.",
                    onClick: () => setStep("refill"),
                  },
                  {
                    icon: RefreshCcw,
                    title: "Transfer Prescription",
                    desc: "Move your prescription from another pharmacy to us.",
                    onClick: () => setStep("transfer"),
                  },
                  {
                    icon: Package,
                    title: "Track My Orders",
                    desc: "Check your prescription or delivery status instantly.",
                    onClick: () => setStep("status"),
                  },
                ].map(({ icon: Icon, title, desc, onClick }, i) => (
                  <div
                    key={i}
                    onClick={onClick}
                    className="p-8 rounded-3xl shadow-lg bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer hover:scale-105"
                  >
                    <Icon className="w-12 h-12 text-green-600 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-xl font-bold text-green-700 mb-2">{title}</h2>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>

              {/* ✅ Health Services */}
              <div className="grid md:grid-cols-3 gap-8 mt-20">
                {[
                  {
                    icon: Syringe,
                    title: "Immunizations",
                    desc: "Book vaccines for flu, COVID-19, shingles, and more.",
                    onClick: () => setStep("immunization"),
                  },
                  {
                    icon: Stethoscope,
                    title: "Virtual Care",
                    desc: "Connect online with certified pharmacists and doctors.",
                  },
                  {
                    icon: DollarSign,
                    title: "Medication Savings",
                    desc: "Explore discounts and generic alternatives to save more.",
                  },
                ].map(({ icon: Icon, title, desc, onClick }, i) => (
                  <div
                    key={i}
                    onClick={onClick}
                    className="p-8 rounded-3xl bg-gradient-to-br from-green-100 to-green-50 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer hover:scale-105"
                  >
                    <Icon className="w-12 h-12 text-green-600 mx-auto mb-3 animate-float" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">{title}</h3>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>

              {/* ✅ Store Locator */}
              <div className="mt-24 text-center bg-green-50 rounded-3xl py-12 shadow-inner animate-fadeSlideUp">
                <MapPin className="w-14 h-14 text-green-600 mx-auto mb-3 animate-bounce" />
                <h2 className="text-3xl font-bold text-green-700 mb-2">
                  Find a Pharmacy Near You
                </h2>
                <p className="text-gray-600 mb-6">
                  Schedule pickups, vaccinations, or consultations with ease.
                </p>
                <Link
                  to="/store-locator"
                  className="bg-green-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-green-800 transition-transform hover:-translate-y-1"
                >
                  Locate a Store
                </Link>
              </div>
            </>
          )}

          {/* ✅ Upload Prescription */}
          {step === "upload" && (
            <div className="text-center space-y-6 animate-fadeSlideUp">
              <h2 className="text-3xl font-bold text-green-700">Upload Your Prescription</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Upload a clear image or PDF. Our pharmacists will handle the rest.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <input type="file" accept="image/*,application/pdf" className="border border-green-300 rounded-lg p-3 w-full max-w-sm" />
                <button onClick={() => setShowConfirm(true)} className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition">
                  Submit
                </button>
                <button onClick={() => setStep("choose")} className="text-green-700 underline hover:text-green-800">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ Refill Prescription */}
          {step === "refill" && (
            <div className="text-center space-y-6 animate-fadeSlideUp">
              <h2 className="text-3xl font-bold text-green-700">Refill Prescription</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Enter your prescription number to quickly request a refill.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="text"
                  placeholder="Enter RX Number"
                  value={prescriptionNumber}
                  onChange={(e) => setPrescriptionNumber(e.target.value)}
                  className="border border-green-300 rounded-lg p-3 w-full max-w-sm"
                />
                <button
                  onClick={() => {
                    if (prescriptionNumber.trim() === "") return alert("Please enter a valid number");
                    setShowConfirm(true);
                  }}
                  className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
                >
                  Refill Now
                </button>
                <button onClick={() => setStep("choose")} className="text-green-700 underline hover:text-green-800">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ Track Order */}
          {step === "status" && (
            <div className="text-center space-y-6 animate-fadeSlideUp">
              <h2 className="text-3xl font-bold text-green-700">Track Your Order</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Enter your order or prescription number to view its current status.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="text"
                  placeholder="Order or RX Number"
                  className="border border-green-300 rounded-lg p-3 w-full max-w-sm"
                />
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
                >
                  Check Status
                </button>
                <button onClick={() => setStep("choose")} className="text-green-700 underline hover:text-green-800">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ Transfer Prescription */}
          {step === "transfer" && (
            <div className="text-center space-y-6 animate-fadeSlideUp">
              <h2 className="text-3xl font-bold text-green-700">Transfer Prescription</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Provide details of your current pharmacy and we’ll handle the transfer.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={transferData.name}
                  onChange={(e) => setTransferData({ ...transferData, name: e.target.value })}
                  className="border border-green-300 rounded-lg p-3 w-full max-w-sm"
                />
                <input
                  type="text"
                  placeholder="Current Pharmacy Name"
                  value={transferData.currentPharmacy}
                  onChange={(e) => setTransferData({ ...transferData, currentPharmacy: e.target.value })}
                  className="border border-green-300 rounded-lg p-3 w-full max-w-sm"
                />
                <input
                  type="text"
                  placeholder="Prescription Number"
                  value={transferData.rxNumber}
                  onChange={(e) => setTransferData({ ...transferData, rxNumber: e.target.value })}
                  className="border border-green-300 rounded-lg p-3 w-full max-w-sm"
                />
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
                >
                  Submit Transfer
                </button>
                <button onClick={() => setStep("choose")} className="text-green-700 underline hover:text-green-800">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ Immunization Booking */}
          {step === "immunization" && (
            <div className="text-center space-y-6 animate-fadeSlideUp">
              <h2 className="text-3xl font-bold text-green-700">Book Your Immunization</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Choose a vaccine and preferred date to schedule your appointment.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <select className="border border-green-300 rounded-lg p-3 w-full max-w-sm">
                  <option>Flu Vaccine</option>
                  <option>COVID-19 Vaccine</option>
                  <option>Shingles Vaccine</option>
                  <option>HPV Vaccine</option>
                </select>
                <input type="date" className="border border-green-300 rounded-lg p-3 w-full max-w-sm" />
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
                >
                  Book Appointment
                </button>
                <button onClick={() => setStep("choose")} className="text-green-700 underline hover:text-green-800">
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ✅ Confirm Modal */}
      {showConfirm && (
        <ConfirmModal message="Your request has been received successfully!" onClose={() => setShowConfirm(false)} />
      )}

      {/* ✅ Animations */}
      <style>{`
        @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
        @keyframes fadeInSlow { from {opacity: 0; transform: translateY(40px);} to {opacity: 1; transform: translateY(0);} }
        @keyframes fadeSlideUp { from {opacity: 0; transform: translateY(60px);} to {opacity: 1; transform: translateY(0);} }
        @keyframes float { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        .animate-fadeIn { animation: fadeIn 2s ease-out forwards; }
        .animate-fadeInSlow { animation: fadeInSlow 2.5s ease-out forwards; }
        .animate-fadeSlideUp { animation: fadeSlideUp 1.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default OrderPage;