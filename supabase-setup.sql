-- Run this in: Supabase Dashboard → SQL Editor → New query

-- 1. User usage table
CREATE TABLE IF NOT EXISTS user_usage (
  email         TEXT PRIMARY KEY,
  count         INTEGER NOT NULL DEFAULT 0,
  signed_up_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Row-level security (only service role can read/write — never exposed to browser)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (your server uses this)
CREATE POLICY "service_role_all" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

-- 3. (Optional) Migrate existing data from data/usage.json manually:
-- INSERT INTO user_usage (email, count) VALUES ('user@example.com', 2) ON CONFLICT DO NOTHING;
