'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 sm:border-4 border-red-200 mx-2 sm:mx-4"
    >
      <div className="text-center space-y-4">
        {/* Error Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
        </motion.div>

        {/* Error Title */}
        <h3 className="font-pixel text-lg sm:text-xl text-red-800 mb-2">
          Oops! Something went wrong 🥺
        </h3>

        {/* Error Message */}
        <div className="bg-white bg-opacity-60 rounded-xl p-4 border border-red-200">
          <p className="text-red-700 text-sm sm:text-base leading-relaxed">
            {error}
          </p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 
                     text-white font-bold py-3 px-6 rounded-xl shadow-lg 
                     transition-all duration-300 border-2 border-pink-300
                     text-sm sm:text-base min-h-[44px] touch-manipulation
                     flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Try Again</span>
          </motion.button>
        )}

        {/* Cute encouragement message */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-pink-600 text-xs sm:text-sm"
        >
          Don&apos;t worry, we&apos;ll get your flight info soon! 🌸✈️
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;