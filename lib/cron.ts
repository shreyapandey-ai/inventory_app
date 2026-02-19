import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { generatePDFBuffer } from "@/lib/generateReport";
import { sendEmailWithReport } from "@/lib/sendEmail";
import fs from "fs";
import path from "path";

export function startInventoryCron() {
  // ⏰ Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily inventory report...");

    try {
      const products = await prisma.product.findMany();

      if (products.length === 0) return;

      const lowStock = products.filter(p => p.quantity < 10).length;
      const overStock = products.filter(p => p.quantity > 100).length;
      const healthyStock = products.length - lowStock - overStock;

      const reportText = `
Daily Inventory Report

Low stock: ${lowStock}
Overstock: ${overStock}
Healthy stock: ${healthyStock}
`;

      const pdfBuffer = await generatePDFBuffer(reportText);

      const filePath = path.join(process.cwd(), "daily-inventory-report.pdf");
      fs.writeFileSync(filePath, pdfBuffer);

      await sendEmailWithReport(
        process.env.ADMIN_EMAIL!,
        filePath
      );

      console.log("Daily report sent successfully");
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
}
