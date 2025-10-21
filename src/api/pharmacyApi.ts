// Detect API base URL automatically
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (
    window.location.hostname.includes("github.dev") ||
    window.location.hostname.includes("app.github.dev")
      ? "https://urban-space-goggles-g4v7qv6g79x7fw49p-5272.app.github.dev" // 👈 your Codespace backend URL
      : "https://localhost:7114" // 👈 local backend URL (if running locally)
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