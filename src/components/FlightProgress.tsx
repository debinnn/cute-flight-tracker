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
    <div className="w-full my-6 sm:my-8 px-2 sm:px-4">
      {/* Progress Bar Background */}
      <div className="w-full h-4 sm:h-6 bg-pink-100 rounded-xl border-2 border-pink-300 relative overflow-hidden shadow-inner">
        {/* Progress Bar Fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-end pr-1 sm:pr-2 shadow-sm"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Plane Icon */}
          <motion.div
            className="text-white text-sm sm:text-base drop-shadow-sm"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {statusIcon}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Status Text */}
      <div className="font-pixel text-xs sm:text-sm text-pink-800 text-center mt-2 sm:mt-3 leading-relaxed">
        Flight Status: <span className="text-pink-600 font-bold">{status}</span> ({progress}% complete)
      </div>
    </div>
  );
};

export default FlightProgress;