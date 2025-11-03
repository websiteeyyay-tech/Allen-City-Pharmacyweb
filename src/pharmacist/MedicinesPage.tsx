import { useEffect, useState } from "react";
import axios from "axios";

interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filtered, setFiltered] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // For editing stock
  const [editingStock, setEditingStock] = useState<Record<number, number>>({});
  const [savingStock, setSavingStock] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get("/api/medicines"); // Your endpoint
        setMedicines(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError("Failed to fetch medicines.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Unique categories for dropdown
  const categories = ["All", ...Array.from(new Set(medicines.map((m) => m.category)))];

  // Filter medicines based on search + category
  useEffect(() => {
    const term = search.toLowerCase();
    let temp = medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(term) &&
        (category === "All" || med.category === category)
    );
    setFiltered(temp);
    setCurrentPage(1); // Reset page on filter change
  }, [search, category, medicines]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Save updated stock to backend
  const saveStock = async (med: Medicine) => {
    const newStock = editingStock[med.id];
    if (newStock === undefined || newStock < 0) return;

    try {
      setSavingStock((prev) => ({ ...prev, [med.id]: true }));
      await axios.put(`/api/medicines/${med.id}`, { stock: newStock });
      // Update local state
      setMedicines((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, stock: newStock } : m))
      );
      setEditingStock((prev) => {
        const { [med.id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      console.error("Failed to update stock", err);
      alert("Failed to update stock. Try again.");
    } finally {
      setSavingStock((prev) => ({ ...prev, [med.id]: false }));
    }
  };

  if (loading) return <p>Loading medicines...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pharmacist Medicines</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Medicines Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Stock</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="border p-2">{med.id}</td>
                  <td className="border p-2">{med.name}</td>
                  <td className="border p-2">{med.category}</td>
                  <td className="border p-2">₱{med.price.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min={0}
                      value={editingStock[med.id] ?? med.stock}
                      onChange={(e) =>
                        setEditingStock((prev) => ({
                          ...prev,
                          [med.id]: parseInt(e.target.value),
                        }))
                      }
                      className="w-20 p-1 border rounded text-center"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => saveStock(med)}
                      disabled={savingStock[med.id]}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {savingStock[med.id] ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;
