"use client";

import { BentoItem } from "@/lib/types";
import { useState } from "react";
import CalendarItem from "@/components/bento/items/CalendarItem";
import ContactsItem from "@/components/bento/items/ContactsItem";
import LinksItem from "@/components/bento/items/LinksItem";
import PhotoItem from "@/components/bento/items/PhotoItem";
import ScreenshotsItem from "@/components/bento/items/ScreenshotsItem";
import WebsitesItem from "@/components/bento/items/WebsitesItem";
import YoutubeItem from "@/components/bento/items/YoutubeItem";
import PomodoroItem from "@/components/bento/items/PomodoroItem";
import QuoteItem from "@/components/bento/items/QuoteItem";
import QuickMailItem from "@/components/bento/items/QuickMailItem";
import WeatherItem from "@/components/bento/items/WeatherItem";
import RSSFeedItem from "@/components/bento/items/RSSFeedItem";
import { 
  Pencil, 
  Trash2, 
  GripVertical,
  Lock,
  Unlock
} from "lucide-react";

interface BentoItemProps {
  item: BentoItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate?: (item: BentoItem) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
  onLockToggle?: (id: string, isLocked: boolean) => void;
  isLocked?: boolean;
}

export default function BentoItemComponent({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  editable = false,
  onLockToggle,
  isLocked = false
}: BentoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedContent: any) => {
    if (onUpdate) {
      onUpdate({
        ...item,
        content: updatedContent
      });
    }
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const renderItemContent = () => {
    switch (item.type) {
      case 'calendar':
        return <CalendarItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'contacts':
        return <ContactsItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'links':
        return <LinksItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'photo':
        return <PhotoItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'screenshots':
        return <ScreenshotsItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'websites':
        return <WebsitesItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'youtube':
        return <YoutubeItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'pomodoro':
        return <PomodoroItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'quote':
        return <QuoteItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'quickmail':
        return <QuickMailItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'weather':
        return <WeatherItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      case 'rssfeed':
        return <RSSFeedItem item={item} onUpdate={handleUpdate} editable={editable && isEditing} />;
      default:
        return <div>Unknown item type</div>;
    }
  };

  return (
    <div
      className={`group w-full h-full bg-transparent backdrop-blur-md bg-opacity-20 border border-white/20 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-0 h-full flex flex-col relative">
        {/* Controls overlay - only visible on hover */}
        {editable && (
          <div className="bento-controls absolute top-0 right-0 flex items-center gap-0.5 no-drag p-0.5">
            {!isLocked && (
              <div 
                className="drag-handle cursor-grab hover:bg-muted p-0.5 rounded"
              >
                <GripVertical size={14} className="text-muted-foreground" />
              </div>
            )}
            <div 
              className="cursor-pointer hover:bg-muted p-0.5 rounded no-drag"
              onClick={(e) => {
                e.stopPropagation();
                if (onLockToggle) {
                  onLockToggle(item.id, !isLocked);
                }
              }}
            >
              {isLocked ? (
                <Lock size={14} className="text-primary" />
              ) : (
                <Unlock size={14} />
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-0.5 hover:bg-muted rounded"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
              className="p-0.5 hover:bg-destructive/10 text-destructive rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
        
        {/* Title */}
        {item.title && (
          <h3 className="font-medium truncate text-lg mb-3 px-0.5 pt-0.5 ml-5">{item.title}</h3>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-auto px-0.5">
          {renderItemContent()}
        </div>
      </div>
    </div>
  );
} 