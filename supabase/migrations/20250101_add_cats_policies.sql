-- Policy: Authenticated users can insert cats
CREATE POLICY "Authenticated users can insert cats" ON cats
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update cats
CREATE POLICY "Authenticated users can update cats" ON cats
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete cats
CREATE POLICY "Authenticated users can delete cats" ON cats
  FOR DELETE USING (auth.role() = 'authenticated');
