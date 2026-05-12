-- Saved searches
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  last_alerted_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);

-- Add buyer_user_id to inquiries for linking
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS buyer_user_id uuid REFERENCES public.profiles(id);

-- RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own searches' AND tablename = 'saved_searches'
  ) THEN
    CREATE POLICY "Users manage own searches" ON public.saved_searches FOR ALL USING (auth.uid() = user_id);
  END IF;
END
$$;
