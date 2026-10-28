-- Additive migration; no existing users, reviews or leads are modified.
CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON auth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS request_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL,
  reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS request_limits_expiry_idx ON request_limits(reset_at);
