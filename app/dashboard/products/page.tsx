"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  // ✅ Filters
  const [stockFilter, setStockFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  // ===============================
  // FETCH DATA
  // ===============================

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilters() {
    const catRes = await fetch("/api/categories");
    const supRes = await fetch("/api/suppliers");

    setCategories(await catRes.json());
    setSuppliers(await supRes.json());
  }

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, []);

  // ===============================
  // DELETE
  // ===============================

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // ===============================
  // BULK CSV
  // ===============================

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/products/bulk", {
      method: "POST",
      body: formData,
    });

    location.reload();
  }

  if (loading)
    return <div className="p-6 text-slate-500">Loading...</div>;

  // ===============================
  // APPLY FILTERS
  // ===============================

  const filteredProducts = products.filter((p) => {
    if (stockFilter === "LOW" && p.quantity > 10) return false;
    if (categoryFilter && p.category?.id !== categoryFilter) return false;
    if (supplierFilter && p.supplier?.id !== supplierFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Products
          </h1>
          <p className="text-sm text-slate-500">
            Manage your inventory items
          </p>
        </div>

        <Link
          href="/dashboard/products/create"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex flex-wrap gap-4">

        {/* Low Stock */}
        <select
          onChange={(e) => setStockFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="ALL">All Stock</option>
          <option value="LOW">Low Stock (≤10)</option>
        </select>

        {/* Category */}
        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Supplier */}
        <select
          onChange={(e) => setSupplierFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* CSV Upload */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex items-center gap-3">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <button
          onClick={handleUpload}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
        >
          Upload CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left p-4">SKU</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Supplier</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4 text-gray-500">{p.sku}</td>
                <td className="p-4 font-medium">{p.name}</td>

                <td
                  className={`p-4 ${
                    p.quantity <= 10
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                >
                  {p.quantity}
                </td>

                <td className="p-4">{p.category?.name}</td>
                <td className="p-4">{p.supplier?.name}</td>

                <td className="p-4 text-right space-x-2">

                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                  {/* ✅ UPDATE BUTTON BACK */}
                  <button
                    onClick={async () => {
                      const qty = prompt("Enter quantity:");
                      const type = prompt(
                        "Type: SALE / RESTOCK / DAMAGE / RETURN"
                      );

                      if (!qty || !type) return;

                      await fetch("/api/products/update-stock", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          productId: p.id,
                          quantity: Number(qty),
                          type: type.toUpperCase(),
                        }),
                      });

                      location.reload();
                    }}
                    className="px-3 py-1 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Update
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
