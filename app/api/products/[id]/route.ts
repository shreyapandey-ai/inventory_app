import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ FIX
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);

  } catch (err) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}


// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await params; // ✅ VERY IMPORTANT

  if (!id) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    );
  }

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted" });
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ FIX

    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
