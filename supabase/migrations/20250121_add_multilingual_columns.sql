-- Add English translation columns to fundraisings table
ALTER TABLE fundraisings 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English translation columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;
