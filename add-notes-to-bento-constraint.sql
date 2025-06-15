-- Add 'notes' to the bento_items type check constraint
-- First, let's see the current constraint and then update it

-- Drop the existing check constraint
ALTER TABLE bento_items DROP CONSTRAINT IF EXISTS bento_items_type_check;

-- Add the new check constraint that includes 'notes'
ALTER TABLE bento_items ADD CONSTRAINT bento_items_type_check 
CHECK (type IN (
  'photo', 
  'calendar', 
  'youtube', 
  'links', 
  'screenshots', 
  'contacts', 
  'websites',
  'pomodoro',
  'quote',
  'quickmail',
  'weather',
  'rssfeed',
  'notes'
));
