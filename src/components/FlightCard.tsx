'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

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

interface FlightCardProps {
  flightData: FlightData | null;
  loading: boolean;
  error: string | null;
}

const FlightCard: React.FC<FlightCardProps> = ({ flightData, loading, error }) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />;
      case 'active':
      case 'en-route':
        return <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 animate-bounce" />;
      case 'landed':
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'active':
      case 'en-route':
        return 'bg-pink-100 text-pink-800';
      case 'landed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 sm:border-4 border-pink-300 mx-2 sm:mx-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-pink-500 border-t-transparent rounded-full"
          />
          <p className="text-pink-800 font-bold text-sm sm:text-base">Loading flight data... ✈️</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 sm:border-4 border-pink-300 mx-2 sm:mx-4"
      >
        <div className="text-center">
          <p className="text-pink-800 font-bold mb-2 text-sm sm:text-base">Oops! Something went wrong 🥺</p>
          <p className="text-pink-600 text-xs sm:text-sm leading-relaxed">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!flightData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 sm:border-4 border-pink-300 mx-2 sm:mx-4"
      >
        <div className="text-center">
          <p className="text-pink-800 font-bold text-sm sm:text-base">No flight data available 💔</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 sm:border-4 border-pink-200 hover:shadow-2xl transition-all duration-300 mx-2 sm:mx-4"
    >
      {/* Mobile-optimized Flight Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-pink-800">
            {flightData.flight?.iata || 'IX 322'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(flightData.flight_status)}
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(flightData.flight_status)}`}>
            {flightData.flight_status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>

      {/* Mobile-stacked Flight Route */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        {/* Departure */}
        <div className="text-center">
          <div className="bg-pink-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-pink-700 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-bold text-pink-800 text-base sm:text-lg">
              {flightData.departure?.iata || 'DEP'}
            </h3>
            <p className="text-pink-600 text-xs sm:text-sm leading-tight">
              {flightData.departure?.airport || 'Departure Airport'}
            </p>
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="text-pink-700"><strong>Scheduled:</strong> {formatTime(flightData.departure?.scheduled)}</p>
            {flightData.departure?.estimated && (
              <p className="text-pink-700"><strong>Estimated:</strong> {formatTime(flightData.departure.estimated)}</p>
            )}
            {flightData.departure?.gate && (
              <p className="text-pink-700"><strong>Gate:</strong> {flightData.departure.gate}</p>
            )}
          </div>
        </div>

        {/* Mobile flight direction indicator */}
        <div className="flex items-center justify-center py-2 sm:py-0">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-pink-500 text-lg sm:text-2xl"
          >
            <span className="sm:hidden">✈️ ⬇️</span>
            <span className="hidden sm:inline">✈️ ➡️</span>
          </motion.div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="bg-pink-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-pink-700 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-bold text-pink-800 text-base sm:text-lg">
              {flightData.arrival?.iata || 'ARR'}
            </h3>
            <p className="text-pink-600 text-xs sm:text-sm leading-tight">
              {flightData.arrival?.airport || 'Arrival Airport'}
            </p>
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="text-pink-700"><strong>Scheduled:</strong> {formatTime(flightData.arrival?.scheduled)}</p>
            {flightData.arrival?.estimated && (
              <p className="text-pink-700"><strong>Estimated:</strong> {formatTime(flightData.arrival.estimated)}</p>
            )}
            {flightData.arrival?.gate && (
              <p className="text-pink-700"><strong>Gate:</strong> {flightData.arrival.gate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-friendly Airline Info */}
      <div className="bg-pink-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
        <p className="text-pink-800 font-semibold text-sm sm:text-base">
          {flightData.airline?.name || 'Airline'} ({flightData.airline?.iata || 'N/A'})
        </p>
      </div>
    </motion.div>
  );
};

export default FlightCard;