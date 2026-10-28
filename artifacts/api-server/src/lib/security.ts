import type { RequestHandler } from "express";
import { authCookieName } from "./session";

const production = process.env.NODE_ENV === "production";
export const allowedOrigins = new Set([
  "https://revenex.in",
  "https://www.revenex.in",
  "https://revenex.pages.dev",
  ...(!production ? ["http://localhost:5173", "http://127.0.0.1:5173"] : []),
  ...(process.env.APP_URL ? [new URL(process.env.APP_URL).origin] : []),
  ...(process.env.VERCEL_URL
    ? [new URL(`https://${process.env.VERCEL_URL}`).origin]
    : []),
]);

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  );
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), usb=()",
  );
  res.setHeader("Cache-Control", "no-store");
  if (production)
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
};

export const protectWrites: RequestHandler = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }
  const origin = req.headers.origin;
  if (
    req.headers["sec-fetch-site"] === "cross-site" ||
    (origin && !allowedOrigins.has(origin))
  ) {
    res.status(403).json({ message: "Request origin is not allowed" });
    return;
  }
  // Browsers that strip Origin must still supply a same-origin custom header
  // for cookie-authenticated writes. Cross-origin forms cannot set this header.
  if (
    !origin &&
    req.cookies?.[authCookieName] &&
    req.get("X-Revenex-Request") !== "1"
  ) {
    res.status(403).json({ message: "Request verification failed" });
    return;
  }
  const hasBody =
    Number(req.headers["content-length"] ?? 0) > 0 ||
    Boolean(req.headers["transfer-encoding"]) ||
    req.body !== undefined;
  if ((hasBody || req.headers["content-type"]) && !req.is("application/json")) {
    res.status(415).json({ message: "Content-Type must be application/json" });
    return;
  }
  next();
};

export { safeRequestPath } from "./log-safety";
