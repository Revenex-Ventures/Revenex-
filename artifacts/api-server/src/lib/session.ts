import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";

const secret = (process.env.SESSION_SECRET ?? "").trim();
if (secret.length < 32)
  throw new Error("SESSION_SECRET must contain at least 32 characters");
const production = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "lax" as const,
  path: "/",
};
export const hashResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
// Binding sessions to the password hash invalidates them after a password reset,
// without requiring an additional database column or storing password data in JWTs.
const version = (user: User) =>
  crypto
    .createHmac("sha256", secret)
    .update(`${user.id}:${user.passwordHash ?? "google"}`)
    .digest("hex");
export const publicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export function createSession(res: Response, user: User) {
  const token = jwt.sign({ id: user.id, version: version(user) }, secret, {
    algorithm: "HS256",
    expiresIn: "7d",
    issuer: "revenex",
    audience: "revenex-web",
  });
  res.cookie("revenex_auth", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.setHeader("Cache-Control", "no-store");
  return { token, user: publicUser(user) };
}

export function clearSession(res: Response) {
  res.clearCookie("revenex_auth", cookieOptions);
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader("Cache-Control", "no-store");
  const token =
    req.cookies?.revenex_auth ??
    req.headers.authorization?.replace(/^Bearer /, "");
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: "revenex",
      audience: "revenex-web",
    }) as jwt.JwtPayload;
    if (
      !Number.isSafeInteger(payload.id) ||
      typeof payload.version !== "string"
    )
      throw new Error("Invalid session");
  } catch {
    clearSession(res);
    res.status(401).json({ message: "Invalid or expired session" });
    return;
  }
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.id));
    if (!user || payload.version !== version(user)) {
      clearSession(res);
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return authenticate(req, res, () => {
    if (res.locals.user.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    next();
  });
}
