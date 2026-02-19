"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-500">
        Loading dashboard...
      </div>
    );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter(
    (p) => p.quantity <= (p.lowStockThreshold || 5)
  ).length;

  const chartData = products.map((p) => ({
    name: p.name,
    quantity: p.quantity,
  }));

  const pieData = [
    { name: "In Stock", value: totalProducts - lowStock },
    { name: "Low Stock", value: lowStock },
  ];

  const COLORS = ["#14b8a6", "#ef4444"];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Overview of inventory performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-slate-500">Total Products</p>
          <h2 className="text-3xl font-semibold mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-slate-500">Total Stock</p>
          <h2 className="text-3xl font-semibold mt-2">
            {totalStock}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-slate-500">Low Stock Items</p>
          <h2 className="text-3xl font-semibold mt-2 text-red-500">
            {lowStock}
          </h2>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* BAR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="font-semibold mb-4 text-slate-700">
            Stock by Product
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="font-semibold mb-4 text-slate-700">
            Stock Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOW STOCK ALERT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-lg font-semibold text-red-500 mb-4">
          Low Stock Alerts
        </h2>

        {lowStock === 0 ? (
          <p className="text-slate-500 text-sm">
            All products are sufficiently stocked.
          </p>
        ) : (
          <div className="space-y-2">
            {products
              .filter((p) => p.quantity <= (p.lowStockThreshold || 5))
              .map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between p-3 bg-red-50 rounded-xl"
                >
                  <span>{p.name}</span>
                  <span className="text-red-500 font-medium">
                    {p.quantity}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
