import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HomePageProps {
  onAdd: (product: any) => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  const [products, setProducts] = useState<
    { id: string; name: string; imageUrl: string; price: number }[]
  >([]);

  useEffect(() => {
  setProducts([
    {
      id: "1",
      name: "Vitamin C 500mg",
      imageUrl: "src/assets/vi.png",
      price: 19.99,
    },
    {
      id: "2",
      name: "Pain Reliever Tablets",
      imageUrl: "src/assets/pain.jpg",
      price: 12.49,
    },
    {
      id: "3",
      name: "First Aid Kit",
      imageUrl: "src/assets/first.webp",
      price: 24.99,
    },
    {
      id: "4",
      name: "Digital Thermometer",
      imageUrl: "src/assets/thermometers-1296x728-header.avif",
      price: 14.99,
    },
    {
      id: "5",
      name: "Hand Sanitizer 250ml",
      imageUrl: "src/assets/hand.jpg",
      price: 7.49,
    },
    {
      id: "6",
      name: "Blood Pressure Monitor",
      imageUrl: "src/assets/blood presure.webp",
      price: 59.99,
    },
    {
      id: "7",
      name: "Face Masks (Pack of 50)",
      imageUrl: "src/assets/face.webp",
      price: 9.99,
    },
    {
      id: "8",
      name: "Cough Syrup 100ml",
      imageUrl: "src/pages/rup.webp",
      price: 11.99,
    },
    {
      id: "9",
      name: "Allergy Relief Capsules",
      imageUrl: "src/assets/allergy.webp",
      price: 15.99,
    },
    {
      id: "10",
      name: "Antiseptic Cream",
      imageUrl: "src/assets/bacidin.jpg",
      price: 8.99,
    },
    {
      id: "11",
      name: "Multivitamins for Adults",
      imageUrl: "src/assets/Centrum Silver Advance6001PPS0.jpg",
      price: 21.99,
    },
    {
      id: "12",
      name: "Calcium + Vitamin D Tablets",
      imageUrl: "src/assets/calcium.avif",
      price: 18.49,
    },
    {
      id: "13",
      name: "Glucose Test Strips (50s)",
      imageUrl: "src/assets/glu.jpg",
      price: 34.99,
    },
    {
      id: "14",
      name: "Reusable Cold/Hot Gel Pack",
      imageUrl: "src/assets/hot.jpg",
      price: 10.99,
    },
    {
      id: "15",
      name: "Hydrocortisone Cream 1%",
      imageUrl: "src/assets/hydro.webp",
      price: 6.99,
    },
    {
      id: "16",
      name: "Eye Drops Lubricant 15ml",
      imageUrl: "src/assets/eyedrops.jpg",
      price: 9.49,
    },
    {
      id: "17",
      name: "Inhaler (Salbutamol)",
      imageUrl: "src/assets/inhaler.jpg",
      price: 13.99,
    },
    {
      id: "18",
      name: "Nasal Spray Decongestant",
      imageUrl: "src/assets/nasalspray.jpg",
      price: 11.49,
    },
    {
      id: "19",
      name: "Cotton Balls 100pcs",
      imageUrl: "src/assets/cotton.jpg",
      price: 4.99,
    },
    {
      id: "20",
      name: "Bandage Roll 5m",
      imageUrl: "src/assets/bandage.jpg",
      price: 5.49,
    },
  ]);
}, []);



  return (
    <div className="relative min-h-screen flex flex-col text-gray-800 overflow-hidden">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient */}
        <div
          className="absolute inset-0 animate-gradient bg-[length:400%_400%] bg-gradient-to-br from-green-700 via-emerald-400 to-lime-200 opacity-90"
          style={{ backgroundAttachment: "fixed" }}
        ></div>

        {/* Floating Medical Icons */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 text-6xl animate-float-slow">💊</div>
          <div className="absolute top-1/2 left-1/3 text-7xl animate-float-medium">💉</div>
          <div className="absolute bottom-10 right-1/4 text-6xl animate-float-slow">🧴</div>
          <div className="absolute top-1/4 right-1/3 text-8xl animate-float-fast">🩺</div>
          <div className="absolute bottom-1/3 left-10 text-7xl animate-float-medium">🩹</div>
        </div>

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] mix-blend-overlay"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Hero Section */}
      <section
  className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-20 px-6 gap-8 overflow-hidden"
>
  {/* Slow zooming background */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
  >
    <div
      className="w-full h-full animate-slow-zoom"
      style={{
        backgroundImage: "url('src/assets/bk.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  </div>

  {/* Foreground content */}
  <div className="relative z-10 flex-1 space-y-5 bg-black/40 p-6 rounded-3xl backdrop-blur-sm shadow-2xl">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
      Welcome to Allen City Pharmacy
    </h1>
    <p className="text-white/90 text-lg md:text-xl max-w-lg">
      A trusted pharmacy ensures quality medicines and compassionate care for every customer.
    </p>
    <Link
      to="/shop"
      className="inline-block bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-800 hover:scale-105 transform transition"
    >
      Shop Now
    </Link>
  </div>

  <div className="relative z-10 flex-1">
    <img
      src="src/assets/pharmacy.jpg"
      alt="Pharmacy"
      className="rounded-3xl shadow-2xl w-full border-4 border-white/40"
    />
  </div>
</section>







        {/* Services Section */}
        <section className="bg-white/80 backdrop-blur-sm py-16">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-green-700 mb-10">
      Our Pharmacy Services
    </h2>

    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          title: "Prescription Refills",
          desc: "Quick and easy prescription refills online or in-store.",
          image: "src/assets/prescription.jpg",
        },
        {
          title: "Vaccinations",
          desc: "Flu shots, COVID-19, and more immunizations available.",
          image: "src/assets/flu.jpg",
        },
        {
          title: "Consultations",
          desc: "Get personalized health advice from licensed pharmacists.",
          image: "src/assets/consultation.webp",
        },
      ].map((s) => (
        <div
          key={s.title}
          className="bg-green-50/80 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
        >
          <div className="flex justify-center mb-4">
            <img
              src={s.image}
              alt={s.title}
              className="w-20 h-20 object-cover rounded-full shadow-md"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            {s.title}
          </h3>
          <p className="text-gray-700">{s.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Featured Products */}
        {/* Enhanced Featured Products Section */}
<section className="bg-gray-50/90 backdrop-blur-md py-20 relative">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-extrabold text-green-700 mb-4 tracking-tight">
      Featured Products
    </h2>

    {/* Friendly Description */}
    <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
      Explore our best-selling medicines and wellness essentials — carefully
      chosen by our pharmacists to help you stay healthy and feel your best
      every day.
    </p>

    {/* Filter + Sort Controls */}
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      <button className="px-4 py-2 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition">
        All
      </button>
      <button className="px-4 py-2 rounded-full bg-white shadow text-green-700 border border-green-600 text-sm hover:bg-green-50 transition">
        Under $20
      </button>
      <button className="px-4 py-2 rounded-full bg-white shadow text-green-700 border border-green-600 text-sm hover:bg-green-50 transition">
        Supplements
      </button>
      <button className="px-4 py-2 rounded-full bg-white shadow text-green-700 border border-green-600 text-sm hover:bg-green-50 transition">
        Wellness Kits
      </button>
    </div>

    {/* Product Grid */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
      {products.map((p) => (
        <div
          key={p.id}
          className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden relative"
        >
          {/* Product Image */}
          <div className="relative w-full h-56 overflow-hidden">
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <button
              onClick={() => alert(`Added ${p.name} to cart!`)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-800"
            >
              Add to Cart
            </button>
          </div>

          {/* Product Details */}
          <div className="p-5 text-center space-y-2">
            <h4 className="font-semibold text-lg text-gray-800">{p.name}</h4>
            <p className="text-green-700 font-bold text-xl">${p.price.toFixed(2)}</p>
            <div className="flex justify-center gap-1 text-yellow-400 text-lg">
              ★★★★☆
            </div>
            <p className="text-gray-500 text-sm">
              Boost your daily health and wellness.
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* CTA / Carousel (Optional) */}
    <div className="flex sm:grid overflow-x-auto gap-6 pb-4 snap-x snap-mandatory sm:overflow-visible">
      {products.map((p) => (
        <div className="snap-center min-w-[260px] sm:min-w-0">{/* ...product card... */}</div>
      ))}
    </div>
  </div>
</section>




        {/* About Section */}
        <section className="bg-white/90 backdrop-blur-sm py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-700">
              About Allen City Pharmacy
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              For over 20 years, Allen City Pharmacy has proudly served our
              community with trusted healthcare products and personal service.
              From prescriptions to wellness guidance, we’re here to care for
              you and your family.
            </p>
            <ul className="text-gray-800 mt-6 space-y-1 font-medium">
              <li>📍 123 Main Street, Allen City</li>
              <li>⏰ Mon–Fri 9am–7pm | Sat 9am–5pm | Sun Closed</li>
              <li>📞 (555) 123-4567</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Keyframes for animation */}
      
    </div>
  );
};

export default HomePage;