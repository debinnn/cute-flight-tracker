'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const CloudContainer = styled(motion.div)`
  position: absolute;
  color: #fce7f3;
  font-size: 2rem;
  z-index: 1;
`;

const Cloud = ({ delay = 0 }: { delay?: number }) => {
  return (
    <CloudContainer
      className="animate-drift"
      initial={{ x: -100 }}
      animate={{ x: 'calc(100vw + 100px)' }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        top: `${Math.random() * 60 + 10}%`,
      }}
    >
      ☁️
    </CloudContainer>
  );
};

const FloatingClouds = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Cloud key={i} delay={i * 4} />
      ))}
    </>
  );
};

export default FloatingClouds;
