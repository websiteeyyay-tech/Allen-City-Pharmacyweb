// src/api/pharmacyApi.ts

// ✅ Automatically detect and use the correct backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (
    window.location.hostname.includes("github.dev") ||
    window.location.hostname.includes("app.github.dev")
      // 👉 Your current Codespace backend URL
      ? "https://obscure-cod-x5g4pgqqrj4p3v6vw-5272.app.github.dev"
      // 👉 Local fallback for running .NET API locally
      : "https://localhost:5272"
  );

console.log("🌐 Connected to backend:", API_BASE_URL);

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  return response.json();
}

export async function createOrder(orderData: any) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error(`Error creating order: ${response.statusText}`);
  }
  return response.json();
}
