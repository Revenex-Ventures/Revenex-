import { onRequest } from "firebase-functions/v2/https";
import app from "./app";
import { logger } from "./lib/logger";
import { seedAdmin } from "./lib/seed";

// Export the Firebase Cloud Function API endpoint
export const api = onRequest(
  {
    cors: true,
    region: "asia-south1", // Optimal region for Indian EdTech apps
    minInstances: 0,
    memory: "512MiB",
  },
  app,
);

// Only listen locally if we are not running in a Firebase Functions/Cloud environment
if (
  !process.env.K_SERVICE &&
  !process.env.FUNCTION_TARGET &&
  !process.env.FUNCTIONS_EMULATOR
) {
  const rawPort = process.env["PORT"] || "8080";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");
  const server = app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Local server listening");
    void seedAdmin().catch((err) => logger.warn({ err }, "Seed failed"));
  });
  const shutdown = () => {
    server.close(() => {
      void import("@workspace/db")
        .then(({ pool }) => pool.end())
        .finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
