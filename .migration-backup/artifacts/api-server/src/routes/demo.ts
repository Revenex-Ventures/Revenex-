import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { demoRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/demo", async (req, res) => {
  const { name, schoolName, type, email, phone, city, students, preferredDate, preferredTime, message } = req.body as {
    name?: string;
    schoolName?: string;
    type?: string;
    email?: string;
    phone?: string;
    city?: string;
    students?: string;
    preferredDate?: string;
    preferredTime?: string;
    message?: string;
  };

  if (!name || !schoolName || !email) {
    res.status(400).json({ error: "Name, school name, and email are required" });
    return;
  }

  try {
    await db.insert(demoRequestsTable).values({
      name,
      schoolName,
      type: type ?? null,
      email,
      phone: phone ?? null,
      city: city ?? null,
      students: students ?? null,
      preferredDate: preferredDate ?? null,
      preferredTime: preferredTime ?? null,
      message: message ?? null,
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
          subject: `New Demo Booking — ${schoolName} (${name})`,
          html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#10b981,#6C63FF);padding:28px 32px">
    <h2 style="color:#fff;margin:0;font-size:20px">New Demo Booking</h2>
    <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px">${schoolName} wants to see Revenex in action</p>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:140px">Contact Name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#333">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">School Name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#333">${schoolName}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0">${email}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${phone ?? "—"}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">City</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${city ?? "—"}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Students</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${students ?? "—"}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Preferred Date</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${preferredDate ?? "—"}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Preferred Time</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333">${preferredTime ?? "—"}</td></tr>
    </table>
    ${message ? `<div style="margin-top:20px"><p style="color:#888;font-size:13px;margin:0 0 8px">Notes</p><div style="background:#f8f8f8;border-left:3px solid #10b981;padding:16px;border-radius:4px;color:#333;line-height:1.6;font-size:14px">${message}</div></div>` : ""}
    <div style="text-align:center;margin-top:28px">
      <a href="${appUrl}/admin" style="background:linear-gradient(135deg,#10b981,#6C63FF);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">Manage in Admin Panel</a>
    </div>
  </div>
</div>
</body></html>`,
        }),
      }).catch((err) => req.log.warn({ err }, "Failed to send demo email"));
    }

    req.log.info({ name, schoolName, email }, "Demo request submitted");
    res.json({ message: "Thank you for booking a demo. Our team will contact you shortly to confirm your session." });
  } catch (err) {
    req.log.error({ err }, "Failed to save demo request");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
