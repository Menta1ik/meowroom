-- Add receipt_urls column to expenses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'receipt_urls') THEN
        ALTER TABLE expenses ADD COLUMN receipt_urls text[] DEFAULT array[]::text[];
    END IF;
END $$;
