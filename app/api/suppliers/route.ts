import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.supplier.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return NextResponse.json(supplier);
}
