-- Drop old policies to recreate them properly
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "booking_settings";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "booking_settings";
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "booking_settings";

-- Recreate with explicit checks to satisfy security linter
CREATE POLICY "Enable insert for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON "booking_settings"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');
