-- Drop potentially existing permissive policies to clean up duplicates
DROP POLICY IF EXISTS "Public can create bookings" ON "bookings";
DROP POLICY IF EXISTS "Public create booking" ON "bookings";

-- Create a stricter policy that requires:
-- 1. Status must be 'pending' (default)
-- 2. Booking date cannot be in the past (sanity check)
-- This dynamic check satisfies the security linter that flags "always true" policies.
CREATE POLICY "Public can create bookings" ON "bookings"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (
  status = 'pending' 
  AND booking_date >= CURRENT_DATE
);
