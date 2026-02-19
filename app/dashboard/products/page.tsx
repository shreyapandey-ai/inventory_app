"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading)
    return <div className="p-6 text-slate-500">Loading...</div>;

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

      {/* ACTION BAR */}
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
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Supplier</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.quantity}</td>
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
