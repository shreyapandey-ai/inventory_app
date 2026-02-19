import nodemailer from "nodemailer";

export async function sendEmailWithReport(
  email: string,
  filePath: string
) {
  try {
    // ✅ Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not configured");
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Optional: verify connection
    await transporter.verify();

    // ✅ Send email
    const info = await transporter.sendMail({
      from: `"Inventory System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Inventory Analysis Report",
      text: "Please find attached your inventory report.",
      html: `
        <h2>Inventory Analysis Report</h2>
        <p>Please find attached your inventory report.</p>
        <p>This report contains AI-based stock analysis and insights.</p>
      `,
      attachments: [
        {
          filename: "inventory-report.pdf",
          path: filePath,
        },
      ],
    });

    console.log("Email sent:", info.messageId);

    return { success: true };
  } catch (error: any) {
    console.error("Email error:", error.message);
    return { success: false, error: error.message };
  }
}
