import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable, authSessionsTable, type User } from "@workspace/db";
import { eq, and, gt, lt } from "drizzle-orm";

const secret = (process.env.SESSION_SECRET ?? "").trim();
if (secret.length < 32)
  throw new Error("SESSION_SECRET must contain at least 32 characters");
const production = process.env.NODE_ENV === "production";
export const authCookieName = production
  ? "__Host-revenex_auth"
  : "revenex_auth";
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

export async function createSession(res: Response, user: User) {
  const token = jwt.sign(
    { id: user.id, version: version(user), jti: crypto.randomUUID() },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: "revenex",
      audience: "revenex-web",
    },
  );
  await db
    .delete(authSessionsTable)
    .where(lt(authSessionsTable.expiresAt, new Date()));
  await db
    .insert(authSessionsTable)
    .values({
      tokenHash: hashResetToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  res.cookie(authCookieName, token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.setHeader("Cache-Control", "no-store");
  return { user: publicUser(user) };
}

export async function revokeSession(req: Request, res: Response) {
  const token =
    req.cookies?.[authCookieName] ??
    req.headers.authorization?.replace(/^Bearer /, "");
  clearSession(res);
  if (typeof token === "string" && token.length <= 4096)
    await db
      .delete(authSessionsTable)
      .where(eq(authSessionsTable.tokenHash, hashResetToken(token)));
}

export function clearSession(res: Response) {
  res.clearCookie(authCookieName, cookieOptions);
  if (production) res.clearCookie("revenex_auth", cookieOptions);
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader("Cache-Control", "no-store");
  const token =
    req.cookies?.[authCookieName] ??
    req.headers.authorization?.replace(/^Bearer /, "");
  if (typeof token !== "string" || !token || token.length > 4096) {
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
      typeof payload.version !== "string" ||
      typeof payload.jti !== "string"
    )
      throw new Error("Invalid session");
  } catch {
    clearSession(res);
    res.status(401).json({ message: "Invalid or expired session" });
    return;
  }
  try {
    const [session] = await db
      .select()
      .from(authSessionsTable)
      .where(
        and(
          eq(authSessionsTable.tokenHash, hashResetToken(token)),
          eq(authSessionsTable.userId, payload.id),
          gt(authSessionsTable.expiresAt, new Date()),
        ),
      );
    if (!session) {
      clearSession(res);
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }
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
