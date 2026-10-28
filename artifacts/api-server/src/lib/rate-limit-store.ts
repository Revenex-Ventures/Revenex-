import { createHmac } from "node:crypto";
import type { Store, Options } from "express-rate-limit";
import { pool } from "@workspace/db";

// Shared PostgreSQL counters prevent cold starts and multiple API instances from
// resetting login, password-reset, form and AI request quotas. IPs are hashed.
export class DatabaseRateLimitStore implements Store {
  localKeys = false;
  private windowMs = 900000;
  private lastCleanup = 0;
  constructor(public readonly prefix: string) {}
  init(options: Options) {
    this.windowMs = options.windowMs;
  }
  private key(value: string) {
    return (
      this.prefix +
      ":" +
      createHmac("sha256", process.env.SESSION_SECRET!)
        .update(value)
        .digest("hex")
    );
  }
  async increment(value: string) {
    const now = new Date();
    const reset = new Date(now.getTime() + this.windowMs);
    const result = await pool.query(
      `INSERT INTO request_limits (key, hits, reset_at) VALUES ($1, 1, $2)
      ON CONFLICT (key) DO UPDATE SET
        hits = CASE WHEN request_limits.reset_at <= $3 THEN 1 ELSE request_limits.hits + 1 END,
        reset_at = CASE WHEN request_limits.reset_at <= $3 THEN $2 ELSE request_limits.reset_at END
      RETURNING hits, reset_at`,
      [this.key(value), reset, now],
    );
    if (Date.now() - this.lastCleanup > 60000) {
      this.lastCleanup = Date.now();
      await pool.query("DELETE FROM request_limits WHERE reset_at < $1", [now]);
    }
    return {
      totalHits: Number(result.rows[0].hits),
      resetTime: new Date(result.rows[0].reset_at),
    };
  }
  async decrement(value: string) {
    await pool.query(
      "UPDATE request_limits SET hits = GREATEST(0, hits - 1) WHERE key = $1",
      [this.key(value)],
    );
  }
  async resetKey(value: string) {
    await pool.query("DELETE FROM request_limits WHERE key = $1", [
      this.key(value),
    ]);
  }
}
