import { NextRequest, NextResponse } from 'next/server';

const AVIATIONSTACK_API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get('flight') || 'IX322';

    // Validate API key
    if (!AVIATIONSTACK_API_KEY) {
      console.error('AviationStack API key not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Validate flight number format
    if (!flightNumber || flightNumber.length < 2) {
      return NextResponse.json(
        { error: 'Invalid flight number format' },
        { status: 400 }
      );
    }

    console.log(`Fetching data for flight: ${flightNumber}`);

    const apiUrl = `${BASE_URL}/flights?access_key=${AVIATIONSTACK_API_KEY}&flight_iata=${flightNumber}&limit=1`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('AviationStack API error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Flight data service unavailable' },
        { status: 400 }
      );
    }

    // Check if flight data exists
    if (!data.data || data.data.length === 0) {
      console.log(`No data found for flight: ${flightNumber}`);
      return NextResponse.json(
        { error: `Flight ${flightNumber} not found. Please check the flight number and try again.` },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched data for flight: ${flightNumber}`);
    return NextResponse.json({ 
      flight: data.data[0],
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Flight API Error:', error);
    
    // Handle different types of errors with proper type checking
    if (error instanceof Error) {
      // Handle different types of errors
      if (error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error. Please check your connection.' },
          { status: 503 }
        );
      }

      // Return the actual error message for Error instances
      return NextResponse.json(
        { error: error.message || 'Failed to fetch flight data. Please try again later.' },
        { status: 500 }
      );
    }

    // Handle non-Error objects
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
