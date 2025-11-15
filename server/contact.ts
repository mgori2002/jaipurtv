import { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // BigRock / cPanel email SMTP login
  const transporter = nodemailer.createTransport({
    host: "smtp.yourdomain.com",   // ⚠️ Change this (example: mail.jaipurtv.in)
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER, // ex: info@jaipurtv.in
      pass: process.env.SMTP_PASS  // your password
    },
  });

  try {
    await transporter.sendMail({
      from: `"JaipurTV Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to yourself
      subject: `New Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Email failed" });
  }
}
