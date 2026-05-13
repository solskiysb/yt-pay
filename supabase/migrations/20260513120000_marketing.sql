-- Priority car models for SEO/content
CREATE TABLE IF NOT EXISTS public.models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  generation text,
  years text,
  slug text UNIQUE NOT NULL,
  priority int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Seller leads CRM
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text,
  url text,
  raw_text text,
  detected_make text,
  detected_model text,
  country text,
  language text DEFAULT 'en',
  score int DEFAULT 0,
  status text DEFAULT 'new' CHECK (status IN ('new','scored','contacted','replied','converted','rejected')),
  ai_summary text,
  recommended_angle text,
  created_at timestamptz DEFAULT now()
);

-- Buyer alerts (separate from saved_searches — simpler, for marketing)
CREATE TABLE IF NOT EXISTS public.buyer_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  make text,
  model text,
  country text,
  language text DEFAULT 'en',
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Price observations for market intelligence
CREATE TABLE IF NOT EXISTS public.price_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text,
  make text NOT NULL,
  model text NOT NULL,
  year int,
  price int,
  currency text DEFAULT 'EUR',
  country text,
  url text,
  observed_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Models are public" ON public.models FOR SELECT USING (true);
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can create buyer alert" ON public.buyer_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage alerts" ON public.buyer_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Price observations are public" ON public.price_observations FOR SELECT USING (true);
