-- Add paused status to check constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check 
  CHECK (status IN ('draft', 'pending_payment', 'pending_review', 'approved', 'rejected', 'paused', 'archived', 'sold'));

-- Add sold_price column
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS sold_price integer;

-- Fix the trigger to allow sellers to change to allowed statuses
CREATE OR REPLACE FUNCTION protect_listing_admin_fields()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    -- Protect admin-only fields
    NEW.is_featured = OLD.is_featured;
    NEW.featured_until = OLD.featured_until;
    NEW.views_count = OLD.views_count;
    NEW.contacts_count = OLD.contacts_count;
    NEW.paid_at = OLD.paid_at;
    NEW.approved_at = OLD.approved_at;
    
    -- Sellers can only transition to these statuses
    IF NEW.status != OLD.status THEN
      -- Allowed seller transitions
      IF NOT (
        (OLD.status = 'approved' AND NEW.status IN ('sold', 'paused', 'archived')) OR
        (OLD.status = 'paused' AND NEW.status IN ('approved', 'archived')) OR
        (OLD.status = 'draft' AND NEW.status IN ('pending_review', 'archived')) OR
        (OLD.status = 'rejected' AND NEW.status IN ('draft', 'archived')) OR
        (OLD.status = 'sold' AND NEW.status IN ('archived')) OR
        (OLD.status IN ('draft', 'paused', 'archived') AND NEW.status = 'draft')
      ) THEN
        NEW.status = OLD.status; -- block invalid transition
      END IF;
    END IF;
    
    -- Re-moderation: if key fields changed on approved listing
    IF OLD.status = 'approved' AND NEW.status = 'approved' AND (
      NEW.make != OLD.make OR NEW.model != OLD.model OR
      NEW.year != OLD.year OR NEW.price != OLD.price OR
      NEW.description != OLD.description
    ) THEN
      NEW.status = 'pending_review';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
