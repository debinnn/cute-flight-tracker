'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
`;

const PlaneIcon = styled(motion.div)`
  font-size: 3rem;
  color: #ec4899;
`;

const LoadingText = styled(motion.div)`
  font-family: var(--font-pixel), monospace;
  font-size: 0.8rem;
  color: #be185d;
  text-align: center;
`;

const LoadingSpinner = () => {
  return (
    <LoaderContainer>
      <PlaneIcon
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✈️
      </PlaneIcon>
      <LoadingText
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Fetching cute flight data...
        <br />
        Please wait! ✨
      </LoadingText>
    </LoaderContainer>
  );
};

export default LoadingSpinner;
