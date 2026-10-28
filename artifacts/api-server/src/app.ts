import { createHttpLogger } from "./lib/http-logger";
import express, { type Express, type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";
import { limiter } from "./lib/limits";
import { allowedOrigins, securityHeaders, protectWrites } from "./lib/security";

const reviewLimiter = limiter(5, 15 * 60 * 1000, "reviews");
const app: Express = express();
app.disable("x-powered-by");
// Configure only the number of proxy hops controlled by the deployment.
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 0));
app.use(securityHeaders);

app.use(createHttpLogger(logger));
app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.has(origin)),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api", protectWrites);
app.use(express.json({ limit: "32kb", inflate: false }));
app.use("/api", limiter(300));
app.use("/api/auth", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(
  ["/api/auth/login", "/api/auth/google", "/api/auth/signup"],
  limiter(20, 15 * 60 * 1000, "auth"),
);
app.use(
  ["/api/auth/forgot-password", "/api/auth/reset-password"],
  limiter(5, 15 * 60 * 1000, "password-reset"),
);
app.use(["/api/contact", "/api/demo"], limiter(10, 15 * 60 * 1000, "forms"));
app.use("/api/reviews", (req, res, next) =>
  req.method === "POST" ? reviewLimiter(req, res, next) : next(),
);
app.use("/api/chat", limiter(20, 60 * 1000, "chat"));

app.use("/api", router);
app.use((_req, res) => {
  res.status(404).json({ message: "API route not found" });
});
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (res.headersSent) {
    _next(err);
    return;
  }
  const status =
    err.status === 413
      ? 413
      : err.status === 415
        ? 415
        : err.type === "entity.parse.failed"
          ? 400
          : 500;
  if (status === 500) req.log.error({ err }, "API request failed");
  const message =
    status === 413
      ? "Request body is too large"
      : status === 415
        ? "Compressed or unsupported request bodies are not accepted"
        : status === 400
          ? "Invalid JSON body"
          : "Something went wrong. Please try again.";
  res.status(status).json({ message, error: message });
};
app.use(errorHandler);

export default app;
