-- Drop permissive policies
DROP POLICY IF EXISTS "Public can create bookings" ON "bookings";
DROP POLICY IF EXISTS "Public create booking" ON "bookings";

-- Create stricter policy
CREATE POLICY "Public can create bookings" ON "bookings"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (status = 'pending');
