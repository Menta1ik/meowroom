-- Add English title and description columns to expenses table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'title_en') THEN
        ALTER TABLE expenses ADD COLUMN title_en text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'description_en') THEN
        ALTER TABLE expenses ADD COLUMN description_en text;
    END IF;
END $$;
