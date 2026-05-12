CREATE OR REPLACE FUNCTION increment_views(listing_slug text)
RETURNS void AS $$
  UPDATE public.listings SET views_count = views_count + 1 WHERE slug = listing_slug;
$$ LANGUAGE sql SECURITY DEFINER;
