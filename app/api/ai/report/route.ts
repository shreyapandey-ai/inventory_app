import { generatePDFBuffer } from "@/lib/generateReport";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = body.products;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Products required" }, { status: 400 });
    }

    const lowStock = products.filter(p => p.quantity < 10).length;
    const overStock = products.filter(p => p.quantity > 100).length;
    const healthyStock = products.length - lowStock - overStock;

    // 🔥 AI call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze inventory:
                  Low stock: ${lowStock}
                  Overstock: ${overStock}
                  Healthy: ${healthyStock}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const report =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No report generated";

    // ✅ Generate PDF in memory
    const pdfBuffer = await generatePDFBuffer(report);

    // ✅ Send as download
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=inventory-report.pdf",
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
