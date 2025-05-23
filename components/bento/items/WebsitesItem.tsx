"use client";

import { BentoItem, Website } from "@/lib/types";
import { useState } from "react";
import { Globe, Plus, Trash2, RefreshCw, Check, X, AlertCircle, Loader2 } from "lucide-react";

interface WebsitesItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

interface WebsiteWithStatus extends Website {
  status?: 'ok' | 'error' | 'loading';
  statusMessage?: string;
}

export default function WebsitesItem({ item, onUpdate, editable }: WebsitesItemProps) {
  const [websites, setWebsites] = useState<WebsiteWithStatus[]>(item.content?.websites || []);
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newWebsite, setNewWebsite] = useState({ title: "", url: "" });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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

    const website: WebsiteWithStatus = {
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

  // Check status of a single website
  const checkWebsiteStatus = async (website: WebsiteWithStatus): Promise<WebsiteWithStatus> => {
    try {
      // Use a serverless function or API route to check website status
      // For now, we'll use a simple fetch with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/check-website-status?url=${encodeURIComponent(website.url)}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return {
          ...website,
          status: data.isActive ? 'ok' : 'error',
          statusMessage: data.message
        };
      } else {
        return {
          ...website,
          status: 'error',
          statusMessage: `Error: ${response.status} ${response.statusText}`
        };
      }
    } catch (err) {
      return {
        ...website,
        status: 'error',
        statusMessage: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  };

  // Check status of all websites
  const checkAllWebsites = async () => {
    if (websites.length === 0) return;
    
    setIsCheckingStatus(true);
    
    // Mark all websites as loading
    const loadingWebsites = websites.map(website => ({
      ...website,
      status: 'loading' as const
    }));
    
    setWebsites(loadingWebsites);
    
    try {
      // Check status of each website in parallel
      const results = await Promise.all(
        loadingWebsites.map(website => checkWebsiteStatus(website))
      );
      
      setWebsites(results);
      onUpdate({ ...item.content, websites: results });
    } catch (err) {
      console.error('Error checking websites:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="w-full">
      {/* Status check button */}
      {websites.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={checkAllWebsites}
            disabled={isCheckingStatus}
            className="flex items-center gap-1 text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80"
            title="Check if all websites are active"
          >
            {isCheckingStatus ? (
              <>
                <Loader2 size={14} className="animate-spin" /> 
                Checking...
              </>
            ) : (
              <>
                <RefreshCw size={14} /> 
                Check Status
              </>
            )}
          </button>
        </div>
      )}

      {websites.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {websites.map(website => {
            const faviconUrl = getFaviconUrl(website.url);
            
            return (
              <div key={website.id} className="p-2 bg-secondary/30 rounded flex flex-col">
                <div className="flex justify-between items-start">
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 overflow-hidden hover:underline text-primary"
                  >
                    <div className="flex-shrink-0">
                      {faviconUrl ? (
                        <img 
                          src={faviconUrl} 
                          alt="" 
                          className="w-4 h-4"
                        />
                      ) : (
                        <Globe size={16} />
                      )}
                    </div>
                    <div className="font-medium truncate">{website.title}</div>
                    {website.status && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        website.status === 'ok' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : website.status === 'error'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {website.status === 'ok' ? 'Active' : website.status === 'error' ? 'Error' : 'Checking...'}
                      </span>
                    )}
                  </a>
                  {editable && (
                    <button 
                      onClick={() => removeWebsite(website.id)}
                      className="text-destructive p-1 hover:bg-destructive/10 rounded ml-1 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {website.status === 'error' && website.statusMessage && (
                  <div className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span className="truncate">{website.statusMessage}</span>
                  </div>
                )}
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