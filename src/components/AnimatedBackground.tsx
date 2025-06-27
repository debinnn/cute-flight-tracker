'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 390, height: 844 }); // iPhone 15 default
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  // Reduce animations on smaller screens for better performance
  const isMobile = windowSize.width < 640;
  const cloudCount = isMobile ? 3 : 5;
  const starCount = isMobile ? 8 : 15;
  const heartCount = isMobile ? 4 : 8;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Clouds - fewer on mobile */}
      {[...Array(cloudCount)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute text-3xl sm:text-4xl md:text-6xl opacity-15 sm:opacity-20"
          initial={{ x: -100, y: Math.random() * windowSize.height * 0.8 }}
          animate={{
            x: windowSize.width + 100,
            y: Math.random() * windowSize.height * 0.8,
          }}
          transition={{
            duration: isMobile ? 15 : 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * (isMobile ? 3 : 4),
            ease: "linear"
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Twinkling Stars - fewer on mobile */}
      {[...Array(starCount)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-lg sm:text-xl md:text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: isMobile ? 3 : 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Floating Hearts - fewer on mobile */}
      {[...Array(heartCount)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-xl sm:text-2xl md:text-3xl opacity-8 sm:opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: isMobile ? 5 : 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;