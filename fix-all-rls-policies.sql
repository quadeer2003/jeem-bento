-- Fix RLS policies for calendar_events table
DROP POLICY IF EXISTS "Users can view their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can insert their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete their own calendar events" ON calendar_events;

CREATE POLICY "Users can view their own calendar events" 
ON calendar_events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = calendar_events.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own calendar events" 
ON calendar_events FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = calendar_events.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own calendar events" 
ON calendar_events FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = calendar_events.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own calendar events" 
ON calendar_events FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = calendar_events.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

-- Fix RLS policies for contacts table
DROP POLICY IF EXISTS "Users can view their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON contacts;

CREATE POLICY "Users can view their own contacts" 
ON contacts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = contacts.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own contacts" 
ON contacts FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = contacts.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own contacts" 
ON contacts FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = contacts.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own contacts" 
ON contacts FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = contacts.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

-- Fix RLS policies for links table
DROP POLICY IF EXISTS "Users can view their own links" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;

CREATE POLICY "Users can view their own links" 
ON links FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = links.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own links" 
ON links FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = links.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own links" 
ON links FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = links.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own links" 
ON links FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = links.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

-- Fix RLS policies for screenshots table
DROP POLICY IF EXISTS "Users can view their own screenshots" ON screenshots;
DROP POLICY IF EXISTS "Users can insert their own screenshots" ON screenshots;
DROP POLICY IF EXISTS "Users can update their own screenshots" ON screenshots;
DROP POLICY IF EXISTS "Users can delete their own screenshots" ON screenshots;

CREATE POLICY "Users can view their own screenshots" 
ON screenshots FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = screenshots.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own screenshots" 
ON screenshots FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = screenshots.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own screenshots" 
ON screenshots FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = screenshots.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own screenshots" 
ON screenshots FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = screenshots.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

-- Fix RLS policies for websites table
DROP POLICY IF EXISTS "Users can view their own websites" ON websites;
DROP POLICY IF EXISTS "Users can insert their own websites" ON websites;
DROP POLICY IF EXISTS "Users can update their own websites" ON websites;
DROP POLICY IF EXISTS "Users can delete their own websites" ON websites;

CREATE POLICY "Users can view their own websites" 
ON websites FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = websites.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own websites" 
ON websites FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = websites.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own websites" 
ON websites FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = websites.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own websites" 
ON websites FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bento_items
    JOIN workspaces ON bento_items.workspaceid = workspaces.id
    WHERE bento_items.id = websites.bentoitemid
    AND workspaces.user_id = auth.uid()
  )
); 