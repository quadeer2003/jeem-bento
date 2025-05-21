-- SQL query to make the title column optional in the bento_items table
ALTER TABLE bento_items ALTER COLUMN title DROP NOT NULL;

-- If you also need to make title optional in other related tables
ALTER TABLE calendar_events ALTER COLUMN title DROP NOT NULL;
ALTER TABLE links ALTER COLUMN title DROP NOT NULL;
ALTER TABLE screenshots ALTER COLUMN title DROP NOT NULL;
ALTER TABLE websites ALTER COLUMN title DROP NOT NULL;
ALTER TABLE contacts ALTER COLUMN title DROP NOT NULL;

-- Verify changes
SELECT table_name, column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('bento_items', 'calendar_events', 'links', 'screenshots', 'websites', 'contacts') 
AND column_name = 'title'; 