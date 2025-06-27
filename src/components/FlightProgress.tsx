'use client';

import { motion } from 'framer-motion';

interface FlightProgressProps {
  status: string;
}

const getProgressFromStatus = (status: string): number => {
  const statusMap: { [key: string]: number } = {
    'scheduled': 10,
    'active': 50,
    'landed': 100,
    'cancelled': 0,
    'incident': 25,
    'diverted': 30
  };
  
  return statusMap[status?.toLowerCase()] || 10;
};

const getStatusIcon = (status: string): string => {
  const statusIcons: { [key: string]: string } = {
    'scheduled': '🛫',
    'active': '✈️',
    'landed': '🛬',
    'cancelled': '❌',
    'incident': '⚠️',
    'diverted': '🔄'
  };
  
  return statusIcons[status?.toLowerCase()] || '✈️';
};

const FlightProgress = ({ status }: FlightProgressProps) => {
  const progress = getProgressFromStatus(status);
  const statusIcon = getStatusIcon(status);

  return (
    <div className="w-full my-8">
      {/* Progress Bar Background */}
      <div className="w-full h-5 bg-pink-100 rounded-xl border-2 border-pink-300 relative overflow-hidden">
        {/* Progress Bar Fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-end pr-2"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Plane Icon */}
          <motion.div
            className="text-white text-base -mr-1"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {statusIcon}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Status Text */}
      <div className="font-pixel text-xs text-pink-800 text-center mt-2">
        Flight Status: {status} ({progress}% complete)
      </div>
      
      {/* Stage Labels */}
      <div className="flex justify-between mt-2 font-pixel text-xs text-pink-900">
        <span>🛫 Departure</span>
        <span>✈️ In Flight</span>
        <span>🛬 Arrival</span>
      </div>
    </div>
  );
};

const BASE_URL = 'https://api.aviationstack.com/v1';

export default FlightProgress;
