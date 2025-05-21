"use client";

import { BentoItem } from "@/lib/types";
import { useState } from "react";

interface YoutubeItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function YoutubeItem({ item, onUpdate, editable }: YoutubeItemProps) {
  const [url, setUrl] = useState(item.content?.url || "");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
      // Handle different YouTube URL formats
      let videoId = "";
      
      // Regular video URL
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      
      if (match && match[2].length === 11) {
        videoId = match[2];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Playlist URL
      const playlistMatch = url.match(/list=([^&]+)/);
      if (playlistMatch) {
        const playlistId = playlistMatch[1];
        return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
      }
      
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSave = () => {
    const embedUrl = getYoutubeEmbedUrl(url);
    
    if (!embedUrl) {
      setError("Invalid YouTube URL");
      return;
    }
    
    setError(null);
    onUpdate({ 
      ...item.content,
      url,
      embedUrl
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full">
      {editable && isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube video or playlist URL"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button 
              className="px-3 py-1 bg-secondary rounded text-sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          {item.content?.embedUrl ? (
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={item.content.embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="w-full p-10 bg-secondary/40 rounded-lg flex flex-col items-center justify-center">
              {editable ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded"
                >
                  Add YouTube Video/Playlist
                </button>
              ) : (
                <p className="text-center">No YouTube content added</p>
              )}
            </div>
          )}
          
          {editable && item.content?.embedUrl && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary"
              >
                Change URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 