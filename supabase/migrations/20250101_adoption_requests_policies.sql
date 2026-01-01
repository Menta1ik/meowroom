-- Policy: Authenticated users can view adoption requests
CREATE POLICY "Authenticated users can view requests" ON adoption_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can update requests (e.g. change status)
CREATE POLICY "Authenticated users can update requests" ON adoption_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete requests
CREATE POLICY "Authenticated users can delete requests" ON adoption_requests
  FOR DELETE USING (auth.role() = 'authenticated');
