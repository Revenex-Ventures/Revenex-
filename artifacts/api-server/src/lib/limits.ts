import { rateLimit } from "express-rate-limit";
import { DatabaseRateLimitStore } from "./rate-limit-store";

export function limiter(
  limit: number,
  windowMs = 15 * 60 * 1000,
  sharedKey?: string,
) {
  return rateLimit({
    limit,
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
