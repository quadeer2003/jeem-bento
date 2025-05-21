import { createClient } from "@/utils/supabase/client";
import { BentoItem, CalendarEvent, Contact, Link, Screenshot, Website, Workspace } from "./types";

// Workspace functions
export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error fetching workspaces:', error);
      }
      return [];
    }

    // Map snake_case to camelCase
    return data.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      userId: workspace.user_id,
      createdAt: workspace.created_at,
      updatedAt: workspace.updated_at
    })) as Workspace[];
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in getUserWorkspaces:', err);
    }
    return [];
  }
}

export async function createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .insert([{ 
        name: workspace.name, 
        user_id: workspace.userId
      }])
      .select()
      .single();

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error creating workspace:', error);
      }
      return null;
    }

    // Map snake_case to camelCase
    if (data) {
      return {
        id: data.id,
        name: data.name,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Workspace;
    }

    return null;
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in createWorkspace:', err);
    }
    return null;
  }
}

// Bento item functions
export async function getBentoItems(workspaceId: string): Promise<BentoItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bento_items')
      .select('*')
      .eq('workspaceid', workspaceId);

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error fetching bento items:', error);
      }
      return [];
    }

    // Map database columns to our TypeScript interface
    return data.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      content: item.content,
      position: item.position,
      workspaceId: item.workspaceid,
      isLocked: item.is_locked || false
    })) as BentoItem[];
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in getBentoItems:', err);
    }
    return [];
  }
}

export async function createBentoItem(item: Omit<BentoItem, 'id'>): Promise<BentoItem | null> {
  try {
    const supabase = createClient();
    
    // Create the item data with optional title
    const itemData: any = {
      type: item.type,
      content: item.content,
      position: item.position,
      workspaceid: item.workspaceId
    };
    
    // Only add title if it exists
    if (item.title) {
      itemData.title = item.title;
    }
    
    // Add isLocked if it exists
    if (item.isLocked !== undefined) {
      itemData.is_locked = item.isLocked;
    }
    
    const { data, error } = await supabase
      .from('bento_items')
      .insert([itemData])
      .select()
      .single();

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error creating bento item:', error);
      }
      return null;
    }

    // Map database columns to our TypeScript interface
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content,
      position: data.position,
      workspaceId: data.workspaceid,
      isLocked: data.is_locked || false
    } as BentoItem;
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in createBentoItem:', err);
    }
    return null;
  }
}

export async function updateBentoItem(id: string, item: Partial<BentoItem>): Promise<BentoItem | null> {
  try {
    const supabase = createClient();
    
    // Convert workspaceId to workspaceid if it exists in the item
    const dbItem: any = { ...item };
    if (item.workspaceId !== undefined) {
      dbItem.workspaceid = item.workspaceId;
      delete dbItem.workspaceId;
    }
    
    // Convert isLocked to is_locked if it exists
    if (item.isLocked !== undefined) {
      dbItem.is_locked = item.isLocked;
      delete dbItem.isLocked;
    }
    
    const { data, error } = await supabase
      .from('bento_items')
      .update(dbItem)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error updating bento item:', error);
      }
      return null;
    }

    // Map database columns to our TypeScript interface
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content,
      position: data.position,
      workspaceId: data.workspaceid,
      isLocked: data.is_locked || false
    } as BentoItem;
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in updateBentoItem:', err);
    }
    return null;
  }
}

export async function deleteBentoItem(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bento_items')
      .delete()
      .eq('id', id);

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error deleting bento item:', error);
      }
      return false;
    }

    return true;
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in deleteBentoItem:', err);
    }
    return false;
  }
}

// Calendar events
export async function getCalendarEvents(bentoItemId: string): Promise<CalendarEvent[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('bentoitemid', bentoItemId);

    if (error) {
      if (typeof window !== 'undefined') {
        console.error('Error fetching calendar events:', error);
      }
      return [];
    }

    // Map database columns to our TypeScript interface
    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      bentoItemId: event.bentoitemid
    })) as CalendarEvent[];
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('Error in getCalendarEvents:', err);
    }
    return [];
  }
}

// Other specific item type functions can be added as needed 