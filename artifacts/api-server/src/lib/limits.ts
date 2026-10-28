import type { Request } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { DatabaseRateLimitStore } from "./rate-limit-store";

// Use only Express's address resolved through the explicitly configured proxy
// hops. The client-supplied Forwarded header cannot select another quota key.
export function requestRateLimitKey(req: Pick<Request, "ip" | "socket">): string {
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown");
}

export function limiter(
  limit: number,
  windowMs = 15 * 60 * 1000,
  sharedKey?: string,
) {
  return rateLimit({
    limit,
    keyGenerator: requestRateLimitKey,
    windowMs,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ...(sharedKey ? { store: new DatabaseRateLimitStore(sharedKey) } : {}),
    message: {
      message: "Too many requests. Please try again later.",
      error: "Too many requests. Please try again later.",
    },
  });
}
