-- Drop the overly permissive policy if it exists
DROP POLICY IF EXISTS "Anyone can submit adoption requests" ON "adoption_requests";

-- Create a stricter policy that ensures new requests always start as 'pending'
CREATE POLICY "Anyone can submit adoption requests" ON "adoption_requests"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (status = 'pending');
