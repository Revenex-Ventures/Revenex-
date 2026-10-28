import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function seedAdmin(): Promise<void> {
  const adminEmail = (
    process.env["ADMIN_EMAIL"] ?? "team@revenex.in"
  ).toLowerCase();
  const adminPassword = (process.env["ADMIN_PASSWORD"] ?? "").trim();
  try {
    if (
      adminPassword &&
      (adminPassword.length < 12 || Buffer.byteLength(adminPassword) > 72)
    )
      throw new Error("ADMIN_PASSWORD must be 12–72 UTF-8 bytes");
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, adminEmail));
    if (existing) {
      // Bootstrap never changes an existing account's password or role.
      logger.info(
        { role: existing.role },
        "Admin bootstrap account already exists; leaving credentials unchanged",
      );
    } else {
      if (!adminPassword) {
        logger.warn("ADMIN_PASSWORD not set; skipping admin bootstrap");
        return;
      }
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await db.insert(usersTable).values({
        name: "REVENEX Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
        provider: "email",
      });
      logger.info("Admin user created successfully");
    }
  } catch (err) {
    logger.error({ err }, "Admin bootstrap failed");
    throw err;
  }
}
