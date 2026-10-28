import { readFile } from "node:fs/promises";
import { pool } from "@workspace/db";

const connect = () => pool.connect();
let connection: Awaited<ReturnType<typeof connect>> | undefined;
try {
  connection = await connect();
  const sql = await readFile(
    new URL(
      "../../../lib/db/migrations/0001_security_state.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await connection.query("BEGIN");
  await connection.query(sql);
  await connection.query("COMMIT");
  console.log("Security tables and indexes are ready.");
} catch {
  await connection?.query("ROLLBACK").catch(() => undefined);
  console.error(
    "Security migration failed. Check database access and schema prerequisites.",
  );
  process.exitCode = 1;
} finally {
  connection?.release();
  await pool.end();
}
