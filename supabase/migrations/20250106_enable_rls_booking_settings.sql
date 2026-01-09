-- Enable RLS for booking_settings
ALTER TABLE "booking_settings" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access for everyone
CREATE POLICY "Enable read access for all users" ON "booking_settings"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Policy: Allow write access for authenticated users only
CREATE POLICY "Enable insert for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
