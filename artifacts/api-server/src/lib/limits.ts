import { rateLimit } from "express-rate-limit";

export function limiter(limit: number, windowMs = 15 * 60 * 1000) {
  return rateLimit({
    limit,
    windowMs,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message: "Too many requests. Please try again later.",
      error: "Too many requests. Please try again later.",
    },
  });
}
