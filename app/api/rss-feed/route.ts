import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Simple RSS parser function
async function parseRSS(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RSS Feed Reader (Jeem Bento App)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const $ = cheerio.load(text, { xmlMode: true });
    
    // Get feed title
    const feedTitle = $('channel > title').text() || $('feed > title').text() || 'Unknown Feed';
    
    // Extract items
    const items: any[] = [];
    
    // Handle standard RSS
    $('item').each((_i: number, el: any) => {
      const $el = $(el);
      
      const title = $el.find('title').text();
      const link = $el.find('link').text() || $el.find('link').attr('href') || '';
      const pubDate = $el.find('pubDate').text() || $el.find('pubDate').attr('date') || '';
      
      // Extract description and clean it
      let description = $el.find('description').text();
      if (!description) {
        description = $el.find('content\\:encoded').text() || '';
      }
      
      if (title && link) {
        items.push({
          id: Math.random().toString(36).substring(2, 15),
          title,
          link,
          pubDate,
          description
        });
      }
    });
    
    // Handle Atom feeds
    $('entry').each((_i: number, el: any) => {
      const $el = $(el);
      
      const title = $el.find('title').text();
      const link = $el.find('link').attr('href') || '';
      const pubDate = $el.find('published').text() || $el.find('updated').text() || '';
      
      // Extract description/content
      let description = $el.find('content').text();
      if (!description) {
        description = $el.find('summary').text() || '';
      }
      
      if (title && link) {
        items.push({
          id: Math.random().toString(36).substring(2, 15),
          title,
          link,
          pubDate,
          description
        });
      }
    });
    
    return {
      title: feedTitle,
      items: items.slice(0, 20) // Limit to 20 items
    };
  } catch (error) {
    console.error('Error parsing RSS:', error);
    throw error;
  }
}

// Get favicon for a feed
async function getFavicon(url: string) {
  try {
    const parsedUrl = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    try {
      const feed = await parseRSS(url);
      const favicon = await getFavicon(url);
      
      return NextResponse.json({
        ...feed,
        favicon
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to parse RSS feed';
        
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in RSS feed route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 