"use client";

import { BentoItem } from "@/lib/types";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface PhotoItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function PhotoItem({ item, onUpdate, editable }: PhotoItemProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const filePath = `photos/${item.id}/${Math.random().toString(36).substring(2)}`;
      const { data, error: uploadError } = await supabase.storage
        .from('bento-items')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('bento-items')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Update the item content
      onUpdate({ 
        ...item.content,
        imageUrl,
        alt: file.name 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {item.content?.imageUrl ? (
        <div className="relative w-full">
          <img 
            src={item.content.imageUrl} 
            alt={item.content.alt || 'User photo'} 
            className="w-full h-full rounded-lg object-cover"
           
          />
          {editable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer bg-primary text-primary-foreground px-3 py-2 rounded">
                Change Photo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full p-10 bg-secondary/40 rounded-lg flex flex-col items-center justify-center">
          {editable ? (
            <>
              <p className="text-center mb-4">Upload a photo</p>
              <label className="cursor-pointer bg-primary text-primary-foreground px-3 py-2 rounded">
                Select Image
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
              {uploading && <p className="mt-2">Uploading...</p>}
              {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
            </>
          ) : (
            <p className="text-center">No photo uploaded</p>
          )}
        </div>
      )}
    </div>
  );
} 