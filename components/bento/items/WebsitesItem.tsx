"use client";

import { BentoItem, Website } from "@/lib/types";
import { useState } from "react";
import { ExternalLink, Globe, Plus, Trash2 } from "lucide-react";

interface WebsitesItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function WebsitesItem({ item, onUpdate, editable }: WebsitesItemProps) {
  const [websites, setWebsites] = useState<Website[]>(item.content?.websites || []);
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newWebsite, setNewWebsite] = useState({ title: "", url: "" });

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const addWebsite = () => {
    if (!newWebsite.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!newWebsite.url.trim()) {
      setError("URL is required");
      return;
    }

    if (!validateUrl(newWebsite.url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    const website: Website = {
      id: Math.random().toString(36).substring(2, 9),
      title: newWebsite.title.trim(),
      url: newWebsite.url.trim(),
      bentoItemId: item.id
    };

    const updatedWebsites = [...websites, website];
    setWebsites(updatedWebsites);
    onUpdate({ ...item.content, websites: updatedWebsites });
    
    // Reset form
    setNewWebsite({ title: "", url: "" });
    setIsAddingWebsite(false);
    setError(null);
  };

  const removeWebsite = (id: string) => {
    const updatedWebsites = websites.filter(website => website.id !== id);
    setWebsites(updatedWebsites);
    onUpdate({ ...item.content, websites: updatedWebsites });
  };

  const getFaviconUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="w-full">
      {websites.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {websites.map(website => {
            const faviconUrl = getFaviconUrl(website.url);
            
            return (
              <div key={website.id} className="p-2 bg-secondary/30 rounded flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {faviconUrl ? (
                      <img 
                        src={faviconUrl} 
                        alt="" 
                        className="w-4 h-4 flex-shrink-0"
                      />
                    ) : (
                      <Globe size={16} className="flex-shrink-0" />
                    )}
                    <div className="font-medium truncate">{website.title}</div>
                  </div>
                  {editable && (
                    <button 
                      onClick={() => removeWebsite(website.id)}
                      className="text-destructive p-1 hover:bg-destructive/10 rounded ml-1 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-primary hover:underline flex items-center gap-1 self-end"
                >
                  Visit <ExternalLink size={12} />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary/20 rounded">
          {editable ? "Add active websites" : "No websites added"}
        </div>
      )}

      {editable && (
        <div className="mt-4">
          {isAddingWebsite ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newWebsite.title}
                onChange={(e) => setNewWebsite({ ...newWebsite, title: e.target.value })}
                placeholder="Website name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={newWebsite.url}
                onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                placeholder="URL (https://...)"
                className="w-full p-2 border rounded"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingWebsite(false);
                    setError(null);
                  }}
                  className="px-3 py-1 bg-secondary rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addWebsite}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                >
                  Add Website
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingWebsite(true)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={16} /> Add Website
            </button>
          )}
        </div>
      )}
    </div>
  );
} 