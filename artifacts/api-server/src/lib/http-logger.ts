import pinoHttp from "pino-http";
import type { Logger } from "pino";
import { safeError, safeRequestPath } from "./log-safety";

export function createHttpLogger(logger: Logger) {
  return pinoHttp({
    logger,
    wrapSerializers: false,
    serializers: {
      err: safeError,
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: safeRequestPath(req.url),
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  });
}
