-- Update the constraint on bento_items table to include 'gmail' as a valid type
ALTER TABLE bento_items 
  DROP CONSTRAINT IF EXISTS bento_items_type_check;

ALTER TABLE bento_items 
  ADD CONSTRAINT bento_items_type_check 
  CHECK (type IN ('photo', 'calendar', 'youtube', 'links', 'screenshots', 'contacts', 'websites', 'gmail'));

-- Add a comment explaining the update
COMMENT ON CONSTRAINT bento_items_type_check ON bento_items 
  IS 'Ensures that the type column only contains valid bento item types'; 