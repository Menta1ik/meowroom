-- Add English translation columns to fundraisings table if they don't exist
ALTER TABLE fundraisings 
ADD COLUMN IF NOT EXISTS title_en text, 
ADD COLUMN IF NOT EXISTS description_en text;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
