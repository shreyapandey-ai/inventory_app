import nodemailer from "nodemailer";

export async function sendEmailWithReport(email: string, filePath: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Inventory Analysis Report",
    text: "Please find attached your inventory report.",
    attachments: [
      {
        filename: "inventory-report.pdf",
        path: filePath,
      },
    ],
  });
}
