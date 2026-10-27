import { seedAdmin } from "./lib/seed";
import { pool } from "@workspace/db";

try {
  await seedAdmin();
} finally {
  await pool.end();
}
