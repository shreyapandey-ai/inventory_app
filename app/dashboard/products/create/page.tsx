"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    price: 0,
    categoryId: "",
    supplierId: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const catRes = await fetch("/api/categories");
      const supRes = await fetch("/api/suppliers");

      setCategories(await catRes.json());
      setSuppliers(await supRes.json());
    }

    fetchData();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/dashboard/products");
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-lg"
      >
        <h1 className="text-2xl font-semibold mb-6">
          Add Product
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        <div className="space-y-4">

          {/* Product Name */}
          <input
            placeholder="Product Name"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Quantity */}
          <input
            type="number"
            min="0"
            placeholder="Quantity"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />

          {/* Price */}
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          {/* Category */}
          <select
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Supplier */}
          <select
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, supplierId: e.target.value })
            }
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button className="w-full bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700">
            Create Product
          </button>

        </div>
      </form>
    </div>
  );
}
