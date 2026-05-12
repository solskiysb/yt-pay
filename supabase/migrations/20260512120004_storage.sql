-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage
CREATE POLICY "Anyone can view listing photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
