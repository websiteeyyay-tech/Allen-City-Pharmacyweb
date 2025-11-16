// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Premium HomePage — Allen City Pharmacy
 */

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="text-center mb-8">
    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a4d40] mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const TrustItem: React.FC<{ icon: string; title: string; subtitle?: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex flex-col items-center text-center px-4 py-3 min-w-[180px]">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-semibold text-[#065F46]">{title}</div>
    {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
  </div>
);

const HomePage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);

  const featured = [
    { name: "Vitamin C 1000mg", price: "₱499", img: "/src/assets/vitamin-c.jpg" },
    { name: "Face Masks (50 pcs)", price: "₱299", img: "/src/assets/mask.jpg" },
    { name: "Alcohol 70%", price: "₱199", img: "/src/assets/alcohol.jpg" },
    { name: "Paracetamol 500mg", price: "₱149", img: "/src/assets/paracetamol.jpg" },
    { name: "Skincare Serum", price: "₱899", img: "/src/assets/serum.jpg" },
    { name: "Multivitamins + Iron", price: "₱699", img: "/src/assets/multivitamins.jpg" },
    { name: "Hand Sanitizer 500ml", price: "₱159", img: "/src/assets/sanitizer.jpg" },
    { name: "Collagen Drink", price: "₱1,099", img: "/src/assets/collagen.jpg" },
  ];

  const categories = [
    { title: "Medicine", icon: "💊" },
    { title: "Vitamins", icon: "💚" },
    { title: "Skincare", icon: "🧴" },
    { title: "Personal Care", icon: "🧼" },
    { title: "Medical Devices", icon: "🩺" },
    { title: "Baby & Mom", icon: "👶" },
  ];

  const services = [
    {
      title: "Prescription Refills",
      desc: "Fast & accurate refills with pharmacist review.",
      img: "/src/assets/prescription.jpg",
    },
    {
      title: "Immunizations",
      desc: "Flu, travel, & routine vaccines administered by pros.",
      img: "/src/assets/flu.jpg",
    },
    {
      title: "Health Consultations",
      desc: "Private one-on-one pharmacist guidance.",
      img: "/src/assets/consultation.webp",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Maria Thompson",
      role: "Family Physician",
      quote:
        "Reliable product quality and fast service — Allen City Pharmacy is essential to our clinic's operations.",
      avatar: "/src/assets/avatar1.png",
    },
    {
      name: "David Chen",
      role: "Clinic Administrator",
      quote:
        "Their delivery and stock management saved our workflow during peak seasons.",
      avatar: "/src/assets/avatar2.png",
    },
    {
      name: "Laura Adams",
      role: "Local Resident",
      quote: "Friendly pharmacists and clear advice. My go-to for prescriptions.",
      avatar: "/src/assets/avatar3.png",
    },
  ];

  const updateCarouselState = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    updateCarouselState();
    const el = carouselRef.current;
    if (!el) return;
    const onResize = () => updateCarouselState();
    window.addEventListener("resize", onResize);
    el.addEventListener("scroll", updateCarouselState);
    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", updateCarouselState);
    };
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    // create a non-null local reference for use inside the animation callback
    const container = el as HTMLDivElement;
    let rafId: number | null = null;
    let last = performance.now();
    const speed = 0.03;
    let running = true;

    function step(now: number) {
      if (!running) return;
      const delta = now - last;
      last = now;
      if (!isHoveringCarousel) {
        container.scrollLeft += delta * speed;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) {
          container.scrollTo({ left: 0 });
        }
      }
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
    };
  }, [isHoveringCarousel]);

  useEffect(() => {
    testimonialTimerRef.current = window.setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (testimonialTimerRef.current) {
        clearInterval(testimonialTimerRef.current);
      }
    };
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#065F46] border-opacity-75" />
      </div>
    );
  }

  return (
    <div className="text-gray-800 antialiased">
      {/* HERO */}
      <header className="relative bg-gradient-to-br from-[#066a4f] via-[#1fa584] to-[#b8f3d8] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -left-40 -top-20 w-[560px] h-[560px] rounded-full blur-3xl bg-white/6" />
          <div className="absolute -right-40 -bottom-20 w-[480px] h-[480px] rounded-full blur-3xl bg-black/6" />
        </div>

        <div className="w-4/5 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">
                Allen City Pharmacy — <span className="text-lime-200">Your health, simplified.</span>
              </h1>
              <p className="mt-4 text-gray-100 max-w-2xl">
                Trusted medicines, fast delivery, and pharmacist support. We blend clinical reliability with modern convenience.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-[#065F46] px-5 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
                >
                  Shop Now
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border border-white/40 text-white px-5 py-3 rounded-full hover:bg-white/10 transition"
                >
                  Our Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="flex-1"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/src/assets/pharmacy.jpg"
                  alt="Allen City Pharmacy"
                  className="w-full h-64 md:h-72 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* FEATURED CAROUSEL */}
      <section className="py-12 bg-gradient-to-b from-white to-[#f0fff7]">
        <div className="w-4/5 mx-auto relative">
          <SectionTitle
            title="Featured Health Essentials"
            subtitle="Top picks this week — handpicked for wellness and everyday care."
          />

          {canScrollLeft && (
            <button
              onClick={() => {
                const el = carouselRef.current;
                if (!el) return;
                el.scrollBy({ left: -el.clientWidth * 0.7, behavior: "smooth" });
              }}
              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#065F46] text-white rounded-full shadow-md z-20"
            >
              ‹
            </button>
          )}

          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHoveringCarousel(true)}
            onMouseLeave={() => setIsHoveringCarousel(false)}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {featured.map((p, i) => (
  <Link
    key={p.name + i}
    to="/shop"
    className="snap-center flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:scale-105 transition-transform"
  >
    <div className="relative">
      <img src={p.img} alt={p.name} className="w-full h-44 object-cover" />
      <div className="absolute left-3 top-3 px-2 py-1 bg-[#065F46] text-white text-xs rounded">
        Bestseller
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-[#065F46]">{p.name}</h3>
        <div className="text-lg font-bold">{p.price}</div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Trusted, effective, and easy to use.</p>

     <div className="mt-4 flex gap-2">
  <Link
    to="/shop"
    className="flex-1 bg-[#065F46] text-white py-2 rounded-full font-semibold text-center hover:opacity-95"
  >
    VIEW
  </Link>
  <button className="px-3 py-2 rounded-full border border-gray-200 text-gray-600">
    🔍
  </button>
</div>
    </div>
  </Link>
))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => {
                const el = carouselRef.current;
                if (!el) return;
                el.scrollBy({ left: el.clientWidth * 0.7, behavior: "smooth" });
              }}
              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#065F46] text-white rounded-full shadow-md z-20"
            >
              ›
            </button>
          )}
        </div>
      </section>
      

      {/* CATEGORIES */}
      <section className="py-12">
        <div className="w-4/5 mx-auto">
          <SectionTitle title="Shop by Category" subtitle="Find products faster — browse popular categories." />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((c) => (
              <motion.div
                key={c.title}
                whileHover={{ y: -6 }}
                className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-lg border"
              >
                <div className="text-3xl">{c.icon}</div>
                <div className="font-semibold text-[#065F46]">{c.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





      {/* SERVICES */}
      <section className="py-12 bg-gradient-to-b from-white to-[#f7fffb]">
        <div className="w-4/5 mx-auto">
          <SectionTitle title="Our Services" subtitle="Professional services to support your health journey." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="rounded-lg overflow-hidden mb-4 h-40">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-semibold text-[#065F46]">{s.title}</h4>
                <p className="text-gray-600 mt-2">{s.desc}</p>
                <div className="mt-4">
                  <Link to="/services" className="text-[#065F46] font-semibold underline">
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO TICKER ABOVE SERVICES */}
<div className="relative overflow-hidden bg-white py-6">
  <div
    className="flex gap-12 animate-scroll whitespace-nowrap ticker-content"
    style={{ animation: "scroll 40s linear infinite" }}
  >
    {[
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db72cb1cf8c36796ad03_image%2066.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db72c881192c3b17ca85_image%2068.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db7273c7344f24209ec0_image.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db71db65cb1bcd059824_image%2060.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db7118cce8820930b395_image%2050.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db71385c1ff24c47937d_image%2051.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db710e2fa6be0f877507_image%2063.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db71a71ccd73f9937e85_image%2054.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db713f05e0b234963894_image%2059.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db7118cce8820930b3af_image%2061.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db71839791b680e27c8c_image%2055.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db715b83130cbc980029_image%2058.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db726a88783adacf7022_image%2067.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db726495a2c59c3670ea_image%2064.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db72fdd6b72af5c7d09e_image%2065.avif",
      "https://cdn.prod.website-files.com/67ae616c0c5296041bcd118f/67b4db7231a1d9bc572521f5_image%2062.avif",
    ].map((src, i) => (
      <img
        key={i}
        src={src}
        loading="lazy"
        alt={`Partner Logo ${i + 1}`}
        className="ticker-logo h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
      />
    ))}
  </div>

  {/* Smooth fade edges */}
  <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
  <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
</div>

      {/* TESTIMONIALS */}
      <section className="py-12">
        <div className="w-4/5 mx-auto text-center">
          <SectionTitle title="What professionals say" subtitle="Trusted by doctors, clinics and customers." />

          <div className="relative mt-6">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[testimonialIndex].avatar}
                  alt={testimonials[testimonialIndex].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-semibold text-[#065F46]">
                    {testimonials[testimonialIndex].name}
                  </div>
                  <div className="text-sm text-gray-500">{testimonials[testimonialIndex].role}</div>
                </div>
              </div>

              <p className="mt-4 text-gray-700 italic">
                “{testimonials[testimonialIndex].quote}”
              </p>

              <div className="mt-4 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === testimonialIndex ? "bg-[#065F46]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-12 bg-gradient-to-r from-[#eafef6] to-white">
        <div className="w-4/5 mx-auto">
          <div className="rounded-2xl bg-white/95 p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 border">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#065F46]">Get exclusive offers & health tips</h3>
              <p className="text-gray-600 mt-2">Subscribe to our newsletter for promotions and wellness advice.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-[360px] px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#b8f3d8]"
              />
              <button className="bg-[#065F46] text-white px-6 py-3 rounded-full font-semibold hover:opacity-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
