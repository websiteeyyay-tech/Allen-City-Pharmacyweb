import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Logo from "../assets/AllanCityPharmacyLogo.png";

const StoreLocatorPage: React.FC = () => {
  useEffect(() => {
    const defaultLocation: [number, number] = [33.1032, -96.6706];
    const map = L.map("map", { zoomControl: false }).setView(defaultLocation, 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add zoom controls (top right)
    L.control.zoom({ position: "topright" }).addTo(map);

    // Branch details
    const branches = [
      {
        name: "Allen City Pharmacy - Main Branch",
        coords: [33.1032, -96.6706],
        address: "123 Main St, Allen, TX 75002",
        hours: "Mon–Sat: 8AM–9PM • Sun: 9AM–6PM",
        phone: "(972) 555-1234",
        email: "main@allencitypharmacy.com",
      },
      {
        name: "Allen City Pharmacy - West Side",
        coords: [33.099, -96.685],
        address: "456 Oak Ave, Allen, TX 75013",
        hours: "Mon–Fri: 8AM–8PM • Sat: 9AM–6PM",
        phone: "(972) 555-5678",
        email: "west@allencitypharmacy.com",
      },
      {
        name: "Allen City Pharmacy - East Town",
        coords: [33.11, -96.65],
        address: "789 Pine Rd, Allen, TX 75002",
        hours: "Daily: 8AM–10PM",
        phone: "(972) 555-9999",
        email: "east@allencitypharmacy.com",
      },
    ];

    // Add markers
    branches.forEach((branch) => {
      const marker = L.marker(branch.coords as [number, number]).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Segoe UI; line-height:1.5;">
          <h3 style="font-size:15px; font-weight:600; color:#0a4d40; margin-bottom:4px;">${branch.name}</h3>
          <p>📍 ${branch.address}</p>
          <p>🕒 ${branch.hours}</p>
          <p>📞 ${branch.phone}</p>
          <a href="https://www.google.com/maps?q=${encodeURIComponent(branch.address)}" 
             target="_blank" style="color:#007bff; text-decoration:underline;">View on Google Maps</a>
        </div>
      `);
    });

    // Locate user
    const locateUser = () => {
      map.locate({ setView: true, maxZoom: 15 });
    };

    map.on("locationfound", (e: any) => {
      const radius = e.accuracy / 2;
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();
      L.circle(e.latlng, { color: "#0a4d40", fillOpacity: 0.2, radius }).addTo(map);
    });

    map.on("locationerror", () => {
      alert("Unable to retrieve your location. Please allow location access.");
    });

    // “My Location” button
    const locationBtn = new L.Control({ position: "topright" });
    locationBtn.onAdd = () => {
      const btn = L.DomUtil.create("button", "find-me-btn");
      btn.innerHTML = "📍 My Location";
      btn.style.cssText =
        "background:#0a4d40;color:white;padding:6px 10px;border:none;border-radius:6px;cursor:pointer;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.2)";
      btn.onclick = locateUser;
      return btn;
    };
    locationBtn.addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-[#c3edea] via-[#e8fdf8] to-[#f8fffc] font-[Segoe_UI] text-gray-800 px-4 pb-10">
      {/* Header */}
<header className="flex items-center gap-3 bg-white/90 p-5 shadow-md w-full max-w-5xl rounded-t-2xl backdrop-blur-md mt-6">
  <img src={Logo} className="h-12" alt="Allen City Pharmacy" />
  <div>
    <h1 className="text-xl md:text-2xl font-bold text-[#0a4d40]">
      Allen City Pharmacy Store Locator
    </h1>
    <p className="text-sm text-gray-600">
      Find the nearest Allen City Pharmacy branch and get directions easily.
    </p>
  </div>
</header>

      {/* Map Section */}
      <section className="w-full max-w-5xl bg-white rounded-b-2xl overflow-hidden border border-gray-300 shadow-md">
        <div id="map" className="w-full h-[550px] rounded-b-2xl z-0"></div>
      </section>

      {/* Branch Details */}
      <section className="w-full max-w-5xl bg-white/95 shadow-lg rounded-2xl mt-10 p-8 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-[#0a4d40] mb-6">
          🏥 Our Branches
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Main Branch",
              address: "123 Main St, Allen, TX 75002",
              hours: "Mon–Sat: 8AM–9PM • Sun: 9AM–6PM",
              phone: "(972) 555-1234",
              email: "main@allencitypharmacy.com",
            },
            {
              name: "West Side Branch",
              address: "456 Oak Ave, Allen, TX 75013",
              hours: "Mon–Fri: 8AM–8PM • Sat: 9AM–6PM",
              phone: "(972) 555-5678",
              email: "west@allencitypharmacy.com",
            },
            {
              name: "East Town Branch",
              address: "789 Pine Rd, Allen, TX 75002",
              hours: "Daily: 8AM–10PM",
              phone: "(972) 555-9999",
              email: "east@allencitypharmacy.com",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-[#0a4d40] mb-1">{b.name}</h3>
              <p className="text-sm">📍 {b.address}</p>
              <p className="text-sm">🕒 {b.hours}</p>
              <p className="text-sm">📞 {b.phone}</p>
              <p className="text-sm">✉️ {b.email}</p>
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(b.address)}`}
                target="_blank"
                className="inline-block mt-2 text-sm text-[#0a4d40] font-semibold underline hover:text-green-700"
              >
                View on Google Maps
              </a>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#0a4d40] mb-2">
            💳 Accepted Payment Methods
          </h3>
          <p className="text-gray-700">
            We accept Visa, Mastercard, GCash, Maya, American Express, and Cash payments.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#0a4d40] mb-2">
            📞 Customer Support
          </h3>
          <p>
            For inquiries or prescription requests, email us at{" "}
            <a
              href="mailto:support@allencitypharmacy.com"
              className="text-[#0a4d40] font-semibold underline hover:text-green-700"
            >
              support@allencitypharmacy.com
            </a>{" "}
            or call (972) 555-1000.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-600 text-sm pb-4">
        © 2025 Allen City Pharmacy. All Rights Reserved.
      </footer>
    </div>
  );
};

export default StoreLocatorPage;
