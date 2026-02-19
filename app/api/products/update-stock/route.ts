import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.productId || !body.type || !body.quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let incrementValue = 0;

    // If stock is decreasing
    if (body.type === "SALE" || body.type === "DAMAGE") {
      if (product.quantity - body.quantity < 0) {
        return NextResponse.json(
          { error: "Stock cannot go below zero" },
          { status: 400 }
        );
      }
      incrementValue = -body.quantity;
    } else {
      // RESTOCK or RETURN
      incrementValue = body.quantity;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: body.productId },
      data: {
        quantity: {
          increment: incrementValue,
        },
        stockMovements: {
          create: {
            type: body.type,
            quantity: body.quantity,
            note: body.note || null,
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Stock update failed" },
      { status: 500 }
    );
  }
}
