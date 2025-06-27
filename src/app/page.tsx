'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import FlightCard from '@/components/FlightCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import FlightProgress from '@/components/FlightProgress';

interface FlightData {
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    terminal: string;
    gate: string;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    terminal: string;
    gate: string;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  airline: {
    name: string;
    iata: string;
  };
  flight: {
    number: string;
    iata: string;
  };
}

export default function Home() {
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchFlightData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // Simple API call without date parameter
    const response = await fetch('/api/flight?flight=IX322', {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    setFlightData(data.flight);
    setLastUpdated(new Date());
    setRefreshCount(prev => prev + 1);
    console.log('Flight data updated successfully');

  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch flight data:', err);
    } else {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to fetch flight data:', err);
    }
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchFlightData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('Auto-refreshing flight data...');
      fetchFlightData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchFlightData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Mobile-optimized container */}
      <div className="relative z-10 w-full px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile-friendly Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 mb-3 drop-shadow-lg leading-tight px-2">
            Flight Tracker ✈️
          </h1>
          <p className="text-base sm:text-lg text-pink-600 mb-2 px-2">
            Tracking IX 322 
          </p>
          {lastUpdated && (
            <div className="text-xs sm:text-sm text-pink-500 space-y-1 px-2">
              <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
              <p className="text-pink-400">Refresh #{refreshCount}</p>
            </div>
          )}
        </motion.div>

        {/* Flight Progress Bar */}
        {flightData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FlightProgress status={flightData.flight_status || 'scheduled'} />
          </motion.div>
        )}

        {/* Mobile-optimized Flight Card */}
        <div className="w-full mb-6 sm:mb-8">
          <FlightCard 
            flightData={flightData}
            loading={loading}
            error={error}
          />
        </div>

        {/* Mobile-friendly Refresh Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 sm:mb-8 px-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchFlightData}
            disabled={loading}
            className="w-full max-w-xs bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 
                     text-white font-bold py-4 px-6 rounded-2xl shadow-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 border-2 border-pink-300
                     text-sm sm:text-base
                     min-h-[52px] touch-manipulation"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Refreshing... 🔄</span>
              </div>
            ) : (
              'Refresh Flight Data 🔄'
            )}
          </motion.button>
        </motion.div>

        {/* Mobile-friendly Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center space-y-3 px-4 pb-4"
        >
          <p className="text-pink-600 font-semibold text-sm">
            Made with 💕 by debin
          </p>
          <div className="flex justify-center space-x-6 text-xl">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block"
            >
              ✈️
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="block"
            >
              💕
            </motion.span>
            <motion.span
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block"
            >
              🌸
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}