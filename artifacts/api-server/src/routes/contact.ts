import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { name, email, institution, subject, message } = req.body as {
    name?: string;
    email?: string;
    institution?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email and message are required" });
    return;
  }

  try {
    await db.insert(contactsTable).values({
      name,
      email,
      institution: institution ?? null,
      subject: subject ?? null,
      message,
    });

    const resendKey = process.env["RESEND_API_KEY"];
    const adminEmail = process.env["ADMIN_EMAIL"] ?? "team@revenex.in";
    const fromEmail = process.env["FROM_EMAIL"] ?? "noreply@revenex.in";
    const appUrl = process.env["APP_URL"] ?? "https://revenex.in";

    if (resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: fromEmail,
          to: adminEmail,
          subject: `New Contact from ${name} — Revenex`,
          html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#6C63FF,#4CAF50);padding:28px 32px">
    <h2 style="color:#fff;margin:0;font-size:20px">New Contact Request</h2>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:120px">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#333">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6C63FF">${email}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Institution</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${institution ?? "—"}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Subject</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${subject ?? "—"}</td></tr>
    </table>
    <div style="margin-top:20px">
      <p style="color:#888;font-size:13px;margin:0 0 8px">Message</p>
      <div style="background:#f8f8f8;border-left:3px solid #6C63FF;padding:16px;border-radius:4px;color:#333;line-height:1.6;font-size:14px">${message}</div>
    </div>
    <div style="text-align:center;margin-top:28px">
      <a href="${appUrl}/admin" style="background:linear-gradient(135deg,#6C63FF,#4CAF50);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">View in Admin Panel</a>
    </div>
  </div>
</div>
</body></html>`,
        }),
      }).catch((err) => req.log.warn({ err }, "Failed to send contact email"));
    }

    req.log.info({ name, email }, "Contact form submitted");
    res.json({ message: "Thank you for your message. We will get back to you soon." });
  } catch (err) {
    req.log.error({ err }, "Failed to save contact form");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
