import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePDFBuffer(text: string) {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 50;
  const maxWidth = width - margin * 2;
  const bodyFontSize = 11;
  const titleFontSize = 20;
  const sectionFontSize = 14;
  const lineHeight = 16;

  let y = height - margin;

  // Main Title
  page.drawText("Inventory AI Executive Report", {
    x: margin,
    y,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  const lines = text.split("\n");

  for (const rawLine of lines) {
    let line = rawLine.trim();

    // Section Titles Detection
    if (line.startsWith("SECTION")) {
      y -= 10;
      page.drawText(line, {
        x: margin,
        y,
        size: sectionFontSize,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      y -= 20;
      continue;
    }

    // Wrap text properly
    const words = line.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + word + " ";
      const textWidth = fontRegular.widthOfTextAtSize(testLine, bodyFontSize);

      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: bodyFontSize,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= lineHeight;
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }

    page.drawText(currentLine, {
      x: margin,
      y,
      size: bodyFontSize,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= lineHeight;

    // New Page Handling
    if (y < margin) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
