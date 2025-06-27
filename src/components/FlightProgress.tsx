'use client';

import { motion } from 'framer-motion';

interface FlightProgressProps {
  flightData: {
    flight_status: string;
    departure: {
      scheduled: string;
      actual: string;
      estimated: string;
    };
    arrival: {
      scheduled: string;
      actual: string;
      estimated: string;
    };
  };
}

const calculateFlightProgress = (flightData: FlightProgressProps['flightData']): number => {
  const { flight_status, departure, arrival } = flightData;
  
  // If flight hasn't departed yet
  if (flight_status === 'scheduled' || !departure.actual) {
    return 0;
  }
  
  // If flight has landed
  if (flight_status === 'landed' || arrival.actual) {
    return 100;
  }
  
  // If flight is cancelled or has issues
  if (flight_status === 'cancelled' || flight_status === 'incident') {
    return 0;
  }
  
  // Calculate progress for active flights
  if (flight_status === 'active' && departure.actual) {
    try {
      // Get departure time (actual or estimated)
      const departureTime = new Date(departure.actual || departure.estimated || departure.scheduled);
      
      // Get arrival time (estimated or scheduled)
      const arrivalTime = new Date(arrival.estimated || arrival.scheduled);
      
      // Current time
      const currentTime = new Date();
      
      // Calculate total flight duration
      const totalDuration = arrivalTime.getTime() - departureTime.getTime();
      
      // Calculate elapsed time since departure
      const elapsedTime = currentTime.getTime() - departureTime.getTime();
      
      // Calculate progress percentage
      const progress = Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);
      
      return Math.round(progress);
    } catch (error) {
      console.error('Error calculating flight progress:', error);
      return 10; // Default to 10% if calculation fails
    }
  }
  
  return 0;
};

const getStatusIcon = (status: string, progress: number): string => {
  if (progress === 0) return '🛫';
  if (progress === 100) return '🛬';
  if (status === 'active') return '✈️';
  if (status === 'cancelled') return '❌';
  if (status === 'incident') return '⚠️';
  if (status === 'diverted') return '🔄';
  return '✈️';
};

const getProgressColor = (progress: number): string => {
  if (progress === 0) return 'from-gray-400 to-gray-600';
  if (progress < 25) return 'from-blue-400 to-blue-600';
  if (progress < 75) return 'from-pink-400 to-pink-600';
  if (progress < 100) return 'from-orange-400 to-orange-600';
  return 'from-green-400 to-green-600';
};

const FlightProgress = ({ flightData }: FlightProgressProps) => {
  const progress = calculateFlightProgress(flightData);
  const statusIcon = getStatusIcon(flightData.flight_status, progress);
  const progressColor = getProgressColor(progress);

  // Calculate estimated time remaining
  const getTimeRemaining = (): string => {
    if (progress === 100 || flightData.flight_status === 'landed') {
      return 'Flight completed!';
    }
    
    if (progress === 0 || !flightData.departure.actual) {
      return 'Not departed yet';
    }
    
    try {
      const arrivalTime = new Date(flightData.arrival.estimated || flightData.arrival.scheduled);
      const currentTime = new Date();
      const remainingMs = arrivalTime.getTime() - currentTime.getTime();
      
      if (remainingMs <= 0) {
        return 'Should have arrived';
      }
      
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
      } else {
        return `${minutes}m remaining`;
      }
    } catch {
      return 'Time unknown';
    }
  };

  return (
    <div className="w-full my-6 sm:my-8 px-2 sm:px-4">
      {/* Progress Bar Background */}
      <div className="w-full h-4 sm:h-6 bg-pink-100 rounded-xl border-2 border-pink-300 relative overflow-hidden shadow-inner">
        {/* Progress Bar Fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${progressColor} rounded-lg flex items-center justify-end pr-1 sm:pr-2 shadow-sm`}
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Plane Icon */}
          {progress > 0 && (
            <motion.div
              className="text-white text-sm sm:text-base drop-shadow-sm"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {statusIcon}
            </motion.div>
          )}
        </motion.div>
        
        {/* Static departure icon when progress is 0 */}
        {progress === 0 && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-pink-600 text-sm sm:text-base">
            🛫
          </div>
        )}
      </div>
      
      {/* Progress Text */}
      <div className="font-pixel text-xs sm:text-sm text-pink-800 text-center mt-2 sm:mt-3 leading-relaxed">
        <div>Flight Progress: <span className="text-pink-600 font-bold">{progress}%</span></div>
        <div className="text-pink-600 mt-1">{getTimeRemaining()}</div>
      </div>
      
      {/* Stage Labels */}
      <div className="flex justify-between mt-3 sm:mt-4 font-pixel text-xs sm:text-sm text-pink-900 px-1">
        <span className={`text-center ${progress >= 0 ? 'text-pink-800 font-bold' : 'text-pink-400'}`}>
          🛫<br className="hidden sm:block"/>Departure
        </span>
        <span className={`text-center ${progress >= 50 ? 'text-pink-800 font-bold' : 'text-pink-400'}`}>
          ✈️<br className="hidden sm:block"/>In Flight
        </span>
        <span className={`text-center ${progress >= 100 ? 'text-green-800 font-bold' : 'text-pink-400'}`}>
          🛬<br className="hidden sm:block"/>Arrival
        </span>
      </div>

      {/* Flight Time Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="bg-pink-50 rounded-lg p-2 text-center">
          <div className="text-pink-600 font-semibold">Departed</div>
          <div className="text-pink-800">
            {flightData.departure.actual 
              ? new Date(flightData.departure.actual).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Asia/Riyadh' 
                })
              : 'Not yet'
            }
          </div>
        </div>
        <div className="bg-pink-50 rounded-lg p-2 text-center">
          <div className="text-pink-600 font-semibold">Expected Arrival</div>
          <div className="text-pink-800">
            {new Date(flightData.arrival.estimated || flightData.arrival.scheduled).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Kolkata' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightProgress;