-- Create cats table
CREATE TABLE IF NOT EXISTS cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view cats
CREATE POLICY "Public cats are viewable by everyone" ON cats
  FOR SELECT USING (true);

-- Policy: Allow anon insert for seeding (temporary, should be restricted later)
-- OR just rely on service_role for seeding if done via backend scripts, 
-- but here we might run SQL directly.
-- Let's allow anon insert for now to easy setup if we want to seed from client, 
-- but actually I will insert via SQL migration for the initial data.

-- Create adoption_requests table
CREATE TABLE IF NOT EXISTS adoption_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID REFERENCES cats(id),
  type TEXT NOT NULL, -- 'adopt' or 'guardian'
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a request
CREATE POLICY "Anyone can submit adoption requests" ON adoption_requests
  FOR INSERT WITH CHECK (true);

-- Policy: Service role (admin) can view all
-- (Implicit)
