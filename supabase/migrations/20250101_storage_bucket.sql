-- Create a new public bucket for cats
INSERT INTO storage.buckets (id, name, public)
VALUES ('cats', 'cats', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cats' );

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cats' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can update images
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cats' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cats' 
  AND auth.role() = 'authenticated'
);
