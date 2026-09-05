-- SXOPOP Short Link Service - Supabase Schema

CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE links ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON links;
DROP POLICY IF EXISTS "Public insert" ON links;
DROP POLICY IF EXISTS "Public update clicks" ON links;

CREATE POLICY "Public read" ON links FOR SELECT USING (true);
CREATE POLICY "Public insert" ON links FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update clicks" ON links FOR UPDATE USING (true);
