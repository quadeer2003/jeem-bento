import { NextResponse } from 'next/server';

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
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to avoid downloading the full page content
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Website Status Checker (Jeem Bento App)'
        }
      });
      
      clearTimeout(timeoutId);
      
      // Check if the response is OK (status in the range 200-299)
      const isActive = response.ok;
      
      // Prepare response message
      let message = '';
      if (isActive) {
        message = `Status: ${response.status} ${response.statusText}`;
      } else if (response.status === 404) {
        message = '404 Not Found';
      } else {
        message = `Error: ${response.status} ${response.statusText}`;
      }
      
      return NextResponse.json({
        isActive,
        status: response.status,
        message
      });
    } catch (error) {
      // Handle fetch errors (network issues, timeouts, etc.)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return NextResponse.json({
        isActive: false,
        status: 'error',
        message: `Connection error: ${errorMessage}`
      });
    }
  } catch (error) {
    console.error('Error checking website status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 