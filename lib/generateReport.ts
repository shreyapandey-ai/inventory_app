import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePDFBuffer(text: string) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  const fontSizeTitle = 18;
  const fontSizeText = 12;

  // Title
  page.drawText("Inventory AI Report", {
    x: 50,
    y: height - 50,
    size: fontSizeTitle,
    font,
    color: rgb(0, 0, 0),
  });

  // Content (split lines)
  const lines = text.split("\n");

  let y = height - 80;

  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y,
      size: fontSizeText,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 20;
  }

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}
