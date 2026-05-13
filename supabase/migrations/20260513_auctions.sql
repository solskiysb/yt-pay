-- Add auction fields to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'classified' CHECK (listing_type IN ('classified', 'auction'));
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS auction_end timestamptz;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS reserve_price integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS reserve_met boolean DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS starting_bid integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS current_bid integer DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS bid_count integer DEFAULT 0;

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  bidder_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bids_listing ON public.bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON public.bids(bidder_id);

-- RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bids are viewable on approved listings" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can bid" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);
