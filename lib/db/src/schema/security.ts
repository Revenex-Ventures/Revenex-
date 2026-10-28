import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const authSessionsTable = pgTable(
  "auth_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("auth_sessions_expiry_idx").on(table.expiresAt)],
);

export const requestLimitsTable = pgTable(
  "request_limits",
  {
    key: text("key").primaryKey(),
    hits: integer("hits").notNull(),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("request_limits_expiry_idx").on(table.resetAt)],
);
