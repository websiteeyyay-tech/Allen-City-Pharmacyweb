import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* -------------------------- Reusable Components -------------------------- */

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

const ServiceCard: React.FC<{
  title: string;
  desc: string;
  image: string;
}> = ({ title, desc, image }) => (
  <div className="bg-green-50/80 backdrop-blur p-8 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1">
    <div className="flex justify-center mb-4">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-full shadow"
      />
    </div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 text-green-700">
      {title}
    </h3>
    <p className="text-gray-700 text-sm md:text-base">{desc}</p>
  </div>
);

const TestimonialCard: React.FC<{
  name: string;
  quote: string;
  role: string;
}> = ({ name, quote, role }) => (
  <div className="bg-green-100/60 p-6 rounded-2xl shadow hover:shadow-lg transition">
    <p className="text-gray-700 italic mb-4 leading-relaxed">“{quote}”</p>
    <div className="text-green-700 font-semibold">{name}</div>
    <div className="text-sm text-gray-600">{role}</div>
  </div>
);

const InfoSection: React.FC<{
  title: string;
  text: string;
  items: { icon: string; title: string; desc: string }[];
}> = ({ title, text, items }) => (
  <section className="bg-white/90 backdrop-blur-sm py-16">
    <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
      <SectionTitle title={title} subtitle={text} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.title} className="text-gray-700">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-xl mb-2 text-green-700">
              {item.title}
            </h3>
            <p className="text-sm md:text-base">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------- Main Component ----------------------------- */

const HomePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-700 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col text-gray-800 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 animate-gradient bg-[length:400%_400%] bg-gradient-to-br from-green-700 via-emerald-400 to-lime-200 opacity-90"
          style={{ backgroundAttachment: "fixed" }}
        ></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 text-5xl md:text-6xl animate-float-slow">💊</div>
          <div className="absolute top-1/2 left-1/3 text-6xl md:text-7xl animate-float-medium">💉</div>
          <div className="absolute bottom-10 right-1/4 text-5xl md:text-6xl animate-float-slow">🧴</div>
          <div className="absolute top-1/4 right-1/3 text-7xl md:text-8xl animate-float-fast">🩺</div>
          <div className="absolute bottom-1/3 left-10 text-6xl md:text-7xl animate-float-medium">🩹</div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-20 px-4 md:px-6 gap-8">
        <div className="relative z-10 flex-1 space-y-5 bg-black/40 p-6 md:p-10 rounded-3xl backdrop-blur-sm shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Your Trusted Healthcare Partner
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-lg leading-relaxed">
            Allen City Pharmacy provides a full portfolio of medical and
            pharmaceutical products designed to improve care delivery and reduce
            costs — with a commitment to compassion and quality.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-green-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-lg hover:bg-green-800 hover:scale-105 transform transition"
          >
            Explore Products
          </Link>
        </div>
        <div className="flex-1">
          <img
            src="src/assets/pharmacy.jpg"
            alt="Pharmacy Storefront"
            className="rounded-3xl shadow-2xl w-full border-4 border-white/40"
          />
        </div>
      </section>

      {/* Services */}
      <section className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <SectionTitle title="Our Pharmacy Services" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Prescription Refills"
              desc="Fast, convenient prescription services online or in-store with pharmacist support."
              image="src/assets/prescription.jpg"
            />
            <ServiceCard
              title="Immunizations"
              desc="Stay protected with flu shots, travel vaccines, and COVID-19 immunizations."
              image="src/assets/flu.jpg"
            />
            <ServiceCard
              title="Health Consultations"
              desc="One-on-one guidance from licensed pharmacists for better health management."
              image="src/assets/consultation.webp"
            />
          </div>
        </div>
      </section>

      {/* Quality and Commitment */}
      <InfoSection
        title="Our Commitment to Quality"
        text="An expansive portfolio of high-quality products designed to serve the entire continuum of care."
        items={[
          {
            icon: "⚙️",
            title: "Quality-Engineered",
            desc: "All our products meet or exceed healthcare compliance and performance standards.",
          },
          {
            icon: "🚀",
            title: "Streamlined Supply",
            desc: "Ensuring availability, reliability, and efficiency for pharmacies and healthcare providers.",
          },
          {
            icon: "💚",
            title: "Patient-First Focus",
            desc: "Helping you focus on patient outcomes while we take care of the details.",
          },
        ]}
      />

      {/* Testimonials */}
      <section className="bg-white/90 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <SectionTitle
            title="Trusted by Healthcare Professionals"
            subtitle="Hear from those who rely on our pharmacy services every day."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Dr. Maria Thompson"
              role="Family Physician"
              quote="Allen City Pharmacy’s reliability during critical times has been unmatched. Their product quality and service make a huge difference in patient care."
            />
            <TestimonialCard
              name="David Chen"
              role="Clinic Administrator"
              quote="They provide consistent product availability and fast turnaround — essential for smooth clinic operations."
            />
            <TestimonialCard
              name="Laura Adams"
              role="Local Resident"
              quote="The pharmacists are so caring. They helped me understand my new medication and made the process simple."
            />
          </div>
        </div>
      </section>

{/* Contact Section */}
<section className="bg-gradient-to-br from-green-700 to-emerald-600 text-white py-20 text-center relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-6 relative z-10">
    <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
      Visit or Contact Us
    </h2>

    <p className="text-base md:text-lg max-w-2xl mx-auto text-white/95 leading-relaxed">
      Your health deserves personalized care. Visit our store, reach out, or explore
      online ordering — we’re always here for you.
    </p>

    <ul className="mt-8 space-y-3 text-lg font-medium">
      <li className="flex justify-center items-center gap-2">
        <span role="img" aria-label="location">📍</span> 123 Main Street, Allen City
      </li>
      <li className="flex justify-center items-center gap-2">
        <span role="img" aria-label="clock">⏰</span> Mon–Fri 9 am–7 pm | Sat 9 am–5 pm | Sun Closed
      </li>
      <li className="flex justify-center items-center gap-2">
        <span role="img" aria-label="phone">📞</span> (555) 123-4567
      </li>
    </ul>

    <div className="pt-8">
      <a
        href="tel:5551234567"
        className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-green-100 transition-transform hover:scale-105"
      >
        Call Us Today
      </a>
    </div>
  </div>

  {/* Optional Decorative Element */}
  <div className="absolute bottom-6 right-6 opacity-40">
    <img src="src/assets/contact-icon.png" alt="Contact Icon" className="w-12 h-12" />
  </div>
</section>
    </div>
  );
};

export default HomePage;
