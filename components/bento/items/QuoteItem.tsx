"use client";

import { BentoItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface QuoteItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

interface Quote {
  text: string;
  author: string;
}

export default function QuoteItem({ item, onUpdate, editable }: QuoteItemProps) {
  const [quote, setQuote] = useState<Quote>(
    item.content?.quote || { text: "", author: "" }
  );
  const [lastUpdated, setLastUpdated] = useState<string>(
    item.content?.lastUpdated || ""
  );
  const [loading, setLoading] = useState(false);

  // Fetch a quote from API-Ninjas
  const fetchQuote = async (): Promise<Quote> => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJAS_KEY || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          text: data[0].quote,
          author: data[0].author
        };
      } else {
        throw new Error('No quote returned');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback to a default quote if API fails
      return {
        text: "The best way to predict the future is to create it.",
        author: "Abraham Lincoln"
      };
    }
  };

  // Check if we need a new quote (once per day)
  const checkForNewQuote = async () => {
    const today = new Date().toDateString();
    
    if (lastUpdated !== today || !quote.text) {
      setLoading(true);
      try {
        const newQuote = await fetchQuote();
        setQuote(newQuote);
        setLastUpdated(today);
        
        onUpdate({
          ...item.content,
          quote: newQuote,
          lastUpdated: today
        });
      } catch (error) {
        console.error('Error getting quote:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Manually refresh quote
  const refreshQuote = async () => {
    setLoading(true);
    
    try {
      const newQuote = await fetchQuote();
      const today = new Date().toDateString();
      
      setQuote(newQuote);
      setLastUpdated(today);
      
      onUpdate({
        ...item.content,
        quote: newQuote,
        lastUpdated: today
      });
    } catch (error) {
      console.error('Error refreshing quote:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for new quote on mount
  useEffect(() => {
    checkForNewQuote();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center p-3 relative">
      {quote.text ? (
        <>
          <div className="text-2xl mb-1">"</div>
          <p className="text-sm font-medium italic mb-2">{quote.text}</p>
          <p className="text-right text-xs text-muted-foreground">— {quote.author}</p>
          
          {editable && (
            <button
              onClick={refreshQuote}
              disabled={loading}
              className="absolute top-1 right-1 p-1 bg-secondary rounded-full hover:bg-secondary/80"
              title="Get new quote"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="text-sm">{loading ? "Loading quote..." : "Failed to load quote"}</p>
        </div>
      )}
    </div>
  );
} 