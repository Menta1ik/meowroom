-- Enable RLS on bookings (ensure it is on)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflict
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

-- Re-create the policy
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Also ensure admins have access
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
