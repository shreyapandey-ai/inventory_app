import { generatePDFBuffer } from "@/lib/generateReport";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, supplier: true },
    });

    if (!products.length) {
      return NextResponse.json({ error: "No products found" }, { status: 400 });
    }

    // Strict Classification
    const lowStock = products.filter(p => p.quantity <= 10);
    const overStock = products.filter(p => p.quantity > 100);
    const healthyStock = products.filter(p => p.quantity > 10 && p.quantity <= 100);

    const totalValue = products.reduce(
      (acc, p) => acc + p.quantity * p.price,
      0
    );

    const detailedData = products
      .map(
        p =>
          `${p.name} | Qty: ${p.quantity} | Price: ${p.price} | Category: ${p.category?.name} | Supplier: ${p.supplier?.name}`
      )
      .join("\n");

    const prompt = `
You are a Senior Inventory Strategy Consultant.

Generate a structured executive-level inventory report.

STRICT RULES:
- No markdown symbols
- No decorative characters
- No bold formatting
- Business formal tone
- Data-driven insights only
- Short structured paragraphs

FORMAT EXACTLY AS:

INVENTORY AI REPORT

SECTION 1: EXECUTIVE SUMMARY
Short strategic overview.

SECTION 2: INVENTORY METRICS
Total Products: ${products.length}
Low Stock Items: ${lowStock.length}
Overstock Items: ${overStock.length}
Healthy Stock Items: ${healthyStock.length}
Total Inventory Value: ${totalValue}

SECTION 3: LOW STOCK PRODUCTS
List product name and quantity.

SECTION 4: OVERSTOCK PRODUCTS
List product name and quantity.

SECTION 5: FINANCIAL RISK ANALYSIS
Capital exposure and operational risk.

SECTION 6: ACTION PLAN
Clear actionable bullet-style short steps without symbols.

SECTION 7: STRATEGIC RECOMMENDATIONS
Long-term improvements.

Inventory Data:
${detailedData}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
    }

    const data = await response.json();

    const report =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Report generation failed.";

    const pdfBuffer = await generatePDFBuffer(report);

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
