import { newDb } from "pg-mem";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../../lib/db/src/schema";
export * from "../../../lib/db/src/schema";

// Isolated PostgreSQL emulator: tests never load .env or connect to a real database.
const memory = newDb();
memory.public.none(`
  CREATE TABLE users (id serial PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE,
    password_hash text, phone text, school text, provider text NOT NULL DEFAULT 'email', google_id text,
    role text NOT NULL DEFAULT 'user', reset_token text, reset_token_expiry timestamptz,
    last_login timestamptz, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE reviews (id serial PRIMARY KEY, name text NOT NULL, role text NOT NULL, school text NOT NULL,
    content text NOT NULL, rating integer NOT NULL, approved boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE contacts (id serial PRIMARY KEY, name text NOT NULL, email text NOT NULL, institution text,
    subject text, message text NOT NULL, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE demo_requests (id serial PRIMARY KEY, name text NOT NULL, school_name text NOT NULL, type text,
    email text NOT NULL, phone text, city text, students text, preferred_date text, preferred_time text,
    message text, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE auth_sessions (token_hash text PRIMARY KEY, user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL);
  CREATE TABLE request_limits (key text PRIMARY KEY, hits integer NOT NULL, reset_at timestamptz NOT NULL);
`);
const { Pool } = memory.adapters.createPg();
export const pool = new Pool();
const query = pool.query.bind(pool);
pool.query = async (config: any, values?: any) => {
  const arrayMode = config?.rowMode === "array";
  const result = await query(
    typeof config === "string"
      ? config
      : { text: config.text, values: config.values },
    values,
  );
  if (arrayMode)
    result.rows = result.rows.map((row: Record<string, unknown>) =>
      Object.values(row),
    );
  return result;
};
export const db = drizzle(pool, { schema });
