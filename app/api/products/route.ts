import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ validation (VERY IMPORTANT)
    if (
      !body.name ||
      !body.sku ||
      !body.categoryId ||
      !body.supplierId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku || `SKU-${Date.now()}`,
        description: body.description || "",
        quantity: Math.max(0, body.quantity),
        price:  Math.max(0, body.price),
        categoryId: body.categoryId,
        supplierId: body.supplierId,

        // ✅ STOCK MOVEMENT ENTRY
        stockMovements: {
          create: {
            change: body.quantity || 0,
            note: "Initial stock",
          },
        },
      },
      include: {
        stockMovements: true,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
