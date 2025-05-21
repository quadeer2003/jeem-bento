"use client";

import { BentoItem, Link } from "@/lib/types";
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

interface LinksItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function LinksItem({ item, onUpdate, editable }: LinksItemProps) {
  const [links, setLinks] = useState<Link[]>(item.content?.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const addLink = () => {
    if (!newLink.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!newLink.url.trim()) {
      setError("URL is required");
      return;
    }

    if (!validateUrl(newLink.url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    const updatedLinks = [
      ...links,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: newLink.title,
        url: newLink.url,
        bentoItemId: item.id
      }
    ];

    setLinks(updatedLinks);
    onUpdate({ ...item.content, links: updatedLinks });
    setNewLink({ title: "", url: "" });
    setIsAddingLink(false);
    setError(null);
  };

  const removeLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    onUpdate({ ...item.content, links: updatedLinks });
  };

  return (
    <div className="w-full">
      {links.length > 0 ? (
        <div className="space-y-1">
          {links.map(link => (
            <div key={link.id} className="flex items-center justify-between py-1 px-1 bg-secondary/30 rounded text-xs">
              <div className="flex items-center gap-1 overflow-hidden">
                <ExternalLink size={12} className="flex-shrink-0" />
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {link.title}
                </a>
              </div>
              {editable && (
                <button 
                  onClick={() => removeLink(link.id)}
                  className="text-destructive p-0.5 hover:bg-destructive/10 rounded"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-1 bg-secondary/20 rounded text-xs">
          {editable ? "Add links" : "No links"}
        </div>
      )}

      {editable && (
        <div className="mt-1">
          {isAddingLink ? (
            <div className="space-y-1">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link title"
                className="w-full p-1 border rounded text-xs"
              />
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="URL (https://...)"
                className="w-full p-1 border rounded text-xs"
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => {
                    setIsAddingLink(false);
                    setError(null);
                  }}
                  className="px-1 py-0.5 bg-secondary rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={addLink}
                  className="px-1 py-0.5 bg-primary text-primary-foreground rounded text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingLink(true)}
              className="flex items-center gap-0.5 text-xs text-primary"
            >
              <Plus size={12} /> Add Link
            </button>
          )}
        </div>
      )}
    </div>
  );
} 