import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { productId, quantity, type, note } = body;

    // ✅ VALIDATION
    if (!productId || !quantity || !type) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be > 0" },
        { status: 400 }
      );
    }

    // 🔥 Normalize enum (important)
    const movementType = type.toUpperCase();

    const validTypes = ["SALE", "RESTOCK", "DAMAGE", "RETURN"];

    if (!validTypes.includes(movementType)) {
      return NextResponse.json(
        { error: "Invalid movement type" },
        { status: 400 }
      );
    }

    // 🔥 TRANSACTION (VERY IMPORTANT)
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      let newQuantity = product.quantity;

      // 🔥 BUSINESS LOGIC
      if (movementType === "SALE" || movementType === "DAMAGE") {
        newQuantity -= quantity;
      } else {
        newQuantity += quantity;
      }

      if (newQuantity < 0) {
        throw new Error("Insufficient stock");
      }

      // ✅ Update product
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { quantity: newQuantity },
      });

      // ✅ Create movement log
      await tx.stockMovement.create({
        data: {
          productId,
          type: movementType,
          quantity,
          note,
        },
      });

      return updatedProduct;
    });

    return NextResponse.json(result);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  }
}
