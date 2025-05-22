"use client";

import { BentoItem, Link } from "@/lib/types";
import { useState, useEffect } from "react";
import { ExternalLink, Plus, Trash2, Globe } from "lucide-react";

interface LinksItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

interface LinkMetadata {
  title?: string;
  description?: string;
  domain?: string;
}

export default function LinksItem({ item, onUpdate, editable }: LinksItemProps) {
  const [links, setLinks] = useState<Link[]>(item.content?.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, LinkMetadata>>({});

  // Load metadata for links
  useEffect(() => {
    const fetchMetadata = async () => {
      const newMetadata: Record<string, LinkMetadata> = {};
      
      for (const link of links) {
        try {
          const domain = new URL(link.url).hostname;
          
          // For demonstration, we're extracting domain only
          // In a real implementation, you would use an API to fetch actual metadata
          newMetadata[link.id] = {
            domain,
            description: `Content from ${domain}`,
          };
        } catch (e) {
          console.error("Error parsing URL:", e);
        }
      }
      
      setMetadata(newMetadata);
    };
    
    fetchMetadata();
  }, [links]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
    } catch (e) {
      return null;
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
        <div className="space-y-2">
          {links.map(link => {
            const faviconUrl = getFaviconUrl(link.url);
            
            return (
              <div key={link.id} className="flex flex-col  py-2 px-2 ml-5 rounded ">
                <div className="flex w-full mb-1 mt-4">
                  <div className="flex mt-4"></div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex gap-2 text-primary hover:underline "
                  >
                    {faviconUrl ? (
                      <img 
                        src={faviconUrl} 
                        alt="" 
                        className="w-4 h-4 flex-shrink-0"
                      />
                    ) : (
                      <Globe size={14} className="flex-shrink-0" />
                    )}
                    <span className="font-medium">{link.title}</span>
                  </a>
                  <div className="flex-1 flex justify-end">
                    {editable && (
                      <button 
                        onClick={() => removeLink(link.id)}
                        className="text-destructive p-0.5 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                
                {metadata[link.id] && (
                  <div className="text-xs text-muted-foreground ">
                    <p>{metadata[link.id].domain}</p>
                   
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className=" p-1  rounded text-md">
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
                className="w-full p-1 border rounded text-md"
              />
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="URL (https://...)"
                className="w-full p-1 border rounded text-md"
              />
              {error && <p className="text-destructive text-md">{error}</p>}
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => {
                    setIsAddingLink(false);
                    setError(null);
                  }}
                  className="px-1 py-0.5 bg-secondary rounded text-md"
                >
                  Cancel
                </button>
                <button
                  onClick={addLink}
                  className="px-1 py-0.5 bg-primary text-primary-foreground rounded text-md"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingLink(true)}
              className="flex  gap-0.5 text-md text-primary"
            >
              <Plus size={12} /> Add Link
            </button>
          )}
        </div>
      )}
    </div>
  );
} 