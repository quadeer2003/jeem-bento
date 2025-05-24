"use client";

import { BentoItem, RSSFeed, RSSFeedItem as RSSItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { RssIcon, Plus, Trash2, RefreshCw, ExternalLink, CheckCircle, Loader2 } from "lucide-react";

interface RSSFeedItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function RSSFeedItem({ item, onUpdate, editable }: RSSFeedItemProps) {
  const [feeds, setFeeds] = useState<RSSFeed[]>(item.content?.feeds || []);
  const [feedItems, setFeedItems] = useState<RSSItem[]>(item.content?.feedItems || []);
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string | 'all'>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      
      // If it's today, just show the time
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Otherwise show the date
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return "";
    }
  };

  // Add a new feed
  const addFeed = async () => {
    if (!newFeedUrl.trim()) {
      setError("Please enter a feed URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rss-feed?url=${encodeURIComponent(newFeedUrl)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch feed");
      }
      
      const data = await response.json();
      
      // Create a new feed
      const newFeed: RSSFeed = {
        id: Math.random().toString(36).substring(2, 9),
        title: data.title,
        url: newFeedUrl,
        favicon: data.favicon,
        bentoItemId: item.id,
        lastFetched: new Date().toISOString()
      };
      
      // Create feed items
      const newItems: RSSItem[] = data.items.map((feedItem: any) => ({
        id: feedItem.id,
        feedId: newFeed.id,
        title: feedItem.title,
        link: feedItem.link,
        pubDate: feedItem.pubDate,
        description: feedItem.description,
        isRead: false
      }));
      
      // Update state
      const updatedFeeds = [...feeds, newFeed];
      const updatedItems = [...feedItems, ...newItems];
      
      setFeeds(updatedFeeds);
      setFeedItems(updatedItems);
      
      // Update the item content
      onUpdate({
        ...item.content,
        feeds: updatedFeeds,
        feedItems: updatedItems
      });
      
      // Reset form
      setNewFeedUrl("");
      setIsAddingFeed(false);
    } catch (err) {
      console.error("Error adding feed:", err);
      setError(err instanceof Error ? err.message : "Failed to add feed");
    } finally {
      setLoading(false);
    }
  };

  // Remove a feed
  const removeFeed = (feedId: string) => {
    const updatedFeeds = feeds.filter(feed => feed.id !== feedId);
    const updatedItems = feedItems.filter(item => item.feedId !== feedId);
    
    setFeeds(updatedFeeds);
    setFeedItems(updatedItems);
    
    onUpdate({
      ...item.content,
      feeds: updatedFeeds,
      feedItems: updatedItems
    });
    
    // Reset selected feed if needed
    if (selectedFeed === feedId) {
      setSelectedFeed('all');
    }
  };

  // Refresh all feeds
  const refreshFeeds = async () => {
    if (feeds.length === 0) return;
    
    setLoading(true);
    
    try {
      // Fetch each feed in parallel
      const feedPromises = feeds.map(async (feed) => {
        try {
          const response = await fetch(`/api/rss-feed?url=${encodeURIComponent(feed.url)}`);
          
          if (!response.ok) {
            throw new Error(`Failed to refresh ${feed.title}`);
          }
          
          const data = await response.json();
          
          // Update feed
          const updatedFeed = {
            ...feed,
            title: data.title || feed.title,
            favicon: data.favicon || feed.favicon,
            lastFetched: new Date().toISOString()
          };
          
          // Create feed items
          const newItems = data.items.map((feedItem: any) => {
            // Check if item already exists
            const existingItem = feedItems.find(
              item => item.feedId === feed.id && 
                     (item.link === feedItem.link || item.title === feedItem.title)
            );
            
            if (existingItem) {
              return existingItem;
            }
            
            // Create new item
            return {
              id: feedItem.id,
              feedId: feed.id,
              title: feedItem.title,
              link: feedItem.link,
              pubDate: feedItem.pubDate,
              description: feedItem.description,
              isRead: false
            };
          });
          
          return {
            feed: updatedFeed,
            items: newItems
          };
        } catch (err) {
          console.error(`Error refreshing feed ${feed.title}:`, err);
          return {
            feed,
            items: feedItems.filter(item => item.feedId === feed.id)
          };
        }
      });
      
      const results = await Promise.all(feedPromises);
      
      // Combine all results
      const updatedFeeds = results.map(result => result.feed);
      const updatedItems = results.flatMap(result => result.items);
      
      // Sort by date (newest first)
      updatedItems.sort((a, b) => {
        const dateA = new Date(a.pubDate || 0);
        const dateB = new Date(b.pubDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setFeeds(updatedFeeds);
      setFeedItems(updatedItems);
      
      onUpdate({
        ...item.content,
        feeds: updatedFeeds,
        feedItems: updatedItems
      });
    } catch (err) {
      console.error("Error refreshing feeds:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark an item as read
  const markAsRead = (itemId: string) => {
    const updatedItems = feedItems.map(item => 
      item.id === itemId ? { ...item, isRead: true } : item
    );
    
    setFeedItems(updatedItems);
    
    onUpdate({
      ...item.content,
      feeds,
      feedItems: updatedItems
    });
  };

  // Toggle expanded view for an item
  const toggleItemExpanded = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Filter items based on selected feed
  const filteredItems = selectedFeed === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.feedId === selectedFeed);

  // Initial feed refresh
  useEffect(() => {
    if (feeds.length > 0 && feedItems.length === 0) {
      refreshFeeds();
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <select 
            value={selectedFeed}
            onChange={(e) => setSelectedFeed(e.target.value)}
            className="text-sm p-1 rounded bg-background border"
          >
            <option value="all">All Feeds</option>
            {feeds.map(feed => (
              <option key={feed.id} value={feed.id}>{feed.title}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          {feeds.length > 0 && (
            <button
              onClick={refreshFeeds}
              disabled={loading}
              className="flex items-center gap-1 text-xs p-1 rounded hover:bg-secondary"
              title="Refresh feeds"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          )}
          
          {editable && (
            <button
              onClick={() => setIsAddingFeed(true)}
              className="flex items-center gap-1 text-xs p-1 rounded hover:bg-secondary"
              title="Add feed"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
      
      {isAddingFeed ? (
        <div className="p-2 bg-secondary/20 rounded mb-2">
          <h4 className="text-sm font-medium mb-2">Add RSS Feed</h4>
          <input
            type="text"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className="w-full p-2 text-sm border rounded mb-2"
          />
          {error && <p className="text-destructive text-xs mb-2">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsAddingFeed(false);
                setError(null);
              }}
              className="px-2 py-1 text-xs bg-secondary rounded"
            >
              Cancel
            </button>
            <button
              onClick={addFeed}
              disabled={loading}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded flex items-center gap-1"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add Feed</>
              )}
            </button>
          </div>
        </div>
      ) : null}
      
      {feeds.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-secondary/20 rounded p-4">
          <div className="text-center">
            <RssIcon size={24} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {editable ? "Add RSS feeds to get started" : "No RSS feeds added yet"}
            </p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-secondary/20 rounded p-4">
          <p className="text-sm text-muted-foreground">No items in this feed</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <ul className="space-y-1">
            {filteredItems.map((feedItem) => {
              const feed = feeds.find(f => f.id === feedItem.feedId);
              const isExpanded = expandedItem === feedItem.id;
              
              return (
                <li 
                  key={feedItem.id} 
                  className={`p-2 rounded ${
                    feedItem.isRead ? 'bg-secondary/10' : 'bg-secondary/20'
                  } hover:bg-secondary/30 transition-colors`}
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleItemExpanded(feedItem.id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2">
                        {feed?.favicon ? (
                          <img 
                            src={feed.favicon} 
                            alt="" 
                            className="w-4 h-4 mt-1 flex-shrink-0" 
                          />
                        ) : (
                          <RssIcon size={16} className="mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className={`text-sm font-medium ${feedItem.isRead ? 'text-muted-foreground' : ''}`}>
                            {feedItem.title}
                          </h4>
                          {feedItem.pubDate && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(feedItem.pubDate)}
                              {selectedFeed === 'all' && feed && ` · ${feed.title}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!feedItem.isRead && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(feedItem.id);
                            }}
                            className="p-1 text-primary hover:bg-primary/10 rounded"
                            title="Mark as read"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <a 
                          href={feedItem.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(feedItem.id);
                          }}
                          className="p-1 text-primary hover:bg-primary/10 rounded"
                          title="Open link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                    
                    {isExpanded && feedItem.description && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: feedItem.description.substring(0, 500) + 
                                  (feedItem.description.length > 500 ? '...' : '') 
                          }} 
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {feeds.length > 0 && selectedFeed !== 'all' && editable && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => removeFeed(selectedFeed)}
            className="flex items-center gap-1 text-xs p-1 rounded text-destructive hover:bg-destructive/10"
            title="Remove this feed"
          >
            <Trash2 size={14} />
            Remove Feed
          </button>
        </div>
      )}
    </div>
  );
} 