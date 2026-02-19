"use client";

import { useEffect, useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [data, setData] = useState<any[]>([]);

  async function fetchData() {
    const res = await fetch("/api/categories");
    setData(await res.json());
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addCategory(e: any) {
    e.preventDefault();

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchData();
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-800">
          Categories
        </h1>
        <p className="text-sm text-slate-500">
          Organize your products into groups
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6 max-w-md">
        <h2 className="font-semibold mb-4">Add Category</h2>

        <form onSubmit={addCategory} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 border rounded-xl"
            placeholder="Category name"
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
            No categories yet.
          </p>
        ) : (
          <div className="divide-y">

            {data.map((c) => (
              <div
                key={c.id}
                className="p-4 flex justify-between items-center hover:bg-slate-50"
              >
                <span className="font-medium">{c.name}</span>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
