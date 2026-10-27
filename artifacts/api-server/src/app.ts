import express, { type Express, type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { limiter } from "./lib/limits";

const reviewLimiter = limiter(5);
const app: Express = express();
app.disable("x-powered-by");
// Configure only the number of proxy hops controlled by the deployment.
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 0));
const origins = new Set([
  "https://revenex.in",
  "https://www.revenex.in",
  "https://revenex.pages.dev",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.APP_URL ? [new URL(process.env.APP_URL).origin] : []),
]);
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || origins.has(origin)),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api", (req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers.origin &&
    !origins.has(req.headers.origin)
  ) {
    res.status(403).json({ message: "Request origin is not allowed" });
    return;
  }
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers["content-length"] !== "0" &&
    req.headers["content-length"] &&
    !req.is("application/json")
  ) {
    res.status(415).json({ message: "Content-Type must be application/json" });
    return;
  }
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use("/api", limiter(300));
app.use("/api/auth", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(
  ["/api/auth/login", "/api/auth/google", "/api/auth/signup"],
  limiter(20),
);
app.use(["/api/auth/forgot-password", "/api/auth/reset-password"], limiter(5));
app.use(["/api/contact", "/api/demo"], limiter(10));
app.use("/api/reviews", (req, res, next) =>
  req.method === "POST" ? reviewLimiter(req, res, next) : next(),
);
app.use("/api/chat", limiter(20, 60 * 1000));

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
    err.status === 413 ? 413 : err.type === "entity.parse.failed" ? 400 : 500;
  if (status === 500) req.log.error({ err }, "API request failed");
  const message =
    status === 413
      ? "Request body is too large"
      : status === 400
        ? "Invalid JSON body"
        : "Something went wrong. Please try again.";
  res.status(status).json({ message, error: message });
};
app.use(errorHandler);

export default app;
