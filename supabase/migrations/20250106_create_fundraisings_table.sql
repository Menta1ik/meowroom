CREATE TABLE fundraisings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  jar_link TEXT,
  jar_id TEXT,
  card_number TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE fundraisings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active fundraisings" ON fundraisings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage fundraisings" ON fundraisings 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert the current urgent fundraising as initial data
INSERT INTO fundraisings (title, description, target_amount, current_amount, jar_link, jar_id, card_number, image_url, is_active)
VALUES (
  'Лікування котика Джордана',
  'Терміновий збір на операцію та реабілітацію. Котик постраждав від...',
  35000,
  9450,
  'https://send.monobank.ua/jar/89zjWt9p7P',
  '89zjWt9p7P', -- extracted from link
  '4874 1000 2241 5460',
  '/jordan-after.jpg',
  true
);
