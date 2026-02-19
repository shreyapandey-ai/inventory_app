import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.category.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const category = await prisma.category.create({
    data: { name: body.name },
  });

  return NextResponse.json(category);
}
