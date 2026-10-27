import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  serializers: {
    // Database errors can contain SQL parameters; never log their raw messages.
    err(error) {
      return {
        type: error?.name ?? "Error",
        code: error?.code ?? error?.cause?.code,
      };
    },
  },
  redact: [
    "password",
    "passwordHash",
    "token",
    "credential",
    "resetToken",
    "resetUrl",
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
