import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // sameer@jaipurtv.in
        pass: process.env.SMTP_PASS  // your email password
      }
    });

    await transporter.sendMail({
      from: `"JaipurTV Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // sameer@jaipurtv.in
      subject: `New Contact Form: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Email failed",
      error: err.message
    });
  }
}
