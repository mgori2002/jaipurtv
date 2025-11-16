import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "mail.jaipurtv.in",
      port: 465,
      secure: true,
      auth: {
        user: "sameer@jaipurtv.in",
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: "sameer@jaipurtv.in",
      to: "sameer@jaipurtv.in",
      subject: "New Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email Error:", err);
    return res.status(500).json({ error: "Email not sent" });
  }
}
