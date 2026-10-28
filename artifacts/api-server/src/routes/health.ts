import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
router.get("/readyz", async (_req, res) => {
  try {
    await pool.query(
      "SELECT id, email, password_hash, google_id, role, reset_token, reset_token_expiry FROM users LIMIT 0",
    );
    await pool.query("SELECT id, approved FROM reviews LIMIT 0");
    await pool.query("SELECT id, status FROM contacts LIMIT 0");
    await pool.query("SELECT id, status FROM demo_requests LIMIT 0");
    await pool.query(
      "SELECT token_hash, user_id, expires_at FROM auth_sessions LIMIT 0",
    );
    await pool.query("SELECT key, hits, reset_at FROM request_limits LIMIT 0");
    res.json({ status: "ready" });
  } catch {
    res
      .status(503)
      .json({ status: "unavailable", message: "Database is not ready" });
  }
});

export default router;
