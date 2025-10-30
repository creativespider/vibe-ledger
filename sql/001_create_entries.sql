CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project text NOT NULL,
  type text NOT NULL CHECK (type IN ('UI','API','test','security')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
-- Ensure extended columns exist for richer entries
ALTER TABLE entries
  ADD COLUMN IF NOT EXISTS prompt   text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ai_draft text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS edits    text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS why      text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS evidence text NOT NULL DEFAULT '';
