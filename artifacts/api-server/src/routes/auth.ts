import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { schemas, validateBody, escapeHtml } from "../lib/validation";
import {
  authenticate,
  createSession,
  clearSession,
  publicUser,
  hashResetToken,
} from "../lib/session";
import { verifyGoogleCredential } from "../lib/google";
import crypto from "crypto";

const router: IRouter = Router();
function nowIST() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    throw new Error("Email delivery is not configured");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      from: process.env["FROM_EMAIL"] ?? "team@revenex.in",
      to,
      subject,
      html,
    }),
  });
  if (!response.ok) throw new Error("Email delivery failed");
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

router.post("/auth/signup", validateBody(schemas.signup), async (req, res) => {
  const { name, email, password, phone, school } = req.body;
  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existing) {
    res
      .status(409)
      .json({ message: "An account with this email already exists" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      passwordHash,
      phone: phone || null,
      school: school || null,
      provider: "email",
      role: "user",
    })
    .onConflictDoNothing({ target: usersTable.email })
    .returning();
  if (!user) {
    res
      .status(409)
      .json({ message: "An account with this email already exists" });
    return;
  }
  await Promise.all([
    sendEmail(email, "Welcome to REVENEX", welcomeHtml(escapeHtml(name))),
    sendEmail(
      process.env.ADMIN_EMAIL ?? "team@revenex.in",
      "New User Registration — REVENEX",
      adminNotifyHtml(escapeHtml(name), escapeHtml(email), "Email"),
    ),
  ]).catch(() => req.log.warn("Registration email delivery failed"));
  res.status(201).json(createSession(res, user));
});

router.post("/auth/login", validateBody(schemas.login), async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (
    !user?.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  await db
    .update(usersTable)
    .set({ lastLogin: new Date() })
    .where(eq(usersTable.id, user.id));
  res.json(createSession(res, user));
});

router.post("/auth/google", validateBody(schemas.google), async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID?.trim()) {
    res
      .status(503)
      .json({
        message:
          "Google sign-in is currently unavailable. Please use email sign-in.",
      });
    return;
  }
  let identity;
  try {
    identity = await verifyGoogleCredential(req.body.credential);
  } catch {
    res
      .status(401)
      .json({
        message: "Google sign-in could not be verified. Please try again.",
      });
    return;
  }
  const { email, name, googleId, authoritative } = identity;
  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.googleId, googleId));
  if (!user) {
    [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (
      user &&
      ((user.googleId && user.googleId !== googleId) || !authoritative)
    ) {
      res
        .status(409)
        .json({
          message:
            "Please sign in with your email and password for this account.",
        });
      return;
    }
  }
  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        googleId,
        provider: "google",
        role: "user",
        lastLogin: new Date(),
      })
      .onConflictDoNothing({ target: usersTable.email })
      .returning();
    if (!user) {
      res
        .status(409)
        .json({ message: "Account changed. Please try signing in again." });
      return;
    }
    await sendEmail(
      email,
      "Welcome to REVENEX",
      welcomeHtml(escapeHtml(name)),
    ).catch(() => req.log.warn("Welcome email delivery failed"));
  } else {
    [user] = await db
      .update(usersTable)
      .set({ googleId, lastLogin: new Date() })
      .where(eq(usersTable.id, user.id))
      .returning();
  }
  res.json(createSession(res, user));
});

router.post(
  "/auth/forgot-password",
  validateBody(schemas.forgot),
  async (req, res) => {
    if (!process.env.RESEND_API_KEY?.trim()) {
      res
        .status(503)
        .json({
          message:
            "Password reset email is temporarily unavailable. Please contact support.",
        });
      return;
    }
    const { email } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(token);
      await db
        .update(usersTable)
        .set({
          resetToken: tokenHash,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        })
        .where(eq(usersTable.id, user.id));
      const appUrl = (process.env.APP_URL ?? "http://localhost:5173").replace(
        /\/$/,
        "",
      );
      try {
        await sendEmail(
          email,
          "Reset your REVENEX password",
          resetHtml(
            escapeHtml(user.name),
            `${appUrl}/reset-password?token=${token}`,
          ),
        );
      } catch {
        await db
          .update(usersTable)
          .set({ resetToken: null, resetTokenExpiry: null })
          .where(
            and(
              eq(usersTable.id, user.id),
              eq(usersTable.resetToken, tokenHash),
            ),
          );
        req.log.warn("Password reset email delivery failed");
        res
          .status(503)
          .json({
            message: "Unable to send reset email. Please try again later.",
          });
        return;
      }
    }
    res.json({
      message: "If this email is registered, a reset link has been sent.",
    });
  },
);

router.post(
  "/auth/reset-password",
  validateBody(schemas.reset),
  async (req, res) => {
    const { token, password } = req.body;
    const tokenHash = hashResetToken(token);
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(
        and(
          eq(usersTable.resetToken, tokenHash),
          gt(usersTable.resetTokenExpiry, new Date()),
        ),
      )
      .returning();
    if (!user) {
      res
        .status(400)
        .json({
          message: "Invalid or expired reset link. Please request a new one.",
        });
      return;
    }
    clearSession(res);
    await sendEmail(
      user.email,
      "Your REVENEX Password Has Been Reset",
      resetConfirmHtml(escapeHtml(user.name)),
    ).catch(() => req.log.warn("Password reset confirmation delivery failed"));
    res.json({
      message:
        "Password updated successfully. You can now sign in with your new password.",
    });
  },
);

router.post("/auth/logout", (_req, res) => {
  clearSession(res);
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", authenticate, (_req, res) => {
  res.json(publicUser(res.locals.user));
});
router.get("/auth/session", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (!req.cookies?.revenex_auth && !req.headers.authorization) {
    res.json({ user: null });
    return;
  }
  return authenticate(req, res, () => {
    res.json({ user: publicUser(res.locals.user) });
  });
});
export default router;
