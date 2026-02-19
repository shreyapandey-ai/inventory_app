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

export default function Analytics() {
  const [products, setProducts] = useState<any[]>([]);
  const [report, setReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      });
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


  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">
          Analytics
        </h1>
        <p className="text-sm text-slate-500">
          Insights and AI-powered analysis of inventory
        </p>
      </div>

      {/* CHART CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold mb-4 text-slate-700">
          Stock Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="quantity" fill="#14b8a6" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI REPORT CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-700">
            AI Insights
          </h2>

          <button
            onClick={generateReport}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
          >
            {loadingReport ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {report ? (
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {report}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Generate a report to see insights about stock trends, risks, and opportunities.
          </p>
        )}
      </div>
    </div>
  );
}
