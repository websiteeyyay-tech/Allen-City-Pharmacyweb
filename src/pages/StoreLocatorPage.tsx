import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const StoreLocatorPage: React.FC = () => {
  useEffect(() => {
    const defaultLocation: [number, number] = [33.1032, -96.6706];
    const map = L.map("map", { zoomControl: false }).setView(defaultLocation, 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add zoom controls (top right)
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map);

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

    // Add markers for each branch
    branches.forEach((branch) => {
      const marker = L.marker(branch.coords as [number, number]).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Segoe UI; line-height:1.5;">
          <h3 style="font-size:15px; font-weight:600; color:#0a4d40; margin-bottom:4px;">${branch.name}</h3>
          <p style="margin:2px 0;">📍 ${branch.address}</p>
          <p style="margin:2px 0;">🕒 ${branch.hours}</p>
          <p style="margin:2px 0;">📞 ${branch.phone}</p>
          <a href="https://www.google.com/maps?q=${encodeURIComponent(
            branch.address
          )}" target="_blank" style="color:#007bff; text-decoration:underline;">View on Google Maps</a>
        </div>
      `);
    });

    // “Find My Location” button
    const locateUser = () => {
      map.locate({ setView: true, maxZoom: 15 });
    };

    map.on("locationfound", (e: any) => {
      const radius = e.accuracy / 2;
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();
      L.circle(e.latlng, {
        color: "#0a4d40",
        fillOpacity: 0.2,
        radius: radius
      }).addTo(map);
    });

    map.on("locationerror", () => {
      alert("Unable to retrieve your location. Please allow location access.");
    });

    // Button element for user location
    const locationBtn = new L.Control({ position: "topright" });
    locationBtn.onAdd = () => {
      const btn = L.DomUtil.create("button", "find-me-btn");
      btn.innerHTML = "📍 My Location";
      btn.style.cssText =
        "background:#0a4d40;color:white;padding:6px 10px;border:none;border-radius:6px;cursor:pointer;font-size:13px;";
      btn.onclick = locateUser;
      return btn;
    };
    locationBtn.addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-[#c3edea] via-[#a6e3e9] via-[#dffaf5] to-[#d6f2f0] bg-[length:400%_400%] animate-[calmGradient_20s_ease_infinite] font-[Segoe_UI] text-gray-800 p-6">
      {/* Header */}
      <header className="flex items-center gap-3 bg-white/90 p-5 shadow-md w-full max-w-5xl rounded-t-2xl backdrop-blur-md mt-4">
        <img
          src="AllenCityPharmacylogo.png"
    
        className="h-12"
        />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0a4d40]">
            Allen City Pharmacy Store Locator
          </h1>
          <p className="text-sm text-gray-600">
            Find the nearest Allen City Pharmacy branch and get directions easily.
          </p>
        </div>
      </header>

      {/* Map */}
      <div
        id="map"
        className="w-full max-w-5xl h-[600px] rounded-b-2xl border border-gray-300 shadow-lg"
      ></div>

      {/* Details Section */}
      <section className="w-full max-w-5xl bg-white/90 shadow-md rounded-2xl mt-8 p-8 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-[#0a4d40] mb-5">
          🏥 Our Branches
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Branch cards */}
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
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg text-[#0a4d40]">
                {b.name}
              </h3>
              <p className="text-sm">📍 {b.address}</p>
              <p className="text-sm">🕒 {b.hours}</p>
              <p className="text-sm">📞 {b.phone}</p>
              <p className="text-sm">✉️ {b.email}</p>
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(
                  b.address
                )}`}
                target="_blank"
                className="inline-block mt-2 text-sm text-[#0a4d40] font-semibold underline"
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
              className="text-[#0a4d40] font-semibold underline"
            >
              support@allencitypharmacy.com
            </a>{" "}
            or call (972) 555-1000.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600 text-sm pb-6">
        © 2025 Allen City Pharmacy. All Rights Reserved.
      </footer>

      {/* Animation */}
      <style>
        {`
          @keyframes calmGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default StoreLocatorPage;