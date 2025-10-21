import * as React from "react";
import { motion } from "framer-motion";
import { Pill, Syringe, Stethoscope, Package, Camera, DollarSign } from "lucide-react";

// Optional: import images as modules
const pharmacyImage = "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=800&q=80";

const AboutPage: React.FC = () => {
  const services = [
    { title: "Prescription Refills", desc: "Refill your prescriptions online or at any branch.", icon: Pill },
    { title: "Medication Consultation", desc: "Expert advice from certified pharmacists.", icon: Stethoscope },
    { title: "Home Delivery", desc: "Fast and secure delivery to your door.", icon: Package },
    { title: "Wellness Products", desc: "Vitamins, supplements, and health essentials.", icon: Syringe },
    { title: "Vaccination Services", desc: "Safe immunization programs for your protection.", icon: DollarSign },
    { title: "Community Health Programs", desc: "Medical outreach and wellness drives in local areas.", icon: Camera },
  ];

  const leaders = [
    { name: "Dr. Sarah Mendoza", role: "Chief Pharmacist" },
    { name: "Allen Cruz", role: "Founder & CEO" },
    { name: "Maria Lopez", role: "Operations Manager" },
  ];

  const milestones = [
    { year: 1949, text: "Founded as a pharmaceutical import and wholesale company." },
    { year: 2001, text: "First retail pharmacy branch opened." },
    { year: 2007, text: "Expanded into franchising." },
    { year: 2016, text: "Formed strategic partnerships nationwide." },
    { year: 2025, text: "Over 2,000 branches nationwide." },
  ];

  return (
    <div className="font-poppins text-gray-800 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-center text-white overflow-hidden py-28">
        <motion.div
          className="absolute inset-0 flex justify-center items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        >
          {[Pill, Syringe, Stethoscope, Package, Camera, DollarSign].map((Icon, idx) => (
            <Icon key={idx} size={48} className="text-white" />
          ))}
        </motion.div>

        <div className="relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold drop-shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Your Trusted Online Pharmacy
          </motion.h2>
          <motion.p
            className="mt-4 text-lg opacity-90"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Caring for your health, one prescription at a time.
          </motion.p>
        </div>
      </section>

      {/* About / Overview */}
      <section className="max-w-6xl mx-auto py-20 px-6 space-y-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img src={pharmacyImage} alt="Pharmacy shelves" className="rounded-2xl shadow-md" />
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-blue-700">About Us</h3>
            <p className="text-lg leading-relaxed">
              Allen City Pharmacy is committed to bringing quality, affordable healthcare to our communities. We combine modern pharmaceutical practices with compassionate customer care so that every patient feels seen, respected, and well served.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              From prescription refills and consultations to wellness products and vaccinations, we tailor our services to your needs with integrity and innovation.
            </p>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="text-3xl font-semibold mb-8 text-blue-700">Our Journey & Milestones</h3>
          <ul className="space-y-6 list-disc list-inside text-gray-700">
            {milestones.map((m, idx) => (
              <li key={idx}><strong>{m.year}</strong> — {m.text}</li>
            ))}
          </ul>
        </div>

        {/* Mission / Vision / Values */}
        <div className="space-y-8">
          <h3 className="text-3xl font-semibold text-blue-700">Mission, Vision & Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-white rounded-xl shadow" whileHover={{ y: -5, scale: 1.02 }}>
              <h4 className="text-xl font-semibold mb-3">Mission</h4>
              <p className="text-gray-700 leading-relaxed">
                To provide safe, quality, and cost-effective medicines and healthcare products to every Filipino, while fostering growth with franchisees, suppliers, and communities.
              </p>
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow" whileHover={{ y: -5, scale: 1.02 }}>
              <h4 className="text-xl font-semibold mb-3">Vision</h4>
              <p className="text-gray-700 leading-relaxed">
                To be the most trusted partner in accessible, affordable healthcare for all Filipinos — because we care, you matter.
              </p>
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow" whileHover={{ y: -5, scale: 1.02 }}>
              <h4 className="text-xl font-semibold mb-3">Core Values</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Integrity & Transparency</li>
                <li>Compassion & Respect</li>
                <li>Excellence & Innovation</li>
                <li>Affordability & Accessibility</li>
                <li>Shared Growth & Partnerships</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h3 className="text-3xl font-semibold mb-8 text-blue-700">Our Leadership</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {leaders.map((leader, i) => (
              <motion.div key={i} className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition" whileHover={{ y: -5, scale: 1.02 }}>
                <img
                  src={`https://randomuser.me/api/portraits/${i % 2 ? "women" : "men"}/${i + 12}.jpg`}
                  alt={leader.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-xl font-semibold text-blue-600 text-center">{leader.name}</h4>
                <p className="text-gray-500 text-center">{leader.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div id="services">
          <h3 className="text-3xl font-semibold mb-8 text-blue-700 text-center">What We Offer</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div key={i} className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1" whileHover={{ y: -5, scale: 1.02 }}>
                <s.icon className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="text-xl font-semibold mb-3 text-blue-600">{s.title}</h4>
                <p className="text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;