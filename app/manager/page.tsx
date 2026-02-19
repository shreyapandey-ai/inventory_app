"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ManagerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

 async function generateReport() {
  setLoadingReport(true);

  const res = await fetch("/api/ai/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products }),
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory-report.pdf";
  a.click();

  window.URL.revokeObjectURL(url);

  setLoadingReport(false);
}


  if (loading)
    return <div className="p-6 text-slate-500">Loading...</div>;

  const chartData = products.map((p) => ({
    name: p.name,
    quantity: p.quantity,
  }));

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">
          Manager Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Inventory overview and insights
        </p>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold mb-4 text-slate-700">
          Stock Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="quantity" fill="#14b8a6" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-700">
            AI Insights
          </h2>

          <button
            onClick={generateReport}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
          >
            {loadingReport ? "Generating..." : "Generate Insights"}
          </button>
        </div>

        {report ? (
          <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {report}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Generate insights to understand stock trends, risks, and recommendations.
          </p>
        )}
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold mb-4 text-slate-700">
          Products
        </h2>

        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center p-4 border rounded-xl hover:bg-slate-50"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-slate-500">
                  {p.category?.name} • {p.supplier?.name}
                </p>
              </div>

              <span className="font-semibold">
                {p.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
