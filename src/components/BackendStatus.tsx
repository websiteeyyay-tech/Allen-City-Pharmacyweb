import React, { useEffect, useState } from "react";

const API_URL = (() => {
  const host = window.location.hostname;

  if (host.includes(".app.github.dev")) {
    // For GitHub Codespaces (auto switch ports)
    return `https://${host.replace("5173", "5272")}/api`;
  }

  // Local fallback (match Swagger)
  return "http://127.0.0.1:5272/api";
})();

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<
    "checking" | "connected" | "failed"
  >("checking");

  useEffect(() => {
    const checkBackend = async () => {
      const testUrl = `${API_URL}/Products`; // ✅ Match Swagger route exactly
      console.log("🔍 Checking backend at:", testUrl);

      try {
        const response = await fetch(testUrl);

        if (response.ok) {
          console.log("✅ Backend reachable!");
          setStatus("connected");
        } else {
          console.warn("⚠️ Backend responded, but not OK:", response.status);
          setStatus("failed");
        }
      } catch (err) {
        console.error("❌ Error connecting to backend:", err);
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
