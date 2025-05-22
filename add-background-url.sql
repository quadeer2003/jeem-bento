-- Add the background_url column to the workspaces table
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS background_url TEXT;

-- Add comment
COMMENT ON COLUMN workspaces.background_url IS 'URL for the workspace background image'; 