import { Card } from "@/components/ui/card"

export function Stats() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 hover:shadow-md transition">
        <p className="text-sm text-muted-foreground">Total Products</p>
        <h2 className="text-3xl font-bold mt-2">128</h2>
      </Card>

      <Card className="p-6 hover:shadow-md transition">
        <p className="text-sm text-muted-foreground">Low Stock</p>
        <h2 className="text-3xl font-bold mt-2 text-red-600">8</h2>
      </Card>

      <Card className="p-6 hover:shadow-md transition">
        <p className="text-sm text-muted-foreground">Inventory Value</p>
        <h2 className="text-3xl font-bold mt-2">₹11,38,400</h2>
      </Card>
    </div>
  )
}
