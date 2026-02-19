"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
  if (!params?.id) return;

  async function loadProduct() {
    try {
      const res = await fetch(`/api/products/${params.id}`);

      if (!res.ok) throw new Error("Request failed");

      const text = await res.text();

      if (!text) throw new Error("Empty response");

      const data = JSON.parse(text);

      setForm(data);
    } catch (err) {
      console.error("Error loading product:", err);
    }
  }

  loadProduct();
}, [params?.id]);


  if (!form)
    return <div className="p-6 text-slate-500">Loading...</div>;

  async function handleUpdate(e: any) {
    e.preventDefault();

    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/products");
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      <div className="max-w-2xl mx-auto space-y-6">

        {/* FORM CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h1 className="text-xl font-semibold mb-4">
            Edit Product
          </h1>

          <form onSubmit={handleUpdate} className="space-y-4">

            <div>
              <label className="text-sm text-slate-500">
                Product Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full p-3 border rounded-xl mt-1"
              />
            </div>

            <button className="w-full bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700">
              Update Product
            </button>

          </form>
        </div>

        {/* STOCK HISTORY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h2 className="text-lg font-semibold mb-4">
            Stock History
          </h2>

          {form.stockMovements?.length === 0 ? (
            <p className="text-sm text-slate-500">
              No stock activity yet.
            </p>
          ) : (
            <div className="space-y-3">

              {form.stockMovements?.map((s: any) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-4 rounded-xl border"
                >
                  <div>
                    <p className="font-medium">{s.type}</p>
                    <p className="text-xs text-slate-500">
                      {s.note}
                    </p>
                  </div>

                  <span
                    className={`font-semibold ${
                      s.type === "SALE" || s.type === "DAMAGE"
                        ? "text-red-500"
                        : "text-teal-600"
                    }`}
                  >
                    {s.type === "SALE" || s.type === "DAMAGE"
                      ? "-"
                      : "+"}
                    {s.quantity}
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
