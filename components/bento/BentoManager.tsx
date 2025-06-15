"use client";

import { BentoItem, BentoItemType } from "@/lib/types";
import { useState, useEffect } from "react";
import BentoGrid from "../bento/BentoGrid";
import { createBentoItem, deleteBentoItem, getBentoItems, updateBentoItem } from "@/lib/db";
import { Calendar, Contact, ExternalLink, Globe, Image, Loader2, Plus, Youtube, Clock, Quote, Mail, CloudSun, RssIcon, FileText } from "lucide-react";

interface BentoManagerProps {
  workspaceId: string;
}

// Define default column spans for different item types
const getDefaultColumnSpan = (type: BentoItemType): number => {
  switch (type) {
    case 'photo':
      return 1;
    case 'calendar':
      return 2;
    case 'youtube':
      return 1;
    case 'screenshots':
      return 2;
    case 'links':
      return 1;
    case 'contacts':
      return 1;
    case 'websites':
      return 1;
    case 'pomodoro':
      return 1;
    case 'quote':
      return 1;
    case 'quickmail':
      return 1;
    case 'weather':
      return 1;
    case 'rssfeed':
      return 2;
    case 'notes':
      return 2;
    default:
      return 1;
  }
};

// Define default row spans for different item types
const getDefaultRowSpan = (type: BentoItemType): number => {
  switch (type) {
    case 'quote':
      return 0.5; // Half height for quotes
    default:
      return 1;
  }
};

export default function BentoManager({ workspaceId }: BentoManagerProps) {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await getBentoItems(workspaceId);
        setItems(fetchedItems);
      } catch (err) {
        console.error("Error loading items:", err);
        setError("Failed to load bento items");
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [workspaceId]);

  const handleItemUpdate = async (updatedItem: BentoItem) => {
    try {
      const result = await updateBentoItem(updatedItem.id, updatedItem);
      if (result) {
        setItems(items.map(item => item.id === updatedItem.id ? result : item));
      }
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item");
    }
  };

  const handleItemDelete = async (itemId: string) => {
    try {
      const success = await deleteBentoItem(itemId);
      if (success) {
        setItems(items.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  const handleItemLockToggle = async (itemId: string, isLocked: boolean) => {
    try {
      const item = items.find(item => item.id === itemId);
      if (item) {
        const updatedItem = { ...item, isLocked };
        const result = await updateBentoItem(itemId, { isLocked });
        if (result) {
          setItems(items.map(item => item.id === itemId ? { ...item, isLocked } : item));
        }
      }
    } catch (err) {
      console.error("Error toggling item lock:", err);
      setError("Failed to update item lock state");
    }
  };

  // This function is now exported through WorkspacePage to be used from Sidebar
  const handleAddItem = async (itemType: BentoItemType, title?: string) => {
    try {
      // Get default column span based on item type
      const columnSpan = getDefaultColumnSpan(itemType);
      // Get default row span based on item type
      const rowSpan = getDefaultRowSpan(itemType);
      
      // Find a suitable position for the new item that doesn't overlap with existing items
      let posX = 0;
      let posY = 0;
      
      if (items.length > 0) {
        // Create a grid representation to track occupied cells
        const gridOccupancy = new Array(20).fill(0).map(() => new Array(4).fill(false));
        
        // Mark occupied cells in the grid
        items.forEach(item => {
          if (item.position) {
            const x = item.position.x || 0;
            const y = item.position.y || 0;
            const w = item.position.w || 1;
            const h = item.position.h || 1;
            
            // Mark all cells this item occupies as taken
            for (let i = y; i < y + h; i++) {
              for (let j = x; j < x + w; j++) {
                if (i < gridOccupancy.length && j < 4) {
                  gridOccupancy[i][j] = true;
                }
              }
            }
          }
        });
        
        // Find first available position that fits the new item
        let found = false;
        for (let y = 0; y < gridOccupancy.length && !found; y++) {
          for (let x = 0; x <= 4 - columnSpan && !found; x++) {
            // Check if all required cells are free
            let canFit = true;
            for (let i = 0; i < rowSpan; i++) {
              for (let j = 0; j < columnSpan; j++) {
                if (y + i >= gridOccupancy.length || x + j >= 4 || gridOccupancy[y + i][x + j]) {
                  canFit = false;
                  break;
                }
              }
              if (!canFit) break;
            }
            
            if (canFit) {
              posX = x;
              posY = y;
              found = true;
            }
          }
        }
        
        // If no space found, place at the bottom
        if (!found) {
          // Find the item with the highest y + h value
          const maxY = items.reduce((max, item) => {
            const bottom = (item.position?.y || 0) + (item.position?.h || 1);
            return bottom > max ? bottom : max;
          }, 0);
          
          posY = maxY;
        }
      }
      
      const newItem: Omit<BentoItem, "id"> = {
        type: itemType,
        content: {},
        position: {
          x: posX,
          y: posY,
          w: columnSpan,
          h: rowSpan
        },
        workspaceId
      };

      // Only add title if it's not empty
      if (title) {
        newItem.title = title;
      }

      const createdItem = await createBentoItem(newItem);
      if (createdItem) {
        setItems([...items, createdItem]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item");
      return false;
    }
  };

  const getItemTypeIcon = (type: BentoItemType) => {
    switch (type) {
      case "photo":
        return <Image size={20} />;
      case "calendar":
        return <Calendar size={20} />;
      case "youtube":
        return <Youtube size={20} />;
      case "links":
        return <ExternalLink size={20} />;
      case "screenshots":
        return <Image size={20} />;
      case "contacts":
        return <Contact size={20} />;
      case "websites":
        return <Globe size={20} />;
      case "pomodoro":
        return <Clock size={20} />;
      case "quote":
        return <Quote size={20} />;
      case "quickmail":
        return <Mail size={20} />;
      case "weather":
        return <CloudSun size={20} />;
      case "rssfeed":
        return <RssIcon size={20} />;
      case "notes":
        return <FileText size={20} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center p-8 bg-secondary/20 rounded-lg">
          <p className="text-lg mb-4">Your bento grid is empty</p>
          <p className="text-sm text-muted-foreground">
            Click the pencil icon on your workspace in the sidebar to add your first item.
          </p>
        </div>
      ) : (
        <BentoGrid
          items={items}
          onItemUpdate={handleItemUpdate}
          onItemDelete={handleItemDelete}
          onItemLockToggle={handleItemLockToggle}
          editable={true}
        />
      )}
    </div>
  );
}

// Export the addItem function to be used by WorkspacePage
export const createBentoGridItem = async (
  workspaceId: string,
  itemType: BentoItemType,
  title?: string
): Promise<BentoItem | null> => {
  try {
    // Get default column span based on item type
    const columnSpan = getDefaultColumnSpan(itemType);
    // Get default row span based on item type
    const rowSpan = getDefaultRowSpan(itemType);
    
    // For positioning, we'll use default values and let the grid handle layout
    const newItem: Omit<BentoItem, "id"> = {
      type: itemType,
      content: {},
      position: {
        x: 0,
        y: 0,
        w: columnSpan,
        h: rowSpan
      },
      workspaceId
    };

    // Only add title if it's provided
    if (title) {
      newItem.title = title;
    }

    const createdItem = await createBentoItem(newItem);
    return createdItem || null;
  } catch (err) {
    console.error("Error creating bento item:", err);
    return null;
  }
}; 