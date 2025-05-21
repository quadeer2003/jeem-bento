-- SQL query to check the schema of the bento_items table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bento_items';

-- You can run this in the Supabase SQL Editor to see the actual column names 