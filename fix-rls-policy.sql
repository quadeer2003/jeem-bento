-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own bento items" ON bento_items;
DROP POLICY IF EXISTS "Users can insert their own bento items" ON bento_items;
DROP POLICY IF EXISTS "Users can update their own bento items" ON bento_items;
DROP POLICY IF EXISTS "Users can delete their own bento items" ON bento_items;

-- Create new policies with correct column names
CREATE POLICY "Users can view their own bento items" 
ON bento_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM workspaces 
    WHERE workspaces.id = bento_items.workspaceid 
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own bento items" 
ON bento_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces 
    WHERE workspaces.id = bento_items.workspaceid 
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own bento items" 
ON bento_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM workspaces 
    WHERE workspaces.id = bento_items.workspaceid 
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own bento items" 
ON bento_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM workspaces 
    WHERE workspaces.id = bento_items.workspaceid 
    AND workspaces.user_id = auth.uid()
  )
); 