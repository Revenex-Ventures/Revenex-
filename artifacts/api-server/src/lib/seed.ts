import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function seedAdmin(): Promise<void> {
  const adminEmail = (process.env["ADMIN_EMAIL"] ?? "team@revenex.in").toLowerCase();
  const adminPassword = "Revenex@2205";
  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail));
    if (existing) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await db.update(usersTable)
        .set({ role: "admin", passwordHash })
        .where(eq(usersTable.id, existing.id));
      logger.info({ email: adminEmail }, "Admin user verified and password synced");
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await db.insert(usersTable).values({
        name: "REVENEX Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
        provider: "email",
      });
      logger.info({ email: adminEmail }, "Admin user created successfully");
    }
  } catch (err) {
    logger.warn({ err }, "Admin seed failed (non-fatal)");
  }
}
