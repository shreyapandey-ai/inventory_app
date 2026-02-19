"use client";

import { useEffect, useState } from "react";

export default function Suppliers() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [data, setData] = useState<any[]>([]);

  async function fetchData() {
    const res = await fetch("/api/suppliers");
    setData(await res.json());
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addSupplier(e: any) {
    e.preventDefault();

    await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "" });
    fetchData();
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-800">
          Suppliers
        </h1>
        <p className="text-sm text-slate-500">
          Manage your supplier network
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6 max-w-xl">
        <h2 className="font-semibold mb-4">Add Supplier</h2>

        <form onSubmit={addSupplier} className="flex gap-2 flex-wrap">

          <input
            placeholder="Name"
            value={form.name}
            className="p-3 border rounded-xl flex-1 min-w-[200px]"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={form.email}
            className="p-3 border rounded-xl flex-1 min-w-[200px]"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <button className="bg-teal-600 text-white px-4 rounded-xl hover:bg-teal-700">
            Add
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-sm border">

        {data.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No suppliers yet.
          </p>
        ) : (
          <div className="divide-y">

            {data.map((s) => (
              <div
                key={s.id}
                className="p-4 flex justify-between items-center hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-slate-500">
                    {s.email}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
