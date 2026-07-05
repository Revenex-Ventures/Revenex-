import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  institution: text("institution"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Contact = typeof contactsTable.$inferSelect;
