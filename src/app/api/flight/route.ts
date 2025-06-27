import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flight = searchParams.get('flight') || 'IX322';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]; // Default to today
    
    const API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Build the API URL with date parameter
    const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flight}&flight_date=${date}&limit=1`;
    
    console.log(`Fetching flight data for ${flight} on ${date}...`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FlightTracker/1.0',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`AviationStack API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
    }

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { 
          error: `No flight data found for ${flight} on ${date}. The flight may not be scheduled for this date.`,
          flight: null 
        },
        { status: 404 }
      );
    }

    const flightInfo = data.data[0];
    
    return NextResponse.json({
      flight: flightInfo,
      timestamp: new Date().toISOString(),
      date_requested: date
    });

  } catch (error: unknown) {
    console.error('Flight API Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: 'Request timeout - AviationStack API is taking too long to respond' },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching flight data' },
      { status: 500 }
    );
  }
}