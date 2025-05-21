"use client";

import { BentoItem, Screenshot } from "@/lib/types";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2 } from "lucide-react";

interface ScreenshotsItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function ScreenshotsItem({ item, onUpdate, editable }: ScreenshotsItemProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>(item.content?.screenshots || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isAddingScreenshot, setIsAddingScreenshot] = useState(false);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newTitle.trim()) {
      setError("Please enter a title for the screenshot");
      return;
    }

    // Reset error
    setError(null);

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase storage
      const filePath = `screenshots/${item.id}/${Math.random().toString(36).substring(2)}`;
      const { data, error: uploadError } = await supabase.storage
        .from('bento-items')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('bento-items')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const newScreenshot: Screenshot = {
        id: Math.random().toString(36).substring(2, 9),
        title: newTitle,
        imageUrl,
        bentoItemId: item.id
      };

      const updatedScreenshots = [...screenshots, newScreenshot];
      
      // Update the item content
      setScreenshots(updatedScreenshots);
      onUpdate({ ...item.content, screenshots: updatedScreenshots });
      
      // Reset form
      setNewTitle("");
      setIsAddingScreenshot(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeScreenshot = (id: string) => {
    const updatedScreenshots = screenshots.filter(screenshot => screenshot.id !== id);
    setScreenshots(updatedScreenshots);
    onUpdate({ ...item.content, screenshots: updatedScreenshots });
  };

  return (
    <div className="w-full">
      {screenshots.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {screenshots.map(screenshot => (
            <div key={screenshot.id} className="relative group">
              <img 
                src={screenshot.imageUrl} 
                alt={screenshot.title} 
                className="w-full h-auto rounded object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="text-white font-medium truncate">{screenshot.title}</div>
                {editable && (
                  <button 
                    onClick={() => removeScreenshot(screenshot.id)}
                    className="self-end text-white bg-destructive/80 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary/20 rounded">
          {editable ? "Add screenshots" : "No screenshots added"}
        </div>
      )}

      {editable && (
        <div className="mt-4">
          {isAddingScreenshot ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Screenshot title"
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center justify-between">
                <label className="cursor-pointer bg-primary text-primary-foreground px-3 py-2 rounded text-sm">
                  Select Image
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={() => {
                    setIsAddingScreenshot(false);
                    setError(null);
                  }}
                  className="px-3 py-1 bg-secondary rounded text-sm"
                >
                  Cancel
                </button>
              </div>
              {uploading && <p className="mt-2 text-sm">Uploading...</p>}
              {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
            </div>
          ) : (
            <button
              onClick={() => setIsAddingScreenshot(true)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={16} /> Add Screenshot
            </button>
          )}
        </div>
      )}
    </div>
  );
} 