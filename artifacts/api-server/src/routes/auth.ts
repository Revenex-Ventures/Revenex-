import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();
const JWT_SECRET = process.env["SESSION_SECRET"] ?? "revenex-secret-key";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setAuthCookie(res: import("express").Response, token: string) {
  res.cookie("revenex_auth", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
}

function nowIST() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: process.env["FROM_EMAIL"] ?? "team@revenex.in", to, subject, html }),
  }).catch(() => { /* ignore */ });
}

function welcomeHtml(name: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);padding:40px;text-align:center">
  <h1 style="color:#000;margin:0;font-size:28px">Welcome to <strong>REVENEX</strong>!</h1>
</div>
<div style="padding:40px">
  <h2 style="color:#333">Hello ${name},</h2>
  <p style="color:#555;line-height:1.6">Thank you for joining <strong>REVENEX</strong> — India's trusted School ERP Platform.</p>
  <p style="color:#555;line-height:1.6">Manage your school operations efficiently — from admissions and attendance to fees and academics.</p>
  <div style="text-align:center;margin:30px 0">
    <a href="https://revenex.in/book-demo" style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Book a Free Demo</a>
  </div>
  <p style="color:#888;font-size:14px">Questions? Email us at <a href="mailto:team@revenex.in" style="color:#00E5C3">team@revenex.in</a></p>
</div>
<div style="background:#f5f5f5;padding:20px;text-align:center">
  <p style="color:#aaa;font-size:12px;margin:0">© 2025 REVENEX. All rights reserved.</p>
</div></div></body></html>`;
}

function adminNotifyHtml(name: string, email: string, method: string) {
  const dt = nowIST();
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);padding:30px;text-align:center">
  <h1 style="color:#000;margin:0;font-size:22px">New User Registration</h1>
</div>
<div style="padding:30px">
  <p style="color:#333;font-size:16px">A new user has registered on REVENEX.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0">
    <tr><td style="padding:10px;border:1px solid #eee;background:#f9f9f9;font-weight:bold;width:140px">Name</td><td style="padding:10px;border:1px solid #eee">${name}</td></tr>
    <tr><td style="padding:10px;border:1px solid #eee;background:#f9f9f9;font-weight:bold">Email</td><td style="padding:10px;border:1px solid #eee">${email}</td></tr>
    <tr><td style="padding:10px;border:1px solid #eee;background:#f9f9f9;font-weight:bold">Registered At</td><td style="padding:10px;border:1px solid #eee">${dt} IST</td></tr>
    <tr><td style="padding:10px;border:1px solid #eee;background:#f9f9f9;font-weight:bold">Login Method</td><td style="padding:10px;border:1px solid #eee">${method}</td></tr>
  </table>
</div></div></body></html>`;
}

function resetHtml(name: string, resetUrl: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);padding:30px;text-align:center">
  <h1 style="color:#000;margin:0;font-size:22px">Reset Your Password</h1>
</div>
<div style="padding:30px">
  <p>Hello ${name},</p>
  <p style="color:#555;line-height:1.6">We received a request to reset your REVENEX account password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
  <div style="text-align:center;margin:30px 0">
    <a href="${resetUrl}" style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Reset Password</a>
  </div>
  <p style="color:#888;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
  <p style="color:#aaa;font-size:12px;word-break:break-all">Or copy this link: ${resetUrl}</p>
</div></div></body></html>`;
}

function resetConfirmHtml(name: string) {
  const dt = nowIST();
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00E5C3,#7C4DFF);padding:30px;text-align:center">
  <h1 style="color:#000;margin:0;font-size:22px">Password Successfully Reset</h1>
</div>
<div style="padding:30px">
  <p>Hello ${name},</p>
  <p style="color:#555;line-height:1.6">Your REVENEX account password was successfully reset on <strong>${dt} IST</strong>.</p>
  <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:15px;margin:20px 0">
    <p style="color:#856404;margin:0;font-size:14px"><strong>⚠ Security Notice:</strong> If you did not make this change, please contact us immediately at <a href="mailto:team@revenex.in" style="color:#856404">team@revenex.in</a>.</p>
  </div>
</div></div></body></html>`;
}

router.post("/auth/signup", async (req, res) => {
  const { name, email, password, phone, school } = req.body as {
    name?: string; email?: string; password?: string; phone?: string; school?: string;
  };
  if (!name || !email || !password) { res.status(400).json({ message: "Name, email and password are required" }); return; }
  if (password.length < 6) { res.status(400).json({ message: "Password must be at least 6 characters" }); return; }
  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (existing) { res.status(409).json({ message: "An account with this email already exists" }); return; }
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name, email: email.toLowerCase(), passwordHash, phone: phone ?? null, school: school ?? null, provider: "email", role: "user",
    }).returning();
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    const adminEmail = process.env["ADMIN_EMAIL"] ?? "team@revenex.in";
    void Promise.all([
      sendEmail(user.email, "Welcome to REVENEX — India's School ERP Platform", welcomeHtml(user.name)),
      sendEmail(adminEmail, "New User Registration — REVENEX", adminNotifyHtml(user.name, user.email, "Email")),
    ]).catch(() => { /* ignore */ });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { req.log.error({ err }, "Signup error"); res.status(500).json({ message: "Something went wrong. Please try again." }); }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) { res.status(400).json({ message: "Email and password are required" }); return; }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (!user || !user.passwordHash) { res.status(401).json({ message: "Invalid email or password" }); return; }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ message: "Invalid email or password" }); return; }
    await db.update(usersTable).set({ lastLogin: new Date() }).where(eq(usersTable.id, user.id));
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { req.log.error({ err }, "Login error"); res.status(500).json({ message: "Something went wrong. Please try again." }); }
});

router.post("/auth/google", async (req, res) => {
  const { email, name, googleId } = req.body as { email?: string; name?: string; googleId?: string };
  if (!email || !name) { res.status(400).json({ message: "Email and name are required" }); return; }
  try {
    const adminEmail = (process.env["ADMIN_EMAIL"] ?? "team@revenex.in").toLowerCase();
    const roleToAssign = email.toLowerCase() === adminEmail ? "admin" : "user";

    let [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (user) {
      const updates: Record<string, unknown> = { lastLogin: new Date(), googleId: googleId ?? user.googleId };
      if (roleToAssign === "admin" && user.role !== "admin") updates.role = "admin";
      await db.update(usersTable).set(updates).where(eq(usersTable.id, user.id));
      [user] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
    } else {
      [user] = await db.insert(usersTable).values({
        name,
        email: email.toLowerCase(),
        provider: "google",
        googleId: googleId ?? null,
        role: roleToAssign,
      }).returning();
      void Promise.all([
        sendEmail(user.email, "Welcome to REVENEX — India's School ERP Platform", welcomeHtml(user.name)),
        sendEmail(adminEmail, "New User Registration — REVENEX", adminNotifyHtml(user.name, user.email, "Google")),
      ]).catch(() => { /* ignore */ });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { req.log.error({ err }, "Google auth error"); res.status(500).json({ message: "Something went wrong. Please try again." }); }
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) { res.status(400).json({ message: "Email is required" }); return; }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (!user) { res.json({ message: "If this email is registered, a reset link has been sent." }); return; }
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await db.update(usersTable).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(usersTable.id, user.id));
    const appUrl = (process.env["APP_URL"] ?? "http://localhost:3000").replace(/\/$/, "");
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    req.log.info({ email, resetUrl }, "Password reset requested");
    void sendEmail(email, "Reset your REVENEX password", resetHtml(user.name, resetUrl)).catch(() => { /* ignore */ });
    res.json({ message: "If this email is registered, a reset link has been sent." });
  } catch (err) { req.log.error({ err }, "Forgot password error"); res.status(500).json({ message: "Something went wrong. Please try again." }); }
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password) { res.status(400).json({ message: "Token and password are required" }); return; }
  if (password.length < 8) { res.status(400).json({ message: "Password must be at least 8 characters" }); return; }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.resetToken, token));
    if (!user) { res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." }); return; }
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ message: "This reset link has expired. Please request a new password reset." }); return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null, lastLogin: new Date() })
      .where(eq(usersTable.id, user.id));
    req.log.info({ userId: user.id }, "Password reset successful");
    void sendEmail(user.email, "Your REVENEX Password Has Been Reset", resetConfirmHtml(user.name)).catch(() => { /* ignore */ });
    res.json({ message: "Password updated successfully. You can now sign in with your new password." });
  } catch (err) { req.log.error({ err }, "Reset password error"); res.status(500).json({ message: "Something went wrong. Please try again." }); }
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("revenex_auth");
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", (req, res) => {
  const token = (req.cookies?.["revenex_auth"] as string | undefined) ?? req.headers.authorization?.replace("Bearer ", "");
  if (!token) { res.status(401).json({ message: "Not authenticated" }); return; }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string; name: string; role: string };
    res.json({ id: payload.id, email: payload.email, name: payload.name, role: payload.role });
  } catch { res.status(401).json({ message: "Invalid or expired token" }); }
});

export default router;
