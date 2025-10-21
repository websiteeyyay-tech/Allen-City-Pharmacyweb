import React, { useEffect, useState } from "react";

// ✅ Auto-detect backend URL (works for both GitHub Codespaces and local dev)
const API_URL = (() => {
  const host = window.location.hostname;

  if (host.includes(".app.github.dev")) {
    // Automatically switch frontend port (5173) → backend port (5272)
    return `https://${host.replace("5173", "5272")}`;
  }

  // Local dev fallback
  return "http://localhost:5272";
})();

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "failed">("checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log("Checking backend at:", `${API_URL}/api/products`);
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          setStatus("connected");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Error connecting to backend:", err);
        setStatus("failed");
      }
    };

    checkBackend();
  }, []);

  return (
    <div
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        margin: "20px auto",
        width: "fit-content",
        background:
          status === "connected"
            ? "#d1fae5"
            : status === "failed"
            ? "#fee2e2"
            : "#fef3c7",
        color:
          status === "connected"
            ? "#065f46"
            : status === "failed"
            ? "#991b1b"
            : "#92400e",
        fontWeight: "bold",
      }}
    >
      {status === "checking" && "🔍 Checking backend connection..."}
      {status === "connected" && "✅ Connected to backend!"}
      {status === "failed" && "❌ Backend unreachable!"}
    </div>
  );
};

export default BackendStatus;