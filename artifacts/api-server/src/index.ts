import { onRequest } from "firebase-functions/v2/https";
import app from "./app";
import { logger } from "./lib/logger";
import { seedAdmin } from "./lib/seed";

// Export the Firebase Cloud Function API endpoint
export const api = onRequest({
  cors: true,
  region: "asia-south1", // Optimal region for Indian EdTech apps
  minInstances: 0,
  memory: "512MiB",
}, app);

// Only listen locally if we are not running in a Firebase Functions/Cloud environment
if (!process.env.FUNCTIONS_EMULATOR && !process.env.FIREBASE_CONFIG) {
  const rawPort = process.env["PORT"] || "8080";
  const port = Number(rawPort);

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Local server listening");
    void seedAdmin().catch((e) => logger.warn({ e }, "Seed failed"));
  });
}
