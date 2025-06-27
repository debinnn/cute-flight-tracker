import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flight = searchParams.get('flight') || 'IX322';
    
    const API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Simple API call without date - works with free plan
    const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flight}&limit=1`;
    
    console.log(`Fetching flight data for ${flight}...`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FlightTracker/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage = `AviationStack API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage = `API Error: ${errorData.error.message || errorData.error.info || 'Unknown error'}`;
        }
      } catch {
        errorMessage = `API Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`API Error: ${data.error.message || data.error.info || 'Unknown error'}`);
    }

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { 
          error: `No flight data found for ${flight}. The flight may not be currently active.`,
          flight: null 
        },
        { status: 404 }
      );
    }

    const flightInfo = data.data[0];
    
    return NextResponse.json({
      flight: flightInfo,
      timestamp: new Date().toISOString()
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