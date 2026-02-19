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

    // ✅ Required fields validation
    if (!body.name || !body.categoryId || !body.supplierId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Strict validation (DO NOT auto-correct)
    if (body.quantity < 0) {
      return NextResponse.json(
        { error: "Quantity cannot be negative" },
        { status: 400 }
      );
    }

    if (body.price < 0) {
      return NextResponse.json(
        { error: "Price cannot be negative" },
        { status: 400 }
      );
    }

    // ✅ Auto-generate SKU (REMOVE FROM FRONTEND)
    const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku,
        description: body.description || "",
        quantity: Number(body.quantity),
        price: Number(body.price),
        categoryId: body.categoryId,
        supplierId: body.supplierId,

        // Initial stock entry
        stockMovements: {
          create: {
            quantity: Number(body.quantity),
            type: "RESTOCK",
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

