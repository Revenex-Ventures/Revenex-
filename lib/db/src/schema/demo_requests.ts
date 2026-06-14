import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const demoRequestsTable = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  schoolName: text("school_name").notNull(),
  type: text("type"),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city"),
  students: text("students"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DemoRequest = typeof demoRequestsTable.$inferSelect;
