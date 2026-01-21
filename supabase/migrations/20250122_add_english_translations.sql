-- Add English translation columns to fundraisings table
ALTER TABLE fundraisings 
ADD COLUMN IF NOT EXISTS title_en text, 
ADD COLUMN IF NOT EXISTS description_en text;

-- Add English translation columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS title_en text, 
ADD COLUMN IF NOT EXISTS description_en text;

-- Add English translation columns to cats table
ALTER TABLE cats 
ADD COLUMN IF NOT EXISTS name_en text, 
ADD COLUMN IF NOT EXISTS history_en text;
