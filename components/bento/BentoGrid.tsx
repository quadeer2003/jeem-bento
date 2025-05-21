"use client";

import { BentoItem, BentoItemType } from "@/lib/types";
import { useState, useEffect } from "react";
import BentoItemComponent from "@/components/bento/BentoItem";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface BentoGridProps {
  items: BentoItem[];
  onItemUpdate?: (item: BentoItem) => void;
  onItemDelete?: (id: string) => void;
  onItemLockToggle?: (id: string, isLocked: boolean) => void;
  editable?: boolean;
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
    default:
      return 1;
  }
};

export default function BentoGrid({ 
  items, 
  onItemUpdate,
  onItemDelete,
  onItemLockToggle,
  editable = true
}: BentoGridProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [layouts, setLayouts] = useState<{ lg: Layout[] }>({ lg: [] });
  const [mounted, setMounted] = useState(false);
  const [lockedItems, setLockedItems] = useState<Record<string, boolean>>({});

  // Handle item deletion with layout updates
  const handleItemDelete = (itemId: string) => {
    if (onItemDelete) {
      onItemDelete(itemId);
      
      // Update layouts to remove the deleted item
      const currentLayouts = layouts.lg || [];
      const updatedLayouts = currentLayouts.filter((layout: Layout) => layout.i !== itemId);
      setLayouts({ lg: updatedLayouts });
      
      // Remove from locked items if present
      if (lockedItems[itemId]) {
        const newLockedItems = { ...lockedItems };
        delete newLockedItems[itemId];
        setLockedItems(newLockedItems);
      }
    }
  };

  // Handle toggling item lock state
  const handleLockToggle = (itemId: string, isLocked: boolean) => {
    setLockedItems(prev => ({
      ...prev,
      [itemId]: isLocked
    }));
    
    // Update the layout to set the item as static if locked
    setLayouts(prev => {
      const updatedLayouts = prev.lg.map(layout => {
        if (layout.i === itemId) {
          return {
            ...layout,
            static: isLocked,
            isDraggable: !isLocked && editable,
            isResizable: !isLocked && editable
          };
        }
        return layout;
      });
      return { lg: updatedLayouts };
    });
  };

  // Initialize layouts once items are loaded
  useEffect(() => {
    setMounted(true);
    
    // Create layout configuration for each item
    const newLayouts = items.map((item) => {
      // Use existing position if available, otherwise create a default
      const columnSpan = getDefaultColumnSpan(item.type);
      const isLocked = lockedItems[item.id] || item.isLocked || false;
      
      return {
        i: item.id,
        x: item.position.x !== undefined ? item.position.x : 0,
        y: item.position.y !== undefined ? item.position.y : 0,
        w: item.position.w !== undefined ? item.position.w : columnSpan,
        h: item.position.h !== undefined ? item.position.h : 1,
        minW: 1,
        maxW: 4,
        static: isLocked, // Static if locked
        isDraggable: !isLocked && editable,
        isResizable: !isLocked && editable
      };
    });
    
    // Check for overlaps and fix them
    const fixedLayouts = preventOverlaps(newLayouts);
    
    setLayouts({ lg: fixedLayouts });
  }, [items, editable, lockedItems]);

  // Function to detect and fix overlaps
  const preventOverlaps = (layouts: Layout[]): Layout[] => {
    if (layouts.length <= 1) return layouts;
    
    // Sort by y position first, then x position
    const sortedLayouts = [...layouts].sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });
    
    const result: Layout[] = [sortedLayouts[0]];
    
    // For each layout, check if it overlaps with any existing layout in result
    for (let i = 1; i < sortedLayouts.length; i++) {
      let currentItem = {...sortedLayouts[i]};
      let hasOverlap = true;
      
      // Keep adjusting position until no overlap
      while (hasOverlap) {
        hasOverlap = false;
        
        for (const existingItem of result) {
          // Check if current item overlaps with existing item
          if (
            currentItem.x < existingItem.x + existingItem.w &&
            currentItem.x + currentItem.w > existingItem.x &&
            currentItem.y < existingItem.y + existingItem.h &&
            currentItem.y + currentItem.h > existingItem.y
          ) {
            hasOverlap = true;
            
            // Try to move right first
            if (currentItem.x + currentItem.w < 4) {
              currentItem.x = existingItem.x + existingItem.w;
            } 
            // If can't move right, move down
            else {
              currentItem.x = 0;
              currentItem.y = existingItem.y + existingItem.h;
            }
            
            break;
          }
        }
      }
      
      result.push(currentItem);
    }
    
    return result;
  };

  // Handle layout change
  const handleLayoutChange = (currentLayout: Layout[]) => {
    // Only update the layout state, don't trigger any repositioning
    setLayouts({ lg: currentLayout });
  };

  // Handle layout change when it's done (after dragging stops)
  const handleLayoutChangeComplete = (currentLayout: Layout[]) => {
    // Only update if we have items and the layout has items
    if (items.length === 0 || currentLayout.length === 0 || !onItemUpdate) return;
    
    // Check for overlaps and fix them
    const fixedLayout = preventOverlaps(currentLayout);
    
    // Update the layouts state with the fixed layout
    setLayouts({ lg: fixedLayout });
    
    // Update item positions in database without triggering repositioning
    fixedLayout.forEach((layout: Layout) => {
      const item = items.find(i => i.id === layout.i);
      // Skip locked items
      if (item && !lockedItems[item.id]) {
        // Only update if position actually changed
        if (
          item.position.x !== layout.x ||
          item.position.y !== layout.y ||
          item.position.w !== layout.w ||
          item.position.h !== layout.h
        ) {
          const updatedItem = {
            ...item,
            position: {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h
            }
          };
          onItemUpdate(updatedItem);
        }
      }
    });
  };

  // Wait until component is mounted to render the grid (client-side only)
  if (!mounted) return <div>Loading...</div>;

  return (
    <ResponsiveGridLayout
      key={`grid-${items.map(item => item.id).join('-')}`}
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
      rowHeight={275}
      isDraggable={editable}
      isResizable={editable}
      onLayoutChange={handleLayoutChange}
      onDragStop={handleLayoutChangeComplete}
      onResizeStop={handleLayoutChangeComplete}
      preventCollision={false}
      compactType={null}
      autoSize={false}
      verticalCompact={false}
      isBounded={false}
      useCSSTransforms={true}
      margin={[8, 8]}
      draggableHandle=".drag-handle"
      allowOverlap={true}
      onDrag={(layout, oldItem, newItem) => {
        // Prevent dragging locked items
        const itemToCheck = items.find(i => i.id === newItem.i);
        if (itemToCheck && (itemToCheck.isLocked || lockedItems[newItem.i])) {
          return false;
        }
      }}
      onResize={(layout, oldItem, newItem) => {
        // Prevent resizing locked items
        const itemToCheck = items.find(i => i.id === newItem.i);
        if (itemToCheck && (itemToCheck.isLocked || lockedItems[newItem.i])) {
          return false;
        }
      }}
    >
      {items.map((item) => (
        <div key={item.id}>
          <BentoItemComponent
            item={item}
            isSelected={selectedItem === item.id}
            onSelect={() => setSelectedItem(item.id)}
            onUpdate={onItemUpdate}
            onDelete={handleItemDelete}
            editable={editable}
            isLocked={lockedItems[item.id] || item.isLocked || false}
            onLockToggle={(id, isLocked) => {
              handleLockToggle(id, isLocked);
              if (onItemLockToggle) {
                onItemLockToggle(id, isLocked);
              }
            }}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
