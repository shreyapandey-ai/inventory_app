"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    price: 0,
    categoryId: "",
    supplierId: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

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

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

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

        <div className="space-y-4">

          <input
            placeholder="Product Name"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="SKU"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, quantity: +e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setForm({ ...form, price: +e.target.value })
            }
          />

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
