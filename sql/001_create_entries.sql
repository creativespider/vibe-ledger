CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project text NOT NULL,
  type text NOT NULL CHECK (type IN ('UI','API','test','security')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
