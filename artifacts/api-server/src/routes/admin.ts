import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable, reviewsTable, contactsTable, demoRequestsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router: IRouter = Router();
const JWT_SECRET = process.env["SESSION_SECRET"] ?? "revenex-secret-key";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token =
    (req.cookies?.["revenex_auth"] as string | undefined) ??
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      name: string;
      role?: string;
    };
    if (payload.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    (req as Request & { adminUser?: typeof payload }).adminUser = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}

router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [[users], [reviews], [contacts], [demos]] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db.select({ count: count() }).from(reviewsTable),
      db.select({ count: count() }).from(contactsTable),
      db.select({ count: count() }).from(demoRequestsTable),
    ]);
    res.json({
      users: users?.count ?? 0,
      reviews: reviews?.count ?? 0,
      contacts: contacts?.count ?? 0,
      demos: demos?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Admin stats error");
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/admin/contacts", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Admin contacts fetch error");
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

router.patch("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  if (!status) { res.status(400).json({ message: "status required" }); return; }
  try {
    const [row] = await db.update(contactsTable).set({ status }).where(eq(contactsTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin contact update error");
    res.status(500).json({ message: "Failed to update contact" });
  }
});

router.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  try {
    await db.delete(contactsTable).where(eq(contactsTable.id, id));
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Admin contact delete error");
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

router.get("/admin/demos", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(demoRequestsTable).orderBy(desc(demoRequestsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Admin demos fetch error");
    res.status(500).json({ message: "Failed to fetch demos" });
  }
});

router.patch("/admin/demos/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  if (!status) { res.status(400).json({ message: "status required" }); return; }
  try {
    const [row] = await db.update(demoRequestsTable).set({ status }).where(eq(demoRequestsTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin demo update error");
    res.status(500).json({ message: "Failed to update demo" });
  }
});

router.delete("/admin/demos/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  try {
    await db.delete(demoRequestsTable).where(eq(demoRequestsTable.id, id));
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Admin demo delete error");
    res.status(500).json({ message: "Failed to delete demo" });
  }
});

router.get("/admin/reviews", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Admin reviews fetch error");
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.patch("/admin/reviews/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { approved } = req.body as { approved?: boolean };
  if (typeof approved !== "boolean") { res.status(400).json({ message: "approved boolean required" }); return; }
  try {
    const [row] = await db.update(reviewsTable).set({ approved }).where(eq(reviewsTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin review update error");
    res.status(500).json({ message: "Failed to update review" });
  }
});

router.delete("/admin/reviews/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  try {
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Admin review delete error");
    res.status(500).json({ message: "Failed to delete review" });
  }
});

router.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        provider: usersTable.provider,
        school: usersTable.school,
        createdAt: usersTable.createdAt,
        lastLogin: usersTable.lastLogin,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Admin users fetch error");
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.patch("/admin/users/:id/role", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { role } = req.body as { role?: string };
  if (!role || !["admin", "user"].includes(role)) {
    res.status(400).json({ message: "role must be admin or user" });
    return;
  }
  try {
    const [row] = await db
      .update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role });
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin user role update error");
    res.status(500).json({ message: "Failed to update user role" });
  }
});

export default router;
