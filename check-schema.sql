-- SQL query to check the schema of the workspaces table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workspaces';

-- You can run this in the Supabase SQL Editor to see the actual column names 