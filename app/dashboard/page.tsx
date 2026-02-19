"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "recharts"

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockProducts = products.filter(
    (p) => p.quantity <= (p.lowStockThreshold || 5)
  )
  const lowStock = lowStockProducts.length

  const chartData = products.map((p) => ({
    name: p.name,
    quantity: p.quantity,
  }))

  const pieData = [
    { name: "Healthy", value: totalProducts - lowStock },
    { name: "Low Stock", value: lowStock },
  ]

  const COLORS = ["#14b8a6", "#ef4444"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 space-y-10"
    >

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          Inventory Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time inventory intelligence overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Stock Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalStock}</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-red-200">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <p className="text-4xl font-bold text-red-500">
              {lowStock}
            </p>
            {lowStock > 0 && (
              <Badge variant="destructive">Attention</Badge>
            )}
          </CardContent>
        </Card>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Stock by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar
                  dataKey="quantity"
                  fill="#14b8a6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={4}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* LOW STOCK ALERTS */}
      <Card className="hover:shadow-2xl transition-all duration-300 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStock === 0 ? (
            <p className="text-muted-foreground">
              All products are sufficiently stocked.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-4 rounded-lg border bg-red-50 hover:bg-red-100 transition"
                >
                  <span className="font-medium">{p.name}</span>
                  <Badge variant="destructive">
                    {p.quantity} left
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </motion.div>
  )
}
