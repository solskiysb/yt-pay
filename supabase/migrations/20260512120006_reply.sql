-- Add reply columns to inquiries
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS seller_reply text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS replied_at timestamptz;

-- Update status check to include 'replied'
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check
  CHECK (status IN ('new', 'read', 'replied', 'archived'));
