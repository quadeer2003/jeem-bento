-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  bento_item_id UUID NOT NULL REFERENCES bento_items(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS notes_bento_item_id_idx ON notes(bento_item_id);
CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON notes(updated_at);

-- Enable RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for notes
CREATE POLICY "Users can only access notes in their workspaces" ON notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bento_items bi
      JOIN workspaces w ON bi.workspaceid = w.id
      WHERE bi.id = notes.bento_item_id
      AND w.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
