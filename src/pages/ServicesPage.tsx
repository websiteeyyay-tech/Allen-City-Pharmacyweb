import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "Prescription Refills",
      desc: "Easily manage and refill your prescriptions online or in-store. Set up automatic refills and get notified when your medication is ready.",
      icon: "💊",
    },
    {
      title: "Vaccinations & Immunizations",
      desc: "We offer vaccines for flu, COVID-19, pneumonia, HPV, and more — no appointment needed. Walk in anytime to protect yourself and your family.",
      icon: "💉",
    },
    {
      title: "Medication Therapy Management",
      desc: "Get personalized consultations with our pharmacists to optimize your prescriptions and ensure safe, effective treatment outcomes.",
      icon: "📋",
    },
    {
      title: "Health Screenings",
      desc: "Affordable screenings for blood pressure, cholesterol, glucose, and BMI — with instant results and health recommendations.",
      icon: "🩺",
    },
    {
      title: "Home Delivery",
      desc: "Stay home and stay healthy — we offer free local delivery for prescriptions and essential health products.",
      icon: "🚚",
    },
    {
      title: "Consult a Pharmacist",
      desc: "Speak directly with our licensed pharmacists about dosage, side effects, or any medication concerns — in person or virtually.",
      icon: "👩‍⚕️",
    },
  ];

  const testimonials = [
    {
      name: "Maria Lopez",
      feedback:
        "The staff here are always kind and professional. I love how quick and easy the refill process is!",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "James Anderson",
      feedback:
        "Their vaccination service was super convenient — walked in during lunch and was done in 10 minutes!",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Elaine Cruz",
      feedback:
        "Allen City Pharmacy really cares about their customers. I got a free consultation that helped me understand my new meds better.",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  const trustBadges = [
    { icon: "🏥", text: "DOH Licensed Pharmacy" },
    { icon: "👩‍⚕️", text: "Certified Pharmacists" },
    { icon: "🌿", text: "Trusted Health Partner" },
    { icon: "⏱️", text: "Fast & Reliable Service" },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-tr from-emerald-400 via-green-400 to-lime-300 text-gray-800 font-[Segoe_UI]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.brunet.ca/globalassets/sante/conseils-sante/role-du-pharmacien/role-du-pharmacien-big.jpg')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply"></div>

        <div className="relative w-4/5 mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
              Compassion at every step.<br />Care that truly puts you first.
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-xl">
              At Allen City Pharmacy, we believe great healthcare goes beyond medicine.
              With expert care and personal attention, we're here to help you live well every day.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition shadow-md"
            >
              Talk to a Pharmacist
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="src/assets/services.png"
              alt="Pharmacy services illustration"
              className="rounded-2xl shadow-2xl border-4 border-white/20 w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 bg-gradient-to-b from-white/60 to-green-50 backdrop-blur-sm">
        <div className="w-4/5 mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-green-700 mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Comprehensive Pharmacy Services
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md hover:shadow-2xl border border-green-100 transition"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-green-700">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-green-100 py-16">
        <div className="w-4/5 mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.text}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-green-100"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <p className="font-semibold text-green-800">{badge.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="w-4/5 mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-green-700 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our Customers Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-green-50 p-8 rounded-3xl shadow-md hover:shadow-xl transition border border-green-100"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-gray-700 italic mb-3 leading-relaxed">
                  “{t.feedback}”
                </p>
                <p className="font-bold text-green-800">{t.name}</p>
                <p className="text-yellow-500 mt-1">{t.rating}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 py-20 text-center text-white">
        <div className="w-4/5 mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-5 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Trusted Pharmacy in Allen City
          </motion.h2>
          <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            From prescription refills to vaccinations, we deliver seamless, patient-centered
            care that makes managing your health simple and stress-free.
          </p>
          <Link
            to="/shop"
            className="bg-white text-green-800 px-10 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all shadow-lg hover:scale-105"
          >
            Browse Health Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
