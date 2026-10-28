import pino from "pino";
import { safeError, safeRequestPath } from "./log-safety";

const isProduction = process.env.NODE_ENV === "production";

export function createLogger(
  destination?: pino.DestinationStream,
  options: { level?: string; pretty?: boolean } = {},
) {
  const configuration: pino.LoggerOptions = {
    level: options.level ?? process.env.LOG_LEVEL ?? "info",
    serializers: {
      // Database errors can contain SQL parameters; never log their raw messages.
      err: safeError,
      req: (req) => ({ method: req?.method, url: safeRequestPath(req?.url) }),
      res: (res) => ({ statusCode: res?.statusCode }),
    },
    redact: [
      "password",
      "passwordHash",
      "token",
      "credential",
      "resetToken",
      "resetUrl",
      "SESSION_SECRET",
      "DATABASE_URL",
      "OPENROUTER_API_KEY",
      "RESEND_API_KEY",
      "ADMIN_PASSWORD",
      "body",
      "payload",
      "data",
      "headers",
      "email",
      "phone",
      "req.body",
      "*.password",
      "*.passwordHash",
      "*.token",
      "*.credential",
      "*.resetToken",
      "*.resetUrl",
      "*.email",
      "*.phone",
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
    ],
    ...((options.pretty ?? !isProduction) && !destination
      ? {
          transport: {
            target: "pino-pretty",
            options: { colorize: true },
          },
        }
      : {}),
  };
  return destination ? pino(configuration, destination) : pino(configuration);
}

export const logger = createLogger();
