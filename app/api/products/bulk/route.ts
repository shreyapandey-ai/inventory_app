type ProductCSVRow = {
  name: string;
  quantity: string;
  price: string;
  categoryName: string;
  supplierName: string;
};


export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
  columns: true,
  skip_empty_lines: true,
}) as ProductCSVRow[];


    // ✅ Fetch once (IMPORTANT)
    const categories = await prisma.category.findMany();
    const suppliers = await prisma.supplier.findMany();

    const categoryMap = new Map(categories.map(c => [c.name, c]));
    const supplierMap = new Map(suppliers.map(s => [s.name, s]));

    const products = [];
    const errors: string[] = [];

    for (const row of records) {
      const name = row.name?.trim();
      const categoryName = row.categoryName?.trim();
      const supplierName = row.supplierName?.trim();

      const quantity = Math.max(0, Number(row.quantity));
      const price = Math.max(0, Number(row.price));

      // ✅ Validate
      if (!name || !categoryName || !supplierName) {
        errors.push(`Invalid row: ${JSON.stringify(row)}`);
        continue;
      }

      const category = categoryMap.get(categoryName);
      const supplier = supplierMap.get(supplierName);

      if (!category) {
        errors.push(`Category not found: ${categoryName}`);
        continue;
      }

      if (!supplier) {
        errors.push(`Supplier not found: ${supplierName}`);
        continue;
      }

      products.push({
        name,
        sku: `SKU-${randomUUID().slice(0, 8)}`,
        quantity,
        price,
        categoryId: category.id,
        supplierId: supplier.id,
      });
    }

    if (products.length > 0) {
      await prisma.product.createMany({
        data: products,
      });
    }

    return NextResponse.json({
      message: "Bulk upload completed",
      successCount: products.length,
      failedCount: errors.length,
      errors, // 🔥 useful for UI
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
