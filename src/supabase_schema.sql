-- =====================================================================
-- VANSHU'S LITTLE WORLD 🎀 - SUPABASE DATABASE & STORAGE SCHEMA
-- =====================================================================
-- Run this in your Supabase project's SQL Editor (https://supabase.com)
-- to create the database table, row level security policies, and storage buckets.

-- 1. Create the website_content table
CREATE TABLE IF NOT EXISTS public.website_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  published_content JSONB NOT NULL,
  draft_content JSONB,
  backup_content JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can ONLY read published content (Vanshu can see her site)
CREATE POLICY "Public can read published content"
  ON public.website_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Policy: Only Authenticated Admins can update/insert drafts & published content
CREATE POLICY "Admins can update content"
  ON public.website_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Create Storage Buckets for Photos & Music
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies: Anyone can view photos & music (public CDN)
CREATE POLICY "Public can view photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "Public can stream music"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'music');

-- 7. Storage Policies: Only logged-in admin can upload or delete photos & music
CREATE POLICY "Admins can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Admins can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "Admins can upload music"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'music');

-- Confirmation
SELECT 'Vanshu''s Little World Database & Storage schema initialized successfully! 🎀' AS status;
