-- Recreate cats table with new structure
DROP TABLE IF EXISTS cats CASCADE;

CREATE TABLE cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  history TEXT NOT NULL, -- вместо description
  tags TEXT[] DEFAULT '{}', -- характер (мультивыбор)
  images TEXT[] DEFAULT '{}', -- массив фото (до 10)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view cats
CREATE POLICY "Public cats are viewable by everyone" ON cats
  FOR SELECT USING (true);

-- Re-seed data with new structure (converting old single image to array)
INSERT INTO cats (name, age, gender, history, images, tags) VALUES
('Барсик', '2 года', 'Мальчик', 'Ласковый и спокойный кот, который обожает спать на коленях. Идеальный компаньон для уютных вечеров.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Cute%20fluffy%20tabby%20cat%20portrait%2C%20soft%20lighting%2C%20bokeh%20background%2C%20high%20resolution&image_size=square'], ARRAY['Ласковый', 'Спокойный', 'Привит']),
('Муся', '1.5 года', 'Девочка', 'Игривая и любопытная кошечка. Любит охотиться за игрушечными мышками и исследовать новые места.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Playful%20calico%20cat%20jumping%20for%20a%20toy%2C%20dynamic%20pose%2C%20bright%20colors&image_size=square'], ARRAY['Игривая', 'Активная', 'Стерилизована']),
('Рыжик', '3 года', 'Мальчик', 'Солнечный кот с большим сердцем. Очень общительный и всегда встречает гостей у двери.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Orange%20ginger%20cat%20looking%20at%20camera%20with%20big%20green%20eyes%2C%20sunlight%2C%20cozy&image_size=square'], ARRAY['Общительный', 'Добрый', 'Привит']),
('Луна', '1 год', 'Девочка', 'Немного застенчивая, но дуже преданная. Ей нужно немного времени, чтобы привыкнуть, но потом она не отойдет от вас ни на шаг.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Elegant%20black%20cat%20sitting%20gracefully%2C%20mysterious%20atmosphere%2C%20sharp%20focus&image_size=square'], ARRAY['Застенчивая', 'Верная', 'Стерилизована']),
('Саймон', '4 года', 'Мальчик', 'Мудрый и важный кот. Любит наблюдать за происходящим с высокой полки. Не навязчив, но ценит внимание.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Fluffy%20grey%20cat%20sleeping%20on%20a%20blue%20cushion%2C%20peaceful%2C%20close%20up&image_size=square'], ARRAY['Спокойный', 'Независимый', 'Привит']),
('Белла', '6 месяцев', 'Девочка', 'Маленький ураган энергии. Ей все интересно, все нужно потрогать и везде залезть.', ARRAY['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=White%20kitten%20with%20blue%20eyes%20playing%20in%20a%20basket%2C%20adorable%2C%20soft%20colors&image_size=square'], ARRAY['Котенок', 'Активная', 'Любопытная']);

-- Recreate adoption_requests link because we dropped cats
-- Ideally adoption_requests should have ON DELETE CASCADE or similar, but for dev now let's ensure it exists
-- The previous table 'adoption_requests' references 'cats'. Dropping cats with CASCADE might have dropped the constraint or the table if it depended on it? 
-- Postgres DROP TABLE CASCADE removes dependent constraints. The table 'adoption_requests' stays but the FK constraint is gone.
-- Let's re-add the constraint.

ALTER TABLE adoption_requests 
  DROP CONSTRAINT IF EXISTS adoption_requests_cat_id_fkey,
  ADD CONSTRAINT adoption_requests_cat_id_fkey 
  FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE SET NULL;
